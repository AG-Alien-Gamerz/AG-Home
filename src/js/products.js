import { auth, db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getTranslated } from './db-translator.js';
import { t, applyTranslations, getCurrentLanguage } from './localization.js';
import { PLATFORMS, normalizeProduct, productActions, safeURL, productHref, findProduct, escapeHTML as esc } from './product-model.js';
import { watchCatalogue } from './product-data.js';
import { watchOrganization } from './team-data.js';
import { developmentBadges, ownerLinks, productDescription, productFacts } from './product-presentation.js';
import { toast, busy } from './ui.js';
import { canUseSensitiveFeatures } from './auth-validation.js';
import { matchesCatalogue } from './catalogue-filter.js';

function price(value) {
    const number = Number(value) || 0;
    if (number <= 0) return t('product.free');
    return new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'PKR', maximumFractionDigits: 2 }).format(number);
}
export function platformBadges(product) {
    const data = normalizeProduct(product);
    return `<div class="platform-badges" aria-label="${esc(t('editor.compatibility'))}">${PLATFORMS.filter(p => data.platforms[p.id]).map(p => `<span class="platform-badge"><span aria-hidden="true">${p.icon}</span>${esc(t(p.label))}</span>`).join('')}</div>`;
}
export function actionButtons(product) {
    return `<div class="product-links">${productActions(product).map(action => `<a class="${action.id === 'downloadSite' ? 'primary-btn' : 'secondary-btn'}" href="${esc(action.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">${action.icon}</span> ${esc(t(action.action))}</a>`).join('')}</div>`;
}
let organization = { members: [], nodes: [] };
let persistedIds = new Set();
function hasPrice(product) { return product.price !== null && product.price !== undefined && Number.isFinite(Number(product.price)); }
function locationProduct() {
    try { return new URLSearchParams(location.hash.slice(1)).get('product') || decodeURIComponent(location.hash.slice(1)); } catch { return ''; }
}
class ProductCatalogue {
    constructor() {
        this.products = []; this.categories = ['ALL']; this.current = 'ALL'; this.platform = 'ALL'; this.search = ''; this.index = 0; this.failed = false; this.loading = true;
        this.mountFilters(); this.setupWheel(); this.subscribe();
        watchOrganization(value => {
            organization = value; this.render();
            if (window.currentProduct && !document.getElementById('productDetailsModal').classList.contains('hidden')) showProductDetails(window.currentProductId, window.currentProduct);
        });
        window.addEventListener('hashchange', () => this.followLocation());
        window.addEventListener('popstate', () => this.followLocation());
        document.addEventListener('DOMContentLoaded', () => this.followLocation(), { once: true });
        document.getElementById('productDetailsModal').addEventListener('modalclose', () => clearProductLocation());
        window.addEventListener('languageChanged', () => { this.renderCategories(); this.render(); if (window.currentProduct && !document.getElementById('productDetailsModal').classList.contains('hidden')) showProductDetails(window.currentProductId, window.currentProduct); });
    }
    mountFilters() {
        const controls = document.createElement('div'); controls.className = 'catalogue-toolbar';
        controls.innerHTML = '<div><label for="productSearch" data-i18n="product.search"></label><input id="productSearch" type="search" data-i18n-placeholder="product.search"></div><div><label for="productCategory" data-i18n="product.category"></label><select id="productCategory"></select></div><div><label for="productPlatform" data-i18n="editor.compatibility"></label><select id="productPlatform"></select></div><button id="retryProducts" class="secondary-btn" hidden data-i18n="btn.submit"></button>';
        document.getElementById('productsGrid').before(controls);
        document.getElementById('productSearch').oninput = event => { this.search = event.target.value.toLocaleLowerCase(); this.render(); };
        document.getElementById('productCategory').onchange = event => this.select(event.target.value);
        document.getElementById('productPlatform').onchange = event => { this.platform = event.target.value; this.render(); };
        document.getElementById('retryProducts').onclick = () => this.subscribe(); applyTranslations();
        const heading = document.createElement('section'); heading.className = 'catalogue-heading';
        heading.innerHTML = `<span class="eyebrow">AG HOME</span><h2 data-i18n="nav.products">${t('nav.products')}</h2><p data-i18n="business.description">${t('business.description')}</p>`;
        document.querySelector('.products-section').prepend(heading);
    }
    subscribe() {
        this.unsubscribe?.(); this.failed = false;
        const loading = document.getElementById('loadingMsg'); loading.hidden = false; loading.style.display = ''; loading.textContent = t('product.loadingProducts');
        this.unsubscribe = watchCatalogue((products, state) => {
            this.loading = state.source === 'loading';
            this.failed = Boolean(state.error);
            persistedIds = new Set(state.persistedIds);
            this.products = products.slice().sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            this.categories = ['ALL', ...new Set(this.products.map(p => p.category || p.category_en || p.category_ur).filter(Boolean))];
            if (!this.categories.includes(this.current)) this.current = 'ALL';
            this.index = this.categories.indexOf(this.current); loading.hidden = !this.loading && !state.error;
            loading.dataset.i18n = state.error ? 'catalogue.catalogueLoadError' : 'product.loadingProducts';
            loading.textContent = t(loading.dataset.i18n); loading.classList.toggle('catalogue-notice', Boolean(state.error));
            document.getElementById('retryProducts').hidden = !state.error;
            this.renderCategories(); this.render();
            if (window.currentProductId) {
                const product = findProduct(this.products, window.currentProductId);
                if (!product) closeProductDetailsModal(false);
                else if (!document.getElementById('productDetailsModal').classList.contains('hidden')) showProductDetails(product.id, product);
            }
            if (document.readyState !== 'loading') this.followLocation();
        });
    }
    followLocation() {
        const key = locationProduct(), product = findProduct(this.products, key);
        if (!key) { closeProductDetailsModal(false); return; }
        if (!product) return;
        // A shared deep link identifies a product even when saved filters differ.
        if (this.current !== 'ALL' || this.platform !== 'ALL' || this.search) {
            this.current = this.platform = 'ALL'; this.search = ''; document.getElementById('productSearch').value = ''; this.renderCategories(); this.render();
        }
        const card = document.getElementById(`product-${product.id}`);
        card?.scrollIntoView({ block: 'center', behavior: 'instant' });
        showProductDetails(product.id, product);
    }
    categoryName(category) {
        if (category === 'ALL') return t('product.all');
        const product = this.products.find(p => (p.category || p.category_en || p.category_ur) === category);
        return product ? getTranslated(product, 'category') : category;
    }
    renderCategories() {
        const platforms = document.getElementById('productPlatform'); platforms.replaceChildren(new Option(t('product.all'), 'ALL'));
        PLATFORMS.forEach(platform => platforms.add(new Option(t(platform.label), platform.id))); platforms.value = this.platform;
        const select = document.getElementById('productCategory'); select.replaceChildren();
        this.categories.forEach(category => select.add(new Option(this.categoryName(category), category))); select.value = this.current;
        document.querySelectorAll('#filterWheel .wheel-item').forEach((item, i) => { const category = this.categories[(this.index + i) % this.categories.length]; item.textContent = this.categoryName(category); item.classList.toggle('active', i === 0); });
    }
    select(category) { this.current = category; this.index = this.categories.indexOf(category); this.renderCategories(); this.render(); document.getElementById('categoryModal').classList.add('hidden'); }
    setupWheel() {
        const wheel = document.getElementById('filterWheel'); if (!wheel) return;
        wheel.tabIndex = 0; wheel.setAttribute('role', 'button'); wheel.setAttribute('aria-label', t('modal.selectCategory'));
        const rotate = direction => this.select(this.categories[(this.index + direction + this.categories.length) % this.categories.length]);
        wheel.onclick = () => rotate(1); wheel.onwheel = event => { event.preventDefault(); rotate(event.deltaY > 0 ? 1 : -1); };
        wheel.onkeydown = event => { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); rotate(event.key === 'ArrowUp' ? -1 : 1); } };
        wheel.oncontextmenu = event => {
            event.preventDefault(); const list = document.getElementById('categoryList'); list.replaceChildren();
            this.categories.forEach(category => { const btn = document.createElement('button'); btn.className = 'category-btn'; btn.textContent = this.categoryName(category); btn.onclick = () => this.select(category); list.append(btn); });
            document.getElementById('categoryModal').classList.remove('hidden');
        };
        document.querySelector('.category-modal-close')?.addEventListener('click', () => document.getElementById('categoryModal').classList.add('hidden'));
        // Keep the established wheel available as an optional browsing control.
        const wheelContainer = document.querySelector('.filter-wheel-container'); const details = document.createElement('details'); details.className = 'wheel-disclosure';details.hidden=true;
        const summary = document.createElement('summary'); summary.dataset.i18n = 'modal.selectCategory'; summary.textContent = t('modal.selectCategory'); wheelContainer.before(details); details.append(summary, wheelContainer);
    }
    render() {
        const grid = document.getElementById('productsGrid'); grid.replaceChildren(); grid.classList.toggle('list-view', localStorage.getItem('viewMode') === 'list');
        if (this.failed) return;
        if (this.loading && !this.products.length) return;
        const products = this.products.filter(product => matchesCatalogue(product, { category: this.current, platform: this.platform, search: this.search }, [getTranslated(product, 'name'), getTranslated(product, 'description'), getTranslated(product, 'category'), ...(product.tags || [])].join(' ')));
        if (!products.length) { const p = document.createElement('p'); p.className = 'no-products'; p.dataset.i18n = 'product.noProducts'; p.textContent = t('product.noProducts'); grid.append(p); return; }
        for (const product of products) {
            const card = document.createElement('article'); card.className = 'product-card'; card.id = `product-${product.id}`; card.dataset.productId = product.id;
            const name = getTranslated(product, 'name'), image = safeURL(product.image, { image: true });
            const areas = developmentBadges(product);
            card.innerHTML = `<div class="product-image">${image ? `<img src="${esc(image)}" alt="${esc(name)}" loading="lazy">` : '<span class="product-monogram" aria-hidden="true">AG</span>'}</div><div class="product-info"><p class="product-category">${esc(getTranslated(product, 'category'))}</p><div class="product-card-title"><h3 class="product-name" dir="auto">${esc(name)}</h3>${product.version ? `<span class="product-version">${esc(product.version)}</span>` : ''}</div><p class="product-description">${esc(productDescription(product))}</p>${hasPrice(product) ? `<p class="product-price">${esc(price(product.price))}</p>` : ''}${platformBadges(product)}${areas ? `<details class="card-development"><summary>${esc(t('catalogue.developmentCategories'))}</summary>${areas}</details>` : ''}${ownerLinks(product, organization.members)}${actionButtons(product)}<a class="details-button text-button" href="${esc(productHref(product))}" data-i18n="product.viewDetails">${t('product.viewDetails')}</a></div>`;
            card.querySelector('.product-image img')?.addEventListener('error',event=>{const fallback=document.createElement('span');fallback.className='product-monogram';fallback.textContent='AG';fallback.setAttribute('aria-hidden','true');event.currentTarget.replaceWith(fallback);},{once:true});
            card.querySelector('.details-button').onclick = event => { event.preventDefault(); history.pushState(null, '', productHref(product)); showProductDetails(product.id, product); }; grid.append(card);
        }
    }
}
export function showProductDetails(id, product) {
    window.currentProductId = id; window.currentProduct = product;
    const reportButton = document.getElementById('reportProductBtn');
    reportButton.hidden = !persistedIds.has(id);
    reportButton.parentElement.hidden = reportButton.hidden;
    const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value ?? ''; };
    set('detailsProductName', getTranslated(product, 'name')); set('detailsName', getTranslated(product, 'name')); set('detailsCategory', getTranslated(product, 'category')); set('detailsPrice', price(product.price));
    document.getElementById('detailsPrice').closest('.details-row').hidden = !hasPrice(product);
    const image = document.getElementById('detailsProductImage'), imageURL = safeURL(product.image, { image: true });
    const imageSection = image.closest('.details-image-section'), content = imageSection.parentElement;
    const setImageVisible = visible => { image.hidden = imageSection.hidden = !visible; content.classList.toggle('has-product-image', visible); };
    image.onerror = () => setImageVisible(false);
    image.alt = getTranslated(product, 'name'); setImageVisible(Boolean(imageURL));
    if (imageURL) image.src = imageURL; else image.removeAttribute('src');
    for (const [id, row, value] of [['detailsSubCategory','subCategoryRow',product.subCategory],['detailsBrand','brandRow',product.brand],['detailsSKU','skuRow',product.sku],['detailsRating','ratingRow',product.rating ? product.rating + '/5' : ''],['detailsDescription','descriptionRow',productDescription(product)],['detailsStock','stockRow',product.price !== null && product.stock === -1 ? t('details.stockUnlimited') : product.price !== null && product.stock != null ? product.stock + ' ' + t('details.stockUnits') : '']]) {
        set(id, value); const el = document.getElementById(row); if (el) { el.hidden = !value; el.style.display = value ? 'flex' : 'none'; }
    }
    const tags = document.getElementById('detailsTags'); tags.innerHTML = (product.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join(''); document.getElementById('tagsRow').style.display = tags.childElementCount ? 'flex' : 'none';
    const specs = document.getElementById('detailsSpecs'); specs.innerHTML = Object.entries(product.specifications || {}).map(([key, value]) => `<div class="spec-item"><strong>${esc(key)}:</strong> ${esc(value)}</div>`).join(''); document.getElementById('specsRow').style.display = specs.childElementCount ? 'flex' : 'none';
    document.getElementById('productLinkBtn').style.display = 'none'; document.getElementById('downloadLinkBtn').style.display = 'none';
    let actions = document.getElementById('detailsPlatforms');
    if (!actions) { actions = document.createElement('div'); actions.id = 'detailsPlatforms'; document.getElementById('productLinkBtn').parentElement.before(actions); }
    const pending = product.downloadSite?.enabled && product.downloadSite.status === 'pending' || PLATFORMS.some(platform => product.platforms?.[platform.id] && product.linkStatus?.[platform.id] === 'pending');
    actions.innerHTML = platformBadges(product) + actionButtons(product) + (pending ? `<p class="field-hint">${esc(t('catalogue.releasePending'))}</p>` : '') + (product.status ? `<p>${esc(t('editor.status'))}: ${esc(['available','coming-soon','beta'].includes(product.status) ? t(({available:'editor.available','coming-soon':'editor.comingSoon',beta:'editor.beta'})[product.status]) : product.status)}</p>` : '') + (product.version ? `<p>${esc(t('editor.version'))}: ${esc(product.version)}</p>` : '') + productFacts(product, organization.members, organization.nodes);
    let media = document.getElementById('detailsMedia'); if (!media) { media = document.createElement('div'); media.id = 'detailsMedia'; actions.after(media); }
    media.innerHTML = (Array.isArray(product.screenshots) ? product.screenshots : []).map(url => safeURL(url)).filter(Boolean).map(url => `<img src="${esc(url)}" alt="${esc(getTranslated(product,'name'))}" loading="lazy">`).join('');
    const modal = document.getElementById('productDetailsModal'); modal.classList.remove('hidden'); modal.style.setProperty('display', 'flex', 'important');
}
function clearProductLocation() { if (location.hash) history.replaceState(null, '', location.pathname + location.search); }
function closeProductDetailsModal(clearLocation = true) { const modal = document.getElementById('productDetailsModal'); modal.classList.add('hidden'); modal.style.removeProperty('display'); if (clearLocation) clearProductLocation(); }
function openReportModal() {
    if (!canUseSensitiveFeatures(auth.currentUser)) { toast(t('report.signIn'), 'error'); return; }
    closeProductDetailsModal();
    document.getElementById('reportForm').reset(); const modal = document.getElementById('reportModal'); modal.classList.remove('hidden'); modal.style.setProperty('display', 'flex', 'important');
}
function closeReportModal() { const modal = document.getElementById('reportModal'); modal.classList.add('hidden'); modal.style.removeProperty('display'); }
async function submitReport(event) {
    event.preventDefault();
    await busy(event.submitter, async () => {
        if (!canUseSensitiveFeatures(auth.currentUser)) { toast(t('report.signIn'), 'error'); return; }
        const reason = document.getElementById('reportReason').value;
        if (!reason || !window.currentProductId) { toast(t('validation.required'), 'error'); return; }
        try {
            await addDoc(collection(db, 'reports'), { productId: window.currentProductId, productName: window.currentProduct.name || window.currentProduct.name_en || '', productCategory: window.currentProduct.category || '', reason, details: document.getElementById('reportDetails').value, reportedBy: auth.currentUser.uid, userEmail: auth.currentUser.email, timestamp: serverTimestamp(), status: 'pending' });
            toast(t('report.sent')); closeReportModal(); closeProductDetailsModal();
        } catch { toast(t('msg.error'), 'error'); }
    });
}
Object.assign(window, { showProductDetails, closeProductDetailsModal, openReportModal, closeReportModal, submitReport });
new ProductCatalogue();
