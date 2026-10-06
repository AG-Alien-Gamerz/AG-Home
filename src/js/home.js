import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { initTheme } from './theme.js';
import { initLocalization, t, applyTranslations } from './localization.js';
import { initSettings } from './settings.js';
import { initCharacter } from './character.js';
import { initModals, initValidation } from './ui.js';
import { pageURL, rejectUnverifiedSession, saveProfile } from './auth-service.js';
import { requiresEmailVerification } from './auth-validation.js';
import { roleManager } from './role-manager.js';
import { initHomeCatalogue } from './home-catalogue.js';

function init() {
    initTheme(); initLocalization(); initSettings(); initModals(); initCharacter();
    initValidation();
    initHomeCatalogue();
    if(document.getElementById('aboutTeamMembers'))import('./about-team.js').then(module=>module.initAboutTeam());
    document.querySelector('.loader-container')?.remove();
    document.querySelector('.background-content')?.classList.remove('hidden');
    const nav = document.querySelector('nav ul');
    if (nav && !document.querySelector('.brand')) {
        const brand = document.createElement('a'); brand.className = 'brand'; brand.href = pageURL('home.html');
        brand.innerHTML = '<img src="/AG-Home/logo.png" alt="">AG Home'; document.querySelector('header')?.prepend(brand);
    }
    let footer = document.querySelector('footer');
    if (!footer) { footer = document.createElement('footer'); document.body.append(footer); }
    if (!footer.textContent.trim()) footer.innerHTML = `<a class="brand" href="${pageURL('home.html')}">AG Home</a><p data-i18n="home.description">${t('home.description')}</p><div><a href="${pageURL('privacy.html')}" data-i18n="nav.privacy">${t('nav.privacy')}</a> · <a href="${pageURL('contact.html')}" data-i18n="nav.contact">${t('nav.contact')}</a></div><small>© ${new Date().getFullYear()} AG Home</small>`;
    const controls = document.querySelector('header .header-controls');
    let accountEntry = controls?.querySelector('.account-entry');
    if (controls && !accountEntry) {
        accountEntry = document.createElement('a'); accountEntry.className = 'account-entry secondary-btn';
        accountEntry.href = pageURL('index.html'); accountEntry.dataset.i18n = 'login.submit';
        accountEntry.textContent = t('login.submit'); controls.append(accountEntry);
    }
    onAuthStateChanged(auth, async user => {
        const protectedPage = location.pathname.endsWith('/home.html');
        if (requiresEmailVerification(user)) {
            try { await rejectUnverifiedSession(user); } finally { if (protectedPage) location.replace(pageURL('index.html')); }
            return;
        }
        if (!user && protectedPage) { location.replace(pageURL('index.html')); return; }
        if (protectedPage && !user.email) { location.replace(pageURL('products.html')); return; }
        document.documentElement.classList.remove('auth-pending');
        if (accountEntry) {
            const signedIn = !!user?.emailVerified && !!user.email;
            accountEntry.href = pageURL(signedIn ? 'home.html' : 'index.html');
            accountEntry.dataset.i18n = signedIn ? 'nav.home' : 'login.submit';
            accountEntry.textContent = t(accountEntry.dataset.i18n);
        }
        const display = document.getElementById('userDisplay');
        if (display) { display.textContent = user?.displayName || user?.email || (user ? t('auth.guest') : ''); display.classList.toggle('hidden', localStorage.getItem('showEmail') === 'false'); }
        document.getElementById('logoutBtn')?.classList.toggle('hidden', !user);
        document.getElementById('verificationBanner')?.remove();
        document.getElementById('staffNav')?.remove();
        if (!user?.emailVerified) return;
        try {
            await saveProfile(user);
            const rank = await roleManager.getUserRole(user.uid);
            if (['OWNER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(rank)) {
                const item = document.createElement('li'); item.id = 'staffNav'; item.innerHTML = `<a href="${pageURL('control.html')}" data-i18n="nav.controlPanel">${t('nav.controlPanel')}</a>`; nav?.append(item);
            }
        } catch { /* Failed authorization lookup never enables staff controls. */ }
    });
    applyTranslations();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
