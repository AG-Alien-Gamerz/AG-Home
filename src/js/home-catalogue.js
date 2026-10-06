import { watchCatalogue } from './product-data.js';
import { t, getCurrentLanguage } from './localization.js';
import { getTranslated } from './db-translator.js';
import { PLATFORMS, productHref, safeURL, escapeHTML } from './product-model.js';
import { productDescription } from './product-presentation.js';

// The Home previews use the same live catalogue as Products and the control panel.
export function initHomeCatalogue() {
    const container = document.getElementById('homeProducts');
    if (!container) return;
    let products = [], catalogueState = {source:'loading',error:null};
    const render = () => {
        const language = getCurrentLanguage();
        if(catalogueState.error || catalogueState.source === 'loading') {
            const key=catalogueState.error?'catalogue.catalogueLoadError':'product.loadingProducts';
            container.innerHTML=`<p class="home-catalogue-empty" data-i18n="${key}">${t(key)}</p>`;
            return;
        }
        if (!products.length) {
            container.innerHTML = `<p class="home-catalogue-empty" data-i18n="product.noProducts">${t('product.noProducts')}</p>`;
            return;
        }
        container.innerHTML = products.slice(0, 3).map(product => {
            const name = getTranslated(product, 'name', language);
            const image = safeURL(product.image, { image: true });
            return `<a href="${escapeHTML(productHref(product))}" class="home-product-preview">
                <div class="preview-identity">${image ? `<img src="${escapeHTML(image)}" alt="" loading="lazy">` : '<span class="preview-monogram" aria-hidden="true">AG</span>'}
                <div><span class="preview-category">${escapeHTML(getTranslated(product, 'category', language))}</span><h3>${escapeHTML(name)}</h3></div><span class="destination-arrow" aria-hidden="true">↗</span></div>
                <p>${escapeHTML(productDescription(product, language))}</p>
                <div class="preview-platforms">${PLATFORMS.filter(platform => product.platforms[platform.id]).map(platform => `<span><i aria-hidden="true">${platform.icon}</i>${escapeHTML(t(platform.label))}</span>`).join('')}</div>
            </a>`;
        }).join('');
    };
    let unsubscribe;
    const connect = () => { unsubscribe = watchCatalogue((items, state) => {
        products = items; catalogueState = state;
        render();
    }); };
    connect();
    window.addEventListener('languageChanged', render);
    window.addEventListener('pagehide', () => { unsubscribe?.(); unsubscribe = null; });
    window.addEventListener('pageshow', event => { if (event.persisted && !unsubscribe) connect(); });
}
