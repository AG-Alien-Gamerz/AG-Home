import { t, getCurrentLanguage } from './localization.js';
import { getTranslated } from './db-translator.js';
import { DEVELOPMENT_AREAS, normalizeProduct, escapeHTML as esc } from './product-model.js';
import { memberHref, roleText, assignmentPath } from './team-ui.js';

export function productDescription(product, language = getCurrentLanguage()) {
    return getTranslated(product, 'description', language) || t('catalogue.pendingDescription', language);
}
export function developmentBadges(product) {
    const ids = normalizeProduct(product).developmentCategories;
    if (!ids.length) return '';
    return `<div class="development-badges" aria-label="${esc(t('catalogue.developmentCategories'))}">${ids.map(id => `<span>${esc(t(DEVELOPMENT_AREAS.find(area => area.id === id).label))}</span>`).join('')}</div>`;
}
export function ownerLinks(product, members, { detail = false, nodes = [] } = {}) {
    const ids = normalizeProduct(product).ownerIds;
    const owners = members.filter(member => ids.includes(member.id));
    if (!owners.length) return '';
    return `<section class="product-ownership"><span class="product-ownership-label">${esc(t('catalogue.builtBy'))}</span><div class="built-by-actions">${owners.map(member => `<a class="product-owner" href="${esc(memberHref(member))}"><strong dir="auto">${esc(member.name)}</strong>${detail ? `<span>${esc(roleText(member))}</span><small>${esc(assignmentPath(member, nodes))}</small>` : ''}</a>`).join('')}</div></section>`;
}
export function productFacts(product, members, nodes = []) {
    const badges = developmentBadges(product);
    return (badges ? `<section class="product-development"><h3>${esc(t('catalogue.developmentCategories'))}</h3>${badges}</section>` : '') + ownerLinks(product, members, { detail: true, nodes });
}
