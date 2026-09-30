/**
 * Notes and Explore, until their content arrives. Each says plainly what is coming and when, and
 * points at what already works.
 */
import { CHAPTERS, unitById } from '../data/catalog.js';
import { hashFor } from '../engine/router.js';
import { escapeHTML as esc } from './shared.js';

export function renderNotes(root, { unitId }) {
  const unit = unitById(unitId);
  root.innerHTML = `
    <div class="stack">
      <h2>Notes</h2>
      <div class="card stack">
        <p>Rewritten class notes arrive here chapter by chapter, from the weekly Canvas drop, in the same format as FLUX's: every worked example recomputed, slips in the source marked as corrections, and each section linked to its practice problems and lab.</p>
        <p class="note">Until then, use the teacher's notes. The practice problems cite the example each version is built on (for example “Notes Ex 1.13”).</p>
      </div>
      <h3>Chapters on this exam</h3>
      <ul class="plist card" style="padding:0">
        ${CHAPTERS.filter((c) => unit.chapters.includes(c.ch))
          .map((c) => `<li><a href="${hashFor({ unitId })}"><i class="dot"></i><span>Ch ${c.ch} · ${esc(c.title)}</span><span class="tag">notes soon</span></a></li>`)
          .join('')}
      </ul>
    </div>`;
  root.onclick = null;
}

export function renderExplore(root, { unitId }) {
  const LABS = [
    ['Distributions', 'Ch 3, 5, 6', 'Binomial, geometric, Poisson, uniform and normal with sliders and shaded probabilities.', 'next'],
    ['Sampling distributions (CLT)', 'Ch 7', 'Draw thousands of samples from a skewed population and watch x̄ settle into a normal curve with spread σ/√n.', 'for 14 Oct'],
    ['Confidence interval coverage', 'Ch 8', '100 intervals at once: which ones catch μ, as you change the confidence level and n.', 'planned'],
    ['Errors and power', 'Ch 8', 'H₀ and H₁ side by side; drag α, n and the effect and watch β and power move.', 'planned'],
    ['Which test?', 'Ch 8–9', 'A decision tree from the question to the right test, its formula and its assumptions.', 'planned'],
    ['Regression', 'Ch 10', 'Drag points; the least-squares line, residuals and R² follow.', 'planned'],
  ];
  root.innerHTML = `
    <div class="stack">
      <h2>Explore</h2>
      <p class="note">Labs are interactive pictures you change to test an idea. None is built yet: the practice bank and the tables came first, for the midterm. Here is the order they arrive in.</p>
      ${LABS.map(([t, ch, d, when]) => `<div class="card"><div class="row" style="justify-content:space-between"><h3>${esc(t)}</h3><span class="tag">${esc(ch)} · ${esc(when)}</span></div><p class="note" style="margin-top:6px">${esc(d)}</p></div>`).join('')}
      <a class="btn" href="${hashFor({ unitId, mode: 'tables' })}">Open the tables</a>
    </div>`;
  root.onclick = null;
}
