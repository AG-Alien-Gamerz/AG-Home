export const CHARACTER_APPEARANCES = Object.freeze([
    {id:'robot',label:'character.robot',gender:null},
    {id:'pakistani-boy',label:'character.hamza',gender:'male'},
    {id:'pakistani-girl',label:'character.fatima',gender:'female'},
    {id:'anime-boy',label:'character.animeBoy',gender:'male'},
    {id:'anime-girl',label:'character.animeGirl',gender:'female'}
]);
export const CHARACTER_DEFAULTS = { appearance: 'robot', gender: 'male', sleepMinutes: 15, glassMode: 'follow', visible: true, position: null, glassPosition: null };
export const characterAppearance = appearance => CHARACTER_APPEARANCES.find(item => item.id === appearance) || CHARACTER_APPEARANCES[0];
export function normalizeSettings(value = {}) {
    if (!value || typeof value !== 'object') value = {};
    return { ...CHARACTER_DEFAULTS, appearance: characterAppearance(value.appearance).id, gender: value.gender === 'female' ? 'female' : 'male',
        sleepMinutes: Number.isFinite(Number(value.sleepMinutes)) ? Math.max(1, Math.min(120, Number(value.sleepMinutes))) : 15,
        glassMode: value.glassMode === 'fixed' ? 'fixed' : 'follow', visible: value.visible !== false,
        position: validPosition(value.position), glassPosition: validPosition(value.glassPosition) };
}
function validPosition(value) { return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? { x: Math.max(0, Math.min(1, value.x)), y: Math.max(0, Math.min(1, value.y)) } : null; }
export function inactivityState(elapsed, minutes) {
    const limit = Math.max(1, minutes) * 60000;
    if (elapsed >= limit) return 'sleep';
    if (elapsed >= limit * .94) return 'sleepy';
    if (elapsed >= limit * .86) return 'yawn';
    if (elapsed >= limit * .76) return 'sit';
    if (elapsed >= limit * .6) return 'idle';
    return 'awake';
}
export function clampPosition(x, y, width, height, viewportWidth, viewportHeight) {
    return { x: Math.max(8, Math.min(x, Math.max(8, viewportWidth - width - 8))), y: Math.max(8, Math.min(y, Math.max(8, viewportHeight - height - 8))) };
}
