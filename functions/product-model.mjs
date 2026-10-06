// Shared public product contract. Team profiles live in organization/main; products
// keep references only. Version 2 remains strict; version 3 explicitly marks links
// that have not been configured instead of inventing download destinations.
export const PLATFORMS = Object.freeze([
    { id: 'website', label: 'platform.website', field: 'link.website', icon: '◎' },
    { id: 'windows', label: 'platform.windows', field: 'link.windows', icon: '⊞' },
    { id: 'linux', label: 'platform.linux', field: 'link.linux', icon: '◈' },
    { id: 'chromeOS', label: 'platform.chromeOS', field: 'link.chromeOS', icon: '◉' },
    { id: 'android', label: 'platform.android', field: 'link.android', icon: '♧' },
    { id: 'apple', label: 'platform.apple', field: 'link.apple', icon: '◇' }
]);
export const DEVELOPMENT_AREAS = Object.freeze(['frontend','backend','software','android','uiux','security','testingDeployment','researchInnovation'].map(id => ({id,label:'development.'+id})));
const memberId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value);
export function safeURL(value, { image = false } = {}) {
    if (typeof value !== 'string' || !value.trim()) return '';
    if (image && /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
    if (value.trim().length > 2048) return '';
    try { const url = new URL(value.trim()); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.') ? url.href : ''; } catch { return ''; }
}
export function productSlug(value = '') { return String(value).normalize('NFKC').trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
export function normalizeProduct(product = {}) {
    const platforms = {}, links = {}, linkStatus = {};
    const modern = product.platforms && typeof product.platforms === 'object' && !Array.isArray(product.platforms);
    for (const { id } of PLATFORMS) {
        platforms[id] = modern ? product.platforms[id] === true : id === 'website' && Boolean(safeURL(product.productLink));
        links[id] = platforms[id] ? String(product.links?.[id] || (id === 'website' && !modern ? product.productLink || '' : '')).trim() : '';
        linkStatus[id] = !platforms[id] ? 'disabled' : product.schemaVersion === 3 && product.linkStatus?.[id] === 'pending' && !links[id] ? 'pending' : 'ready';
    }
    const downloadSite = product.downloadSite && typeof product.downloadSite === 'object'
        ? { enabled: product.downloadSite.enabled === true, url: product.downloadSite.enabled === true ? String(product.downloadSite.url || '').trim() : '' }
        : { enabled: Boolean(safeURL(product.downloadLink)), url: safeURL(product.downloadLink) };
    if (product.schemaVersion === 3) downloadSite.status = !downloadSite.enabled ? 'disabled' : product.downloadSite?.status === 'pending' && !downloadSite.url ? 'pending' : 'ready';
    const ownerIds = [...new Set((Array.isArray(product.ownerIds) ? product.ownerIds : product.ownerId ? [product.ownerId] : []).filter(memberId))].slice(0,10);
    const developmentCategories = [...new Set((Array.isArray(product.developmentCategories) ? product.developmentCategories : []).filter(id => DEVELOPMENT_AREAS.some(area => area.id === id)))];
    const websiteUrl=typeof product.websiteUrl==='string'?product.websiteUrl.trim():'';
    return { ...product, schemaVersion: product.schemaVersion === 3 ? 3 : 2, platforms, links, downloadSite, ownerIds, developmentCategories, ...(product.schemaVersion === 3 || product.websiteUrl!==undefined ? {websiteUrl} : {}), ...(product.schemaVersion === 3 ? {linkStatus} : {}) };
}
export function validateCompatibility(product) {
    const errors = {}, pending = product.schemaVersion === 3;
    for (const { id } of PLATFORMS) {
        const status = product.linkStatus?.[id];
        if (product.platforms?.[id] && !(pending && status === 'pending' && product.links?.[id] === '') && !safeURL(product.links?.[id])) errors[id] = 'validation.url';
        if (!product.platforms?.[id] && product.links?.[id]) errors[id] = 'validation.inactiveLink';
        if (pending && (!['ready','pending','disabled'].includes(status) || (product.platforms?.[id] ? status === 'disabled' || status === 'pending' && product.links?.[id] !== '' : status !== 'disabled'))) errors[id] = 'validation.inactiveLink';
    }
    const downloadStatus = product.downloadSite?.status;
    if (product.downloadSite?.enabled && !(pending && downloadStatus === 'pending' && product.downloadSite.url === '') && !safeURL(product.downloadSite.url)) errors.downloadSite = 'validation.url';
    if (!product.downloadSite?.enabled && product.downloadSite?.url) errors.downloadSite = 'validation.inactiveLink';
    if (downloadStatus !== undefined && (!pending || !['ready','pending','disabled'].includes(downloadStatus) || (product.downloadSite.enabled ? downloadStatus === 'disabled' || downloadStatus === 'pending' && product.downloadSite.url !== '' : downloadStatus !== 'disabled'))) errors.downloadSite = 'validation.inactiveLink';
    if (product.websiteUrl && (product.schemaVersion!==3 || !safeURL(product.websiteUrl))) errors.websiteUrl = 'validation.url';
    return errors;
}
export function validateProductMetadata(product, memberIds) {
    if (product.ownerIds !== undefined && (!Array.isArray(product.ownerIds) || product.ownerIds.length > 10 || new Set(product.ownerIds).size !== product.ownerIds.length || product.ownerIds.some(id => !memberId(id) || memberIds && !memberIds.includes(id)))) throw new Error('catalogue.ownerError');
    if (product.developmentCategories !== undefined && (!Array.isArray(product.developmentCategories) || product.developmentCategories.length > DEVELOPMENT_AREAS.length || new Set(product.developmentCategories).size !== product.developmentCategories.length || product.developmentCategories.some(id => !DEVELOPMENT_AREAS.some(area => area.id === id)))) throw new Error('catalogue.areaError');
    return product;
}
export function validateProductRecord(product,memberIds) {
    validateProductMetadata(product,memberIds);
    if(typeof product.name!=='string'||!product.name.trim()||product.name.length>200||typeof product.category!=='string'||!product.category.trim()||!(product.price===null&&product.schemaVersion===3||typeof product.price==='number'&&Number.isFinite(product.price)&&product.price>=0)||!Number.isInteger(product.stock)||product.stock<-1||typeof product.rating!=='number'||!Number.isFinite(product.rating)||product.rating<0||product.rating>5)throw new Error('validation.required');
    if(product.image!==null&&(typeof product.image!=='string'||product.image.length>=750000||!safeURL(product.image,{image:true})))throw new Error('validation.url');
    if(![2,3].includes(product.schemaVersion)||PLATFORMS.some(({id})=>typeof product.platforms?.[id]!=='boolean'||typeof product.links?.[id]!=='string')||Object.keys(validateCompatibility(product)).length)throw new Error('validation.url');
    return product;
}
export function productActions(product) {
    const normalized = normalizeProduct(product);
    const actions = PLATFORMS.filter(({ id }) => normalized.platforms[id] && safeURL(normalized.links[id]))
        .map(p => ({ ...p, url: safeURL(normalized.links[p.id]), action: p.id === 'website' ? 'details.visit' : p.field }));
    if(safeURL(normalized.websiteUrl)&&!actions.some(action=>action.id==='website'))actions.unshift({id:'websiteUrl',icon:'◎',action:'details.visit',url:safeURL(normalized.websiteUrl)});
    if (normalized.downloadSite.enabled && safeURL(normalized.downloadSite.url)) actions.push({ id: 'downloadSite', icon: '↗', action: 'link.downloadSite', url: safeURL(normalized.downloadSite.url) });
    return actions;
}
export function productHref(product) { return 'products.html#product=' + encodeURIComponent(typeof product === 'string' ? product : product.id || product.slug || productSlug(product.name)); }
export function productsByOwner(products, id) { return products.filter(product => normalizeProduct(product).ownerIds.includes(id)); }
export function groupedProducts(products) { return PLATFORMS.map(platform => ({...platform,products:products.filter(product => normalizeProduct(product).platforms[platform.id])})).filter(group => group.products.length); }
export function findProduct(products, key) { return products.find(product => [product.id, product.slug, product.catalogueKey, productSlug(product.name)].includes(key)); }
export function escapeHTML(value = '') { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
