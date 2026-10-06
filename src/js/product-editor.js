import { PLATFORMS, normalizeProduct, validateCompatibility, safeURL } from './product-model.js';
import { t, applyTranslations } from './localization.js';

export function mountPlatformEditor(form, prefix) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'compatibility-editor';
    fieldset.dataset.platformEditor = prefix;
    fieldset.innerHTML = `<legend data-i18n="editor.compatibility">${t('editor.compatibility')}</legend>
        <p class="field-hint" data-i18n="editor.platformHint">${t('editor.platformHint')}</p>
        <div class="platform-options">${PLATFORMS.map(p => `<div class="platform-option">
            <label class="platform-check"><input type="checkbox" id="${prefix}-${p.id}" data-platform="${p.id}"><span aria-hidden="true">${p.icon}</span><span data-i18n="${p.label}">${t(p.label)}</span></label>
            <div class="dependent-field" hidden><label for="${prefix}-${p.id}-url" data-i18n="${p.field}">${t(p.field)}</label>
                <input type="url" id="${prefix}-${p.id}-url" data-platform-url="${p.id}" placeholder="https://" dir="ltr" disabled aria-describedby="${prefix}-${p.id}-error">
                <span id="${prefix}-${p.id}-error" class="field-error" aria-live="polite"></span>
                <label class="platform-check pending-link-check"><input type="checkbox" data-platform-pending="${p.id}"><span data-i18n="catalogue.pendingLink">${t('catalogue.pendingLink')}</span></label></div></div>`).join('')}</div>
        <div class="form-group information-website-field"><label for="${prefix}-informationWebsite" data-i18n="catalogue.informationWebsite">${t('catalogue.informationWebsite')}</label><input type="url" id="${prefix}-informationWebsite" data-information-website placeholder="https://" dir="ltr" aria-describedby="${prefix}-informationWebsite-error"><span id="${prefix}-informationWebsite-error" class="field-error" aria-live="polite"></span><small class="field-hint" data-i18n="catalogue.informationWebsiteHint">${t('catalogue.informationWebsiteHint')}</small></div>
        <div class="download-site-option"><label class="platform-check"><input type="checkbox" id="${prefix}-downloadSite" data-download-site><span data-i18n="editor.downloadSite">${t('editor.downloadSite')}</span></label>
        <div class="dependent-field" hidden><label for="${prefix}-downloadSite-url" data-i18n="editor.downloadURL">${t('editor.downloadURL')}</label>
        <input type="url" id="${prefix}-downloadSite-url" data-download-site-url placeholder="https://" dir="ltr" disabled aria-describedby="${prefix}-downloadSite-error"><span id="${prefix}-downloadSite-error" class="field-error" aria-live="polite"></span>
        <label class="platform-check pending-link-check"><input type="checkbox" data-download-site-pending><span data-i18n="catalogue.pendingLink">${t('catalogue.pendingLink')}</span></label></div></div>`;
    const actions = form.querySelector('.form-actions, .modal-actions') || form.querySelector('button[type="submit"]');
    actions.before(fieldset);
    const toggle = checkbox => {
        const wrapper = checkbox.closest('.platform-option, .download-site-option').querySelector('.dependent-field');
        const input = wrapper.querySelector('input');
        wrapper.hidden = !checkbox.checked;
        input.disabled = !checkbox.checked;
        input.required = checkbox.checked;
        if (!checkbox.checked) { input.value = ''; input.setCustomValidity(''); wrapper.querySelector('.field-error').textContent = ''; const pending=wrapper.querySelector('[data-platform-pending],[data-download-site-pending]');if(pending)pending.checked=false; }
    };
    fieldset.addEventListener('change', event => {
        if(event.target.hasAttribute('data-platform-pending')||event.target.hasAttribute('data-download-site-pending')){
            const input=event.target.hasAttribute('data-download-site-pending')?fieldset.querySelector('[data-download-site-url]'):fieldset.querySelector(`[data-platform-url="${event.target.dataset.platformPending}"]`);
            const enabled=event.target.hasAttribute('data-download-site-pending')?fieldset.querySelector('[data-download-site]').checked:fieldset.querySelector(`[data-platform="${event.target.dataset.platformPending}"]`).checked;
            input.disabled=!enabled||event.target.checked;input.required=enabled&&!event.target.checked;
            if(event.target.checked)input.value='';input.setCustomValidity('');input.removeAttribute('aria-invalid');input.nextElementSibling.textContent='';
        }else if(event.target.type==='checkbox')toggle(event.target);
    });
    fieldset.addEventListener('input', event => { if (event.target.type === 'url') { event.target.setCustomValidity(''); event.target.removeAttribute('aria-invalid'); } });
    applyTranslations();
    return fieldset;
}

export function fillPlatformEditor(form, product) {
    const data = normalizeProduct(product);
    form.dataset.productSchema=String(data.schemaVersion);
    form.querySelector('[data-information-website]').value=data.websiteUrl||'';
    for (const { id } of PLATFORMS) {
        const checkbox = form.querySelector(`[data-platform="${id}"]`);
        checkbox.checked = data.platforms[id];
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        form.querySelector(`[data-platform-url="${id}"]`).value = data.links[id];
        const pending=form.querySelector(`[data-platform-pending="${id}"]`);
        pending.checked=data.schemaVersion===3&&data.linkStatus[id]==='pending';
        if(data.platforms[id])pending.dispatchEvent(new Event('change',{bubbles:true}));
    }
    const checkbox = form.querySelector('[data-download-site]');
    checkbox.checked = data.downloadSite.enabled;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    form.querySelector('[data-download-site-url]').value = data.downloadSite.url;
    const pending=form.querySelector('[data-download-site-pending]');
    pending.checked=data.downloadSite.status==='pending';
    if(data.downloadSite.enabled)pending.dispatchEvent(new Event('change',{bubbles:true}));
}

export function readPlatformEditor(form) {
    const websiteValue=form.querySelector('[data-information-website]').value.trim();
    const version=form.dataset.productSchema==='3'||websiteValue||Boolean(form.querySelector('[data-platform-pending]:checked,[data-download-site-pending]:checked'))?3:2;
    const data = { schemaVersion: version, platforms: {}, links: {}, downloadSite: {},...(version===3?{linkStatus:{}}:{}) };
    if(version===3)data.websiteUrl=safeURL(websiteValue)||websiteValue;
    for (const { id } of PLATFORMS) {
        data.platforms[id] = form.querySelector(`[data-platform="${id}"]`).checked;
        const value = form.querySelector(`[data-platform-url="${id}"]`).value.trim();
        const pending=data.platforms[id]&&form.querySelector(`[data-platform-pending="${id}"]`).checked;
        data.links[id] = data.platforms[id]&&!pending ? safeURL(value) || value : '';
        if(version===3)data.linkStatus[id]=!data.platforms[id]?'disabled':pending?'pending':'ready';
    }
    data.downloadSite.enabled = form.querySelector('[data-download-site]').checked;
    const downloadURL = form.querySelector('[data-download-site-url]').value.trim();
    const downloadPending=data.downloadSite.enabled&&form.querySelector('[data-download-site-pending]').checked;
    data.downloadSite.url = data.downloadSite.enabled&&!downloadPending ? safeURL(downloadURL) || downloadURL : '';
    if(version===3)data.downloadSite.status=!data.downloadSite.enabled?'disabled':downloadPending?'pending':'ready';
    const errors = validateCompatibility(data);
    for (const [id, key] of Object.entries(errors)) {
        const input = form.querySelector(id === 'websiteUrl' ? '[data-information-website]' : id === 'downloadSite' ? '[data-download-site-url]' : `[data-platform-url="${id}"]`);
        input.setCustomValidity(t(key));
        input.setAttribute('aria-invalid', 'true');
        input.nextElementSibling.textContent = t(key);
    }
    if (Object.keys(errors).length) { form.reportValidity(); return null; }
    // Keep old clients functional while new clients use the explicit model.
    return { ...data, productLink: data.links.website||data.websiteUrl||'', downloadLink: data.downloadSite.url };
}
