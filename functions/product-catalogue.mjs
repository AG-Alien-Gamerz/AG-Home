import seed from './product-seed.json' with {type:'json'};
import {PLATFORMS,normalizeProduct,productSlug,safeURL} from './product-model.mjs';
export const initialProducts = Object.freeze(seed.groups.flatMap(group => group.products.map(input => {
    const platformIds = input.platformIds || group.platformIds, id = productSlug(input.name);
    return normalizeProduct({id,slug:id,catalogueKey:id,name:input.name,name_en:input.name,description:'',category:platformIds.includes('windows')?'Software':'Website',translationKeys:{category:platformIds.includes('windows')?'development.software':'platform.website'},
        schemaVersion:3,platforms:Object.fromEntries(PLATFORMS.map(p=>[p.id,platformIds.includes(p.id)])),links:Object.fromEntries(PLATFORMS.map(p=>[p.id,''])),
        linkStatus:Object.fromEntries(PLATFORMS.map(p=>[p.id,platformIds.includes(p.id)?'pending':'disabled'])),downloadSite:group.downloadSite||{enabled:false,url:''},productLink:'',downloadLink:'',
        ownerIds:[...seed.ownerIds],developmentCategories:[...(input.developmentCategories||group.developmentCategories)],...(group.version?{version:group.version}:{}),price:null,stock:-1,rating:0,image:null,status:''});
})));
const nameKey = product => String(product.name_en || product.name || '').normalize('NFKC').trim().toLocaleLowerCase();
export function knownProduct(product) { return initialProducts.find(known => product.catalogueKey === known.catalogueKey || product.id === known.id || nameKey(product) === nameKey(known)); }
// Persisted catalogueKey marks an acknowledged catalogue record. Subsequently,
// administrators' explicit platform/owner/category changes remain authoritative.
export function withKnownDefaults(product, known = knownProduct(product)) {
    if (!known) return normalizeProduct(product);
    const existing = normalizeProduct(product), platforms = {...existing.platforms};
    const explicitPlatforms=product.platforms&&PLATFORMS.some(({id})=>typeof product.platforms[id]==='boolean');
    if (!product.catalogueKey && (known.platforms.windows || !explicitPlatforms)) for (const {id} of PLATFORMS) if (known.platforms[id]) platforms[id] = true;
    const links = {...existing.links}, linkStatus = {};
    const downloadSite=product.downloadSite || product.downloadLink || product.catalogueKey ? existing.downloadSite : known.downloadSite;
    let websiteUrl=existing.websiteUrl||'';
    // A legacy desktop product's purchase/info URL is a marketing site, not
    // evidence that its software itself runs as a Website application.
    if(known.platforms.windows&&!explicitPlatforms){websiteUrl=websiteUrl||safeURL(links.website);platforms.website=false;links.website='';}
    const translationKeys={...known.translationKeys,...product.translationKeys};
    if((product.category||product.category_en||product.category_ur)&&!product.translationKeys?.category)delete translationKeys.category;
    for (const {id} of PLATFORMS) {
        if (!platforms[id]) links[id] = '';
        linkStatus[id] = !platforms[id] ? 'disabled' : safeURL(links[id]) ? 'ready' : 'pending';
        if (linkStatus[id] === 'pending') links[id] = '';
    }
    return normalizeProduct({...known,...product,id:product.id||known.id,slug:product.slug||known.slug,catalogueKey:known.catalogueKey,schemaVersion:3,platforms,links,linkStatus,translationKeys,websiteUrl,downloadSite,
        productLink:links.website||websiteUrl,downloadLink:downloadSite.url,
        ownerIds:Array.isArray(product.ownerIds)||product.ownerId?existing.ownerIds:known.ownerIds,
        developmentCategories:Array.isArray(product.developmentCategories)?existing.developmentCategories:known.developmentCategories,
        ...(typeof product.version === 'string' && product.version.trim()?{version:product.version}:known.version?{version:known.version}:{})});
}
// One complete stream feeds cards, filters, profiles, previews and the mind map.
// A real Firestore record always keeps its document ID and configured content.
export function mergeCatalogue(products = [], {initialized = false} = {}) {
    if (initialized) return products.map(normalizeProduct);
    const seen = new Set();
    const merged = products.map(product => {const known = knownProduct(product);if(known)seen.add(known.id);return withKnownDefaults(product,known);});
    for (const product of initialProducts) if (!seen.has(product.id)) merged.push(structuredClone(product));
    return merged;
}
