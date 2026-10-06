import { normalizeProduct } from './product-model.js';

// Compatibility is a set of enabled platforms, never a single category.
export function matchesCatalogue(product, { category = 'ALL', platform = 'ALL', search = '' } = {}, text = '') {
    return (category === 'ALL' || (product.category || product.category_en || product.category_ur) === category)
        && (platform === 'ALL' || normalizeProduct(product).platforms[platform] === true)
        && text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
}
