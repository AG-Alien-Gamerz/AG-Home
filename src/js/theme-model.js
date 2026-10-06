export const THEMES = Object.freeze([
    {id:'light', label:'settings.themeLight', scheme:'light'},
    {id:'dark', label:'settings.themeDark', scheme:'dark'},
    {id:'light-legacy', label:'settings.themeLightLegacy', scheme:'light'},
    {id:'dark-legacy', label:'settings.themeDarkLegacy', scheme:'dark'}
]);
export function normalizeTheme(value) { return THEMES.some(theme=>theme.id===value) ? value : value === 'blue' ? 'dark' : 'light'; }
export function themeScheme(value) { return THEMES.find(theme=>theme.id===normalizeTheme(value)).scheme; }
