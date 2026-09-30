/**
 * Notes: the chapters on this exam, then a chapter page with its sections in order. Worked examples
 * keep their solution folded until asked for, and link to the practice problem built on the same
 * numbers; each section links to its lab.
 */
import { CHAPTERS, unitById } from '../data/catalog.js';
import { hashFor } from '../engine/router.js';
import { NOTES, notesFor } from '../notes/index.js';
import { problemById } from '../problems/index.js';
import { CASE_SEED } from '../problems/engine.js';
import { labById } from '../labs/index.js';
import { mathProse, escapeHTML as esc } from './shared.js';

/** Notes prose: the panel markup, plus **bold** (applied after escaping, outside the math). */
const P = (t) => mathProse(t).replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>');

function block(b, unitId) {
  const [kind, x, y] = b;
  switch (kind) {
    case 'p':
      return `<p>${P(x)}</p>`;
    case 'def':
      return `<div class="nb nb-def"><b>${P(x)}</b> ${P(y)}</div>`;
    case 'key':
      return `<div class="nb nb-key">${P(x)}</div>`;
    case 'why':
      return `<div class="nb nb-why"><span class="nb-tag">Why</span> ${P(x)}</div>`;
    case 'warn':
      return `<div class="nb nb-warn"><span class="nb-tag">Watch out</span> ${P(x)}</div>`;
    case 'fix':
      return `<div class="nb nb-fix"><span class="nb-tag">Correction to the source</span> ${P(x)}</div>`;
    case 'list':
      return `<ul class="nb-list">${x.map((t) => `<li>${P(t)}</li>`).join('')}</ul>`;
    case 'steps':
      return `<ol class="nb-list">${x.map((t) => `<li>${P(t)}</li>`).join('')}</ol>`;
    case 'ti':
      return `<details class="nb nb-ti"><summary>On the TI-84</summary><ol>${x.map((t) => `<li>${P(t)}</li>`).join('')}</ol></details>`;
    case 'table':
      return `<div class="scroll-x"><table class="nb-table">${x.head ? `<thead><tr>${x.head.map((h) => `<th>${P(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${x.rows
        .map((r) => `<tr>${r.map((c) => `<td>${P(String(c))}</td>`).join('')}</tr>`)
        .join('')}</tbody></table></div>${x.note ? `<p class="note">${P(x.note)}</p>` : ''}`;
    case 'ex':
      return exampleHTML(x, unitId);
    default:
      return '';
  }
}

function exampleHTML(e, unitId) {
  const tpl = e.problem ? problemById(e.problem) : null;
  const seed = e.case ? CASE_SEED + e.case : 0;
  const link = tpl ? `<a class="btn small" href="${hashFor({ unitId, problemId: tpl.id, seed })}">Work it in Practice</a>` : '';
  return `<div class="nb nb-ex">
      <div class="nb-ex-head">Example ${esc(e.n)}</div>
      <p>${P(e.q)}</p>
      ${e.data ? block(['table', e.data], unitId) : ''}
      <details class="nb-sol"><summary>Solution</summary><ol>${e.a.map((t) => `<li>${P(t)}</li>`).join('')}</ol>${e.answer ? `<div class="nb-answer">${P(e.answer)}</div>` : ''}</details>
      ${link ? `<div class="row">${link}</div>` : ''}
    </div>`;
}

function sectionHTML(sec, unitId) {
  const lab = sec.lab ? labById(sec.lab) : null;
  const probs = (sec.problems || []).map(problemById).filter(Boolean);
  const foot = [];
  if (lab) foot.push(`<a href="${hashFor({ unitId, mode: 'explore', labId: lab.id })}">Lab: ${esc(lab.title)}</a>`);
  for (const t of probs) foot.push(`<a href="${hashFor({ unitId, problemId: t.id })}">Practice: ${esc(t.title)}</a>`);
  return `<section class="nb-sec" id="s${esc(sec.id)}">
      <h3><span class="nb-num">${esc(sec.id)}</span> ${P(sec.title)}</h3>
      ${sec.blocks.map((b) => block(b, unitId)).join('')}
      ${foot.length ? `<p class="nb-foot">${foot.join('<span class="dim"> · </span>')}</p>` : ''}
    </section>`;
}

export function renderNotes(root, { unitId, chapter }) {
  const unit = unitById(unitId);
  const N = chapter ? notesFor(chapter) : null;
  if (N) {
    const i = unit.chapters.indexOf(N.ch);
    const prev = i > 0 ? notesFor(unit.chapters[i - 1]) : null;
    const next = i >= 0 && i < unit.chapters.length - 1 ? notesFor(unit.chapters[i + 1]) : null;
    root.innerHTML = `
      <article class="notes stack">
        <div class="crumbs"><a href="${hashFor({ unitId, mode: 'notes' })}">← Notes</a><span class="dim">Chapter ${esc(N.ch)}</span></div>
        <h2>${esc(N.ch)}. ${esc(N.title)}</h2>
        <nav class="nb-toc">${N.sections.map((s) => `<a href="#s${esc(s.id)}" data-sec="s${esc(s.id)}">${esc(s.id)} ${P(s.title)}</a>`).join('')}</nav>
        ${N.sections.map((s) => sectionHTML(s, unitId)).join('')}
        <div class="row nb-pager">
          ${prev ? `<a class="btn" href="${hashFor({ unitId, mode: 'notes', chapter: prev.ch })}">← Ch ${esc(prev.ch)}</a>` : ''}
          ${next ? `<a class="btn" href="${hashFor({ unitId, mode: 'notes', chapter: next.ch })}">Ch ${esc(next.ch)} →</a>` : ''}
        </div>
      </article>`;
    // Section links scroll in place; the hash stays the chapter's route.
    root.onclick = (e) => {
      const a = e.target.closest('[data-sec]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.sec)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    return;
  }
  const have = new Set(NOTES.map((n) => n.ch));
  root.innerHTML = `
    <div class="stack">
      <h2>Notes</h2>
      <p class="note">The teacher's notes, rewritten: every worked example recomputed, with the solution folded until you want it and a link to practice the same problem. Where the source slips, the correction is marked.</p>
      <ul class="plist card" style="padding:0">
        ${CHAPTERS.filter((c) => unit.chapters.includes(c.ch))
          .map((c) => {
            const N2 = notesFor(c.ch);
            return have.has(c.ch)
              ? `<li><a href="${hashFor({ unitId, mode: 'notes', chapter: c.ch })}"><i class="dot mastered"></i><span>Ch ${c.ch} · ${esc(c.title)}</span><span class="tag">${N2.sections.length} sections</span></a></li>`
              : `<li><a aria-disabled="true"><i class="dot"></i><span class="muted">Ch ${c.ch} · ${esc(c.title)}</span><span class="tag">being written</span></a></li>`;
          })
          .join('')}
      </ul>
    </div>`;
}
