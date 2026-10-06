// Run before styles to keep a saved dark theme from flashing light on navigation.
(() => {
    let theme = 'light';
    try { const saved = localStorage.getItem('theme'); if (['light', 'dark', 'light-legacy', 'dark-legacy'].includes(saved)) theme = saved; else if (saved === 'blue') theme = 'dark'; } catch {}
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme.startsWith('light') ? 'light' : 'dark';
})();
