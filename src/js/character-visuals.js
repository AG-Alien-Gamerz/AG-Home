// Code-native figures share the existing face/limb hooks, so every appearance
// keeps the same privacy, reactions, sleep, reduced-motion and dragging behavior.
import {characterAppearance} from './character-state.js';
const face = '<span class="robot-face"><i class="robot-eye"></i><i class="robot-eye"></i><i class="robot-mouth"></i></span>';
const limbs = '<span class="robot-arm left"></span><span class="robot-arm right"></span><span class="robot-leg left"></span><span class="robot-leg right"></span><span class="robot-shadow"></span><span class="robot-zzz" aria-hidden="true">z z z</span>';
const robot = `<span class="robot-antenna"></span><span class="robot-head">${face}</span><span class="robot-neck"></span><span class="robot-body"><i class="robot-heart"></i></span>${limbs}`;
const human = `<span class="human-hair-back"></span><span class="robot-head"><span class="human-hair"></span>${face}<i class="human-ear left"></i><i class="human-ear right"></i></span><span class="robot-neck"></span><span class="robot-body"><i class="robot-heart"></i><span class="human-collar"></span></span><span class="human-dupatta"></span>${limbs}`;
export function characterMarkup(appearance = 'robot') {
    return `<span class="character-figure" aria-hidden="true">${characterAppearance(appearance).id === 'robot' ? robot : human}</span>`;
}
