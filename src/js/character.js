import { CHARACTER_DEFAULTS, characterAppearance, normalizeSettings, inactivityState, clampPosition } from './character-state.js';
import { characterMarkup } from './character-visuals.js';
import { t } from './localization.js';
import { passwordCriteria } from './auth-validation.js';

let settings = { ...CHARACTER_DEFAULTS }, robot, glass, lastActivity = Date.now(), readingSince = Date.now(), reactionUntil = 0, reaction = 'awake';
let privateInput = null, drag = null;
try { settings = normalizeSettings(JSON.parse(localStorage.getItem('ag.character') || '{}')); } catch {}
export const characterSettings = () => ({ ...settings });
export function updateCharacterSettings(values) {
    settings = normalizeSettings({ ...settings, ...values });
    localStorage.setItem('ag.character', JSON.stringify(settings));
    applySettings(); window.dispatchEvent(new CustomEvent('characterSettingsChanged', { detail: settings }));
}
function applySettings() {
    if (!robot) return;
    const appearance = characterAppearance(settings.appearance);
    if (robot.dataset.appearance !== appearance.id) robot.innerHTML = characterMarkup(appearance.id);
    robot.dataset.appearance = appearance.id;
    robot.dataset.gender = appearance.gender || settings.gender; robot.hidden = !settings.visible;
    updateCharacterLabel();
    glass.hidden = !settings.visible; glass.dataset.mode = settings.glassMode;
    position(robot, settings.position); position(glass, settings.glassPosition, true); tick();
}
function updateCharacterLabel() {
    if (!robot) return;
    const label = t(characterAppearance(settings.appearance).label);
    robot.setAttribute('aria-label', label + ' · ' + t('character.drag'));
    robot.title = label;
}
function position(element, saved, isGlass = false) {
    if (!element) return;
    const width = element.offsetWidth || (isGlass ? 52 : 92), height = element.offsetHeight || (isGlass ? 65 : 134);
    const point = clampPosition(saved ? saved.x * (innerWidth - width) : innerWidth - width - (isGlass ? 132 : 20),
        saved ? saved.y * (innerHeight - height) : innerHeight - height - (innerWidth < 600 ? 88 : 24), width, height, innerWidth, innerHeight);
    element.style.left = point.x + 'px'; element.style.top = point.y + 'px';
}
function attachDrag(element, key) {
    element.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target.closest('button') !== element) return;
        event.preventDefault(); element.setPointerCapture(event.pointerId);
        const bounds = element.getBoundingClientRect(); drag = { element, key, dx: event.clientX - bounds.left, dy: event.clientY - bounds.top };
        element.classList.add('picked-up'); meaningful();
    });
    element.addEventListener('pointermove', event => {
        if (drag?.element !== element) return;
        const point = clampPosition(event.clientX - drag.dx, event.clientY - drag.dy, element.offsetWidth, element.offsetHeight, innerWidth, innerHeight);
        element.style.left = point.x + 'px'; element.style.top = point.y + 'px';
    });
    const release = () => {
        if (drag?.element !== element) return;
        element.classList.remove('picked-up'); savePosition(element, key); drag = null;
    };
    element.addEventListener('pointerup', release); element.addEventListener('pointercancel', release);
    element.addEventListener('keydown', event => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault(); meaningful();
        const rect = element.getBoundingClientRect();
        const point = clampPosition(rect.left + (event.key === 'ArrowRight' ? 20 : event.key === 'ArrowLeft' ? -20 : 0), rect.top + (event.key === 'ArrowDown' ? 20 : event.key === 'ArrowUp' ? -20 : 0), rect.width, rect.height, innerWidth, innerHeight);
        element.style.left = point.x + 'px'; element.style.top = point.y + 'px'; savePosition(element, key);
    });
}
function savePosition(element, key) {
    const rect = element.getBoundingClientRect();
    updateCharacterSettings({ [key]: { x: rect.left / Math.max(1, innerWidth - rect.width), y: rect.top / Math.max(1, innerHeight - rect.height) } });
}
function meaningful() { lastActivity = Date.now(); readingSince = 0; tick(); }
function avoidControls() {
    if (drag || (innerWidth >= 600 && !document.body.classList.contains('control-page')) || !settings.visible) return;
    const controls = [...document.querySelectorAll('input,select,textarea,button:not(#agCharacter):not(.robot-glass),a')]
        .filter(element => element.getClientRects().length && !element.closest('.modal.hidden'));
    const bounds = robot.getBoundingClientRect();
    const offsetX = bounds.left - parseFloat(robot.style.left || 0), offsetY = bounds.top - parseFloat(robot.style.top || 0);
    const overlaps = point => controls.some(element => {
        const controlBounds = element.getBoundingClientRect();
        const x = point.x + offsetX, y = point.y + offsetY;
        return controlBounds.left < x + bounds.width && controlBounds.right > x && controlBounds.top < y + bounds.height && controlBounds.bottom > y;
    });
    if (!overlaps({x:parseFloat(robot.style.left || 0),y:parseFloat(robot.style.top || 0)})) return;
    const width = robot.offsetWidth, height = robot.offsetHeight;
    const headerBottom = document.querySelector('body > header')?.getBoundingClientRect().bottom || 0;
    const candidates = [
        {x:innerWidth-width-8,y:headerBottom+12}, {x:8,y:headerBottom+12},
        {x:innerWidth-width-8,y:(innerHeight-height)/2}, {x:8,y:(innerHeight-height)/2},
        {x:innerWidth-width-8,y:8},{x:8,y:8},
        {x:innerWidth-width-8,y:innerHeight-height-8},{x:8,y:innerHeight-height-8}
    ].map(point => clampPosition(point.x,point.y,width,height,innerWidth,innerHeight));
    const point = candidates.find(candidate => !overlaps(candidate));
    if (point) { robot.style.left = point.x + 'px'; robot.style.top = point.y + 'px'; }
}
function passwordActive() { return privateInput && (document.activeElement === privateInput || privateInput.closest('.password-group')?.contains(document.activeElement)); }
function tick() {
    if (!robot) return;
    const state = inactivityState(Date.now() - lastActivity, settings.sleepMinutes);
    const privacy = passwordActive();
    robot.classList.toggle('eyes-closed', Boolean(privacy));
    robot.dataset.state = privacy ? 'privacy' : Date.now() < reactionUntil ? reaction : state === 'awake' && readingSince && Date.now() - readingSince > 20000 ? 'reading' : state;
    const modalOpen = [...document.querySelectorAll('.modal, .category-modal')].some(el => !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none');
    robot.classList.toggle('modal-obscured', modalOpen);
    glass.classList.toggle('modal-obscured', modalOpen);
    if (!modalOpen) avoidControls();
    glass.classList.toggle('glass-active', robot.dataset.state === 'reading' && !modalOpen);
    if (settings.glassMode === 'follow') {
        const rect = robot.getBoundingClientRect();
        const point = clampPosition(rect.left - 42, rect.top + 35, 52, 65, innerWidth, innerHeight);
        glass.style.left = point.x + 'px'; glass.style.top = point.y + 'px';
    }
}
export function initCharacter() {
    if (robot) return;
    robot = document.createElement('button'); robot.type = 'button'; robot.id = 'agCharacter'; robot.className = 'ag-character';
    robot.setAttribute('aria-label', t('character.drag'));
    glass = document.createElement('button'); glass.type = 'button'; glass.className = 'robot-glass'; glass.setAttribute('aria-label', t('character.position')); glass.innerHTML = '<span></span>';
    document.body.append(robot, glass); attachDrag(robot, 'position'); attachDrag(glass, 'glassPosition');
    ['pointerdown', 'keydown', 'input', 'touchstart'].forEach(type => document.addEventListener(type, meaningful, { passive: true }));
    document.addEventListener('scroll', () => { lastActivity = Date.now(); readingSince = Date.now(); tick(); }, { passive: true, capture: true });
    document.addEventListener('focusin', event => {
        if (event.target.matches('[data-password], input[type="password"]')) privateInput = event.target;
        // Move away from a focused input if the saved character overlaps its controls.
        const rect = event.target.getBoundingClientRect(), bot = robot.getBoundingClientRect();
        if (rect.left < bot.right && rect.right > bot.left && rect.top < bot.bottom && rect.bottom > bot.top) position(robot, { x: 0, y: 0 });
        tick();
    });
    document.addEventListener('focusout', () => queueMicrotask(tick));
    window.addEventListener('resize', applySettings);
    window.addEventListener('characterReaction', event => { reaction = event.detail.state; reactionUntil = Date.now() + 2200; tick(); });
    window.addEventListener('languageChanged', () => { updateCharacterLabel(); glass.setAttribute('aria-label', t('character.position')); });
    window.addEventListener('storage', event => {
        if (event.key !== 'ag.character') return;
        try { settings = normalizeSettings(JSON.parse(event.newValue || '{}')); applySettings(); window.dispatchEvent(new CustomEvent('characterSettingsChanged', {detail:settings})); } catch {}
    });
    setInterval(tick, 1000); applySettings();
}

export function initPasswordInteractions(root = document) {
    root.querySelectorAll('[data-password]').forEach(input => {
        if (input.dataset.enhanced) return; input.dataset.enhanced = 'true';
        const group = input.closest('.password-group');
        const torch = document.createElement('button'); torch.type = 'button'; torch.className = 'password-torch'; torch.textContent = '◐';
        torch.setAttribute('aria-label', t('password.torch')); torch.setAttribute('aria-pressed', 'false');
        group.append(torch); let timeout;
        const hide = () => { input.type = 'password'; torch.setAttribute('aria-pressed', 'false'); group.classList.remove('illuminated'); clearTimeout(timeout); };
        torch.addEventListener('click', () => {
            privateInput = input;
            if (input.type === 'text') hide();
            else { input.type = 'text'; torch.setAttribute('aria-pressed', 'true'); group.classList.add('illuminated'); timeout = setTimeout(hide, 8000); }
            tick();
        });
        group.addEventListener('focusout', () => queueMicrotask(() => { if (!group.contains(document.activeElement)) hide(); }));
        document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
        input.addEventListener('select', () => { privateInput = input; tick(); });
        input.addEventListener('input', () => { privateInput = input; tick(); });
        if (input.hasAttribute('data-strength')) {
            const assistant = document.createElement('div'); assistant.className = 'password-assistant'; assistant.setAttribute('aria-live', 'polite'); group.after(assistant);
            const render = () => {
                const criteria = passwordCriteria(input.value);
                assistant.replaceChildren();
                for (const key of ['character.privacy', 'character.strength']) { const p = document.createElement('p'); p.textContent = t(key); assistant.append(p); }
                const meter = document.createElement('meter'); meter.min = 0; meter.max = 5; meter.value = Object.values(criteria).filter(Boolean).length; meter.setAttribute('aria-label', t('character.strength')); assistant.append(meter);
                for (const [key, passed] of Object.entries(criteria)) { const span = document.createElement('span'); span.className = passed ? 'passed' : ''; span.textContent = (passed ? '✓ ' : '○ ') + t('password.' + key); assistant.append(span); }
            };
            input.addEventListener('input', render); window.addEventListener('languageChanged', render); render();
        }
        window.addEventListener('languageChanged', () => torch.setAttribute('aria-label', t('password.torch')));
    });
    const password = document.getElementById('signupPassword'), confirm = document.getElementById('signupConfirm');
    if (password && confirm) {
        const validate = () => {
            const matches = confirm.value && confirm.value === password.value;
            confirm.setCustomValidity(confirm.value && !matches ? t('validation.mismatch') : '');
            const hint = document.getElementById('passwordMatch'); hint.textContent = confirm.value ? t(matches ? 'validation.match' : 'validation.mismatch') : '';
            hint.classList.toggle('field-error', Boolean(confirm.value && !matches)); confirm.setAttribute('aria-invalid', String(Boolean(confirm.value && !matches)));
        };
        password.addEventListener('input', validate); confirm.addEventListener('input', validate); window.addEventListener('languageChanged', validate);
    }
}
