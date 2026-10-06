import { setCurrentLanguage } from './localization.js';
import { normalizeTheme, themeScheme } from './theme-model.js';
// Theme utilities shared across pages (page-specific scripts can import these)
// Exports: setTheme(theme), initTheme(), updateActiveTheme(theme)

export function setTheme(theme) {
    theme = normalizeTheme(theme);
    try {
        document.documentElement.dataset.theme = theme;
        document.documentElement.style.colorScheme = themeScheme(theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const themeButtons = document.querySelectorAll('.theme-btn');
        if (themeButtons && themeButtons.length) {
            themeButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === theme);
                btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme));
            });
        }

        const header = document.querySelector('header');
        if (header) {
            header.style.transition = 'background-color .2s ease, color .2s ease, border-color .2s ease';
        }

        const dynamicText = document.getElementById('dynamicText');
        if (dynamicText) {
            dynamicText.style.transition = 'color 0.3s ease';
        }
    } catch (e) {
        console.warn('[theme] setTheme error', e);
    }
}

export function updateActiveTheme(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (!themeButtons) return;
    themeButtons.forEach(btn => { btn.classList.toggle('active', btn.dataset.theme === theme); btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme)); });
}

export function setViewMode(mode) {
    try {
        document.body.setAttribute('data-view-mode', mode);
        localStorage.setItem('viewMode', mode);

        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        if (viewModeButtons && viewModeButtons.length) {
            viewModeButtons.forEach(btn =>
                btn.classList.toggle('active', btn.dataset.view === mode)
            );
        }

        // Apply view mode to grid if it exists
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.classList.remove('grid-view', 'list-view');
            productsGrid.classList.add(mode === 'list' ? 'list-view' : 'grid-view');
        }
    } catch (e) {
        console.warn('[theme] setViewMode error', e);
    }
}

export function updateActiveViewMode(mode) {
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    if (!viewModeButtons) return;
    viewModeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === mode));
}

let themeInitialized = false;
export function initTheme() {
    if (themeInitialized) return; themeInitialized = true;
    // Attach click handlers to theme buttons when present and apply initial theme
    const themeButtons = document.querySelectorAll('.theme-btn');
    if (themeButtons && themeButtons.length) {
        themeButtons.forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));
    }
    // Apply stored theme or default
    setTheme(localStorage.getItem('theme') || document.documentElement.dataset.theme || 'light');
    window.addEventListener('storage', event => { if (event.key === 'theme') setTheme(event.newValue); });

    // Attach click handlers to view mode buttons
    const viewModeButtons = document.querySelectorAll('.view-mode-btn');
    if (viewModeButtons && viewModeButtons.length) {
        viewModeButtons.forEach(btn => btn.addEventListener('click', () => setViewMode(btn.dataset.view)));
    }
    // Apply stored view mode or default to grid
    setViewMode(localStorage.getItem('viewMode') || 'grid');

    // Attach click handlers to language buttons
    const languageButtons = document.querySelectorAll('.language-btn');
    if (languageButtons && languageButtons.length) {
        languageButtons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.language)));
    }
    // Apply stored language or default to Urdu
    setLanguage(localStorage.getItem('language') || 'ur');
}

export function setLanguage(lang) { setCurrentLanguage(lang); updateActiveLanguage(lang); }

export function updateActiveLanguage(lang) {
    const languageButtons = document.querySelectorAll('.language-btn');
    if (!languageButtons) return;
    languageButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.language === lang));
}
