/**
 * Notes, until their content arrives. Each says plainly what is coming and when, and
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
