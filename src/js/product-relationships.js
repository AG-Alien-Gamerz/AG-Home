import { DEVELOPMENT_AREAS, normalizeProduct, validateProductMetadata } from './product-model.js';
import { watchOrganization } from './team-data.js';
import { t, applyTranslations } from './localization.js';
import { element } from './team-ui.js';

const editors = new WeakMap();
export function mountProductRelationships(form, prefix) {
    const section = element('fieldset', 'relationship-editor');
    const legend = element('legend', '', t('catalogue.editRelationships')); legend.dataset.i18n = 'catalogue.editRelationships';
    const hint = element('p', 'field-hint', t('catalogue.ownerHint')); hint.dataset.i18n = 'catalogue.ownerHint';
    const ownersTitle = element('h4', '', t('catalogue.owners')); ownersTitle.dataset.i18n = 'catalogue.owners';
    const owners = element('div', 'relationship-options'); owners.id = `${prefix}Owners`;
    const areasTitle = element('h4', '', t('catalogue.developmentCategories')); areasTitle.dataset.i18n = 'catalogue.developmentCategories';
    const areas = element('div', 'relationship-options'); areas.id = `${prefix}DevelopmentAreas`;
    for (const area of DEVELOPMENT_AREAS) {
        const label = element('label', 'relationship-choice'), checkbox = element('input'); checkbox.type = 'checkbox'; checkbox.value = area.id; checkbox.name = 'developmentCategories';
        const text = element('span', '', t(area.label)); text.dataset.i18n = area.label; label.append(checkbox, text); areas.append(label);
    }
    section.append(legend, hint, ownersTitle, owners, areasTitle, areas); form.querySelector('.modal-actions').before(section);
    const state = { members: [], ownerIds: [], section }; editors.set(form, state);
    watchOrganization(org => {
        const selected = owners.childElementCount ? [...owners.querySelectorAll('input:checked')].map(input => input.value) : state.ownerIds;
        state.members = org.members; owners.replaceChildren();
        for (const member of org.members) {
            const label = element('label', 'relationship-choice'), checkbox = element('input'); checkbox.type = 'checkbox'; checkbox.value = member.id; checkbox.name = 'ownerIds'; checkbox.checked = selected.includes(member.id);
            const text = element('span', '', member.name); text.dir = 'auto'; label.append(checkbox, text); owners.append(label);
        }
        if (!org.members.length) { const empty = element('p', 'field-hint', t('catalogue.noOwners')); empty.dataset.i18n = 'catalogue.noOwners'; owners.append(empty); }
    });
    applyTranslations(undefined, section);
}
export function fillProductRelationships(form, product = {}) {
    const state = editors.get(form); if (!state) return;
    const data = normalizeProduct(product); state.ownerIds = data.ownerIds;
    for (const input of state.section.querySelectorAll('input')) input.checked = data[input.name].includes(input.value);
}
export function readProductRelationships(form) {
    const state = editors.get(form);
    const product = Object.fromEntries(['ownerIds', 'developmentCategories'].map(name => [name, [...state.section.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value)]));
    validateProductMetadata(product, state.members.map(member => member.id));
    return product;
}
