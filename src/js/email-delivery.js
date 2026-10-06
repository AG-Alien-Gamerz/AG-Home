import { t } from './localization.js';

// A mailbox hint, not a delivery receipt. Reset requests stay account-neutral.
export function showEmailDeliveryTip(kind) {
    const target = document.querySelector(kind === 'verification' ? '#verificationNotice' : kind === 'reset' ? '#resetPanel' : '#accountSecurity');
    if (!target) return;
    target.querySelector('.email-delivery-tip')?.remove();
    const box = document.createElement('aside');
    box.className = 'email-delivery-tip'; box.setAttribute('role', 'status');
    const content = document.createElement('div');
    for (const [tag, key] of [['strong', 'email.tipTitle'], ['p', 'email.tipBody']]) {
        const element = document.createElement(tag); element.dataset.i18n = key; element.textContent = t(key); content.append(element);
    }
    const close = document.createElement('button'); close.type = 'button'; close.className = 'email-tip-close';
    close.textContent = '×'; close.dataset.i18nAria = 'btn.close'; close.setAttribute('aria-label', t('btn.close'));
    close.onclick = () => { const next = target.querySelector('button:not(.email-tip-close), input'); box.remove(); next?.focus(); };
    box.append(content, close); target.append(box);
}
