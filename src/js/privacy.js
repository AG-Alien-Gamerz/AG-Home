import { applyTranslations } from './localization.js';

const documentPane = document.getElementById('privacyDocument');
const navigation = document.querySelector('.privacy-nav');
const links = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = links.map(link => document.getElementById(link.hash.slice(1)));
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let active, scheduled = false;

function markActive(section) {
    if (!section || active === section.id) return;
    active = section.id;
    for (const link of links) {
        const selected = link.hash === '#' + active;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
    // Scroll only the sidebar's own list; scrollIntoView could also move the document.
    const list = navigation.querySelector('ul'), link = links.find(link => link.hash === '#' + active);
    const item = link.getBoundingClientRect(), area = list.getBoundingClientRect();
    if (getComputedStyle(list).flexDirection === 'row') {
        if (item.left < area.left || item.right > area.right) list.scrollBy({left: item.left - area.left, behavior: 'auto'});
    } else if (item.top < area.top || item.bottom > area.bottom) {
        list.scrollBy({top: item.top - area.top, behavior: 'auto'});
    }
}
function updateActive() {
    const top = documentPane.getBoundingClientRect().top + 48;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= top) current = section;
    if (documentPane.scrollTop + documentPane.clientHeight >= documentPane.scrollHeight - 2) current = sections.at(-1);
    markActive(current);
}
function navigate(hash, smooth = true) {
    const section = sections.find(section => '#' + section.id === (hash || '#introduction'));
    if (!section) return;
    const top = section === sections[0] ? 0 : section.getBoundingClientRect().top - documentPane.getBoundingClientRect().top + documentPane.scrollTop - 24;
    documentPane.scrollTo({top, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto'});
    markActive(section);
}
for (const link of links) {
    link.dataset.i18n = 'privacy.' + link.hash.slice(1);
    link.addEventListener('click', event => {
        event.preventDefault(); history.pushState(null, '', link.hash); navigate(link.hash);
        documentPane.focus({preventScroll: true});
    });
}
documentPane.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(() => { scheduled = false; updateActive(); }); }
}, {passive: true});
window.addEventListener('hashchange', () => navigate(location.hash));
window.addEventListener('resize', updateActive);
applyTranslations(navigation);
navigate(location.hash, false); updateActive();
