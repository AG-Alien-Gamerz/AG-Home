import { t, applyTranslations } from './localization.js';

// Keep the existing fields and their event handlers; give Add and Edit the same
// layout, a scrollable body and a footer that stays within reach.
export function prepareProductForm(form, prefix) {
    const heading = form.closest('.product-modal').querySelector('.modal-header h2');
    heading.dataset.i18n = prefix === 'product' ? 'editor.addProduct' : 'editor.editProduct';
    form.querySelector('button[type="submit"]').dataset.i18n = prefix === 'product' ? 'editor.addProduct' : 'admin.save';
    const sections = [...form.querySelectorAll(':scope > fieldset:not([hidden])')];
    const [basic, category, media, details] = sections;
    const description = prefix === 'editProduct' ? sections[4] : null;
    if (description && !description.classList.contains('compatibility-editor')) {
        basic.append(description.querySelector('.form-row'));
        const tags = description.querySelector('#editProductTags')?.closest('.form-group');
        if (tags) category.append(tags);
        for (const child of [...description.children]) if (child.tagName !== 'LEGEND') details.append(child);
        description.remove();
    }
    const releaseGroup = form.querySelector(`#${prefix}Version`).closest('.form-grid');
    const release = document.createElement('fieldset');
    release.innerHTML = '<legend data-i18n="editor.release"></legend>';
    release.append(releaseGroup);
    const compatibility = form.querySelector('.compatibility-editor');
    const relationships = form.querySelector('.relationship-editor');
    const entries = [
        [basic, 'editor.basics'], [category, 'details.category'],
        [compatibility, 'editor.compatibility'], ...(relationships ? [[relationships, 'catalogue.editRelationships']] : []), [media, 'admin.image'],
        [details, 'admin.details'], [release, 'editor.release']
    ];
    const body = document.createElement('div'); body.className = 'editor-sections';
    const nav = document.createElement('nav'); nav.className = 'editor-nav';
    nav.setAttribute('aria-label', t('nav.products'));
    entries.forEach(([section, key], index) => {
        section.classList.add('form-fieldset'); section.id = `${prefix}-section-${index}`;
        const legend = section.querySelector('legend'); legend.dataset.i18n = key; legend.textContent = t(key);
        const button = document.createElement('button'); button.type = 'button';
        button.className = 'editor-step'; button.setAttribute('aria-controls', section.id);
        button.innerHTML = `<span class="editor-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span data-i18n="${key}">${t(key)}</span>`;
        button.addEventListener('click', () => body.scrollTo({
            top: section.offsetTop - 16,
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        }));
        nav.append(button); body.append(section);
    });
    const footer = form.querySelector('.modal-actions');
    form.classList.add('product-form'); form.insertBefore(nav, footer); form.insertBefore(body, footer);
    const selectStep = () => {
        let active = 0;
        if (body.getClientRects().length) entries.forEach(([section], index) => {
            if (section.getBoundingClientRect().top <= body.getBoundingClientRect().top + 65) active = index;
        });
        [...nav.children].forEach((button, index) => {
            button.classList.toggle('active', index === active);
            if (index === active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        });
    };
    body.addEventListener('scroll', selectStep, { passive: true });
    form.addEventListener('reset', () => { body.scrollTop = 0; selectStep(); });
    // Native validation brings an invalid field into view, including sections
    // reached through keyboard submission rather than the section navigation.
    form.addEventListener('invalid', event => {
        event.target.scrollIntoView({ block: 'center', behavior: 'instant' });
    }, true);
    selectStep(); applyTranslations(undefined, form);
}
