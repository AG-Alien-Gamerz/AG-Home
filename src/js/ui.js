import { t } from './localization.js';
export function toast(message, type = 'success') {
    let region = document.getElementById('toastRegion');
    if (!region) { region = document.createElement('div'); region.id = 'toastRegion'; region.setAttribute('aria-live', 'polite'); document.body.append(region); }
    const item = document.createElement('div'); item.className = `toast ${type}`; item.textContent = message;
    region.append(item); setTimeout(() => item.remove(), 6500);
    window.dispatchEvent(new CustomEvent('characterReaction', { detail: { state: type === 'error' ? 'confused' : 'happy' } }));
}
export async function busy(button, task) {
    if (button?.disabled) return;
    if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
    window.dispatchEvent(new CustomEvent('characterReaction', { detail: { state: 'waiting' } }));
    try { return await task(); } finally { if (button) { button.disabled = false; button.removeAttribute('aria-busy'); } }
}
export function initModals() {
    let previousFocus;
    const registered=new WeakSet();
    const observer = new MutationObserver(records => {
        for (const record of records) {
            if(record.type==='childList') {for(const node of record.addedNodes)if(node.nodeType===1 && node.matches('.modal, .category-modal'))observeModal(node);continue;}
            const modal = record.target;
            if (!modal.matches('.modal, .category-modal')) continue;
            const visible = !modal.classList.contains('hidden') && getComputedStyle(modal).display !== 'none';
            if (visible && modal.dataset.open !== 'true') {
                previousFocus = document.getElementById(modal.dataset.returnFocus) || document.activeElement; modal.dataset.open = 'true';
                modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
                const title = modal.querySelector('h2, h3');
                if (title) { title.id ||= `${modal.id}-title`; modal.setAttribute('aria-labelledby', title.id); }
                modal.querySelector('button, input, select, textarea, [tabindex]')?.focus();
            } else if (!visible && modal.dataset.open === 'true') { modal.dataset.open = 'false'; previousFocus?.focus(); }
        }
        document.body.classList.toggle('modal-open', [...document.querySelectorAll('.modal, .category-modal')].some(modal => modal.dataset.open === 'true'));
    });
    function observeModal(modal) {
        if(registered.has(modal))return;registered.add(modal);
        observer.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
        let startedOnBackdrop = false;
        modal.addEventListener('pointerdown', event => { startedOnBackdrop = event.target === modal; });
        modal.addEventListener('click', event => {
            // A field can move as its dependent input appears. A gesture that
            // started inside the dialog must never become a backdrop dismissal.
            if (startedOnBackdrop && event.target === modal) close(modal);
            startedOnBackdrop = false;
        });
    }
    document.querySelectorAll('.modal, .category-modal').forEach(observeModal);
    observer.observe(document.body,{childList:true});
    function close(modal) {
        modal.classList.add('hidden'); modal.style.removeProperty('display');
        modal.dispatchEvent(new Event('modalclose'));
    }
    document.addEventListener('keydown', event => {
        const modal = [...document.querySelectorAll('.modal, .category-modal')].reverse().find(el => el.dataset.open === 'true');
        if (!modal) return;
        if (event.key === 'Escape') close(modal);
        if (event.key === 'Tab') {
            const items = [...modal.querySelectorAll('button, input, select, textarea, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
            if (!items.length) return;
            if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
            else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
        }
    });
    document.querySelectorAll('button.close-modal-btn, .category-modal-close').forEach(btn => btn.setAttribute('aria-label', t('btn.close')));
}

export function initValidation(root = document) {
    for (const input of root.querySelectorAll('input, textarea, select')) {
        if (input.dataset.validationReady) continue;
        input.dataset.validationReady = 'true';
        input.addEventListener('input', () => { if (!input.id.toLowerCase().includes('confirm')) input.setCustomValidity(''); });
        input.addEventListener('invalid', () => {
            if (input.validity.valueMissing) input.setCustomValidity(t('validation.required'));
            else if (input.validity.typeMismatch) input.setCustomValidity(t(input.type === 'email' ? 'validation.email' : 'validation.url'));
            else if (input.validity.tooShort) input.setCustomValidity(t('validation.passwordLength'));
            else if (input.validity.rangeOverflow || input.validity.rangeUnderflow || input.validity.badInput) input.setCustomValidity(t(input.type === 'date' ? 'validation.dob' : 'validation.required') + (input.type === 'number' ? ` (${input.min}–${input.max})` : ''));
            input.setAttribute('aria-invalid', 'true');
        });
        input.addEventListener('input', () => { if (input.validity.valid) input.removeAttribute('aria-invalid'); });
    }
}
