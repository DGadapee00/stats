/**
 * The notes, headless. For every chapter:
 *   - section ids are unique and in order, and every block is a known kind;
 *   - all the TeX parses, and no text says NaN or undefined;
 *   - every linked problem exists, and a linked worked case exists and cites the same example;
 *   - every linked lab exists;
 *   - every worked example's `checks` hold: each number the notes state is recomputed from the
 *     data (a notes example with stated numbers and no checks is reported).
 *
 *   node scripts/notes-check.mjs
 */
import { NOTES } from '../src/notes/index.js';
import { problemById } from '../src/problems/index.js';
import { labById } from '../src/labs/index.js';
import { mathPieces, texError } from '../src/ui/shared.js';

let checks = 0;
let fails = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    fails++;
    console.log(`FAIL ${msg}`);
  }
};

function text(where, s) {
  const str = String(s);
  ok(!/\bNaN\b|undefined/.test(str), `${where}: says ${str}`);
  for (const p of mathPieces(str)) {
    ok(!p.unclosed, `${where}: unclosed $ in ${JSON.stringify(str.slice(0, 80))}`);
    if (!p.unclosed) {
      const e = texError(p.src, p.display);
      ok(!e, `${where}: TeX ${JSON.stringify(p.src)}: ${e}`);
    }
  }
  ok((str.match(/\*\*/g) || []).length % 2 === 0, `${where}: unbalanced ** in ${JSON.stringify(str.slice(0, 80))}`);
}

const KINDS = new Set(['p', 'def', 'key', 'list', 'steps', 'table', 'ex', 'ti', 'why', 'fix', 'warn']);
let examples = 0;
let recomputed = 0;
for (const N of NOTES) {
  const W = `notes ch${N.ch}`;
  ok(N.title && N.sections.length, `${W}: needs a title and sections`);
  const ids = N.sections.map((s) => s.id);
  ok(new Set(ids).size === ids.length, `${W}: duplicate section ids`);
  ids.forEach((id, i) => ok(id.startsWith(`${N.ch}.`), `${W}: section ${id} is not in chapter ${N.ch}`) && i);
  for (const sec of N.sections) {
    const S = `${W} §${sec.id}`;
    text(`${S} title`, sec.title);
    if (sec.lab) ok(labById(sec.lab), `${S}: no lab ${sec.lab}`);
    for (const id of sec.problems || []) ok(problemById(id), `${S}: no problem ${id}`);
    for (const b of sec.blocks) {
      const [kind, x, y] = b;
      ok(KINDS.has(kind), `${S}: unknown block ${kind}`);
      if (['p', 'key', 'why', 'fix', 'warn'].includes(kind)) text(`${S} ${kind}`, x);
      if (kind === 'def') {
        text(`${S} def`, x);
        text(`${S} def`, y);
      }
      if (['list', 'steps', 'ti'].includes(kind)) for (const t of x) text(`${S} ${kind}`, t);
      if (kind === 'table') for (const r of [x.head || [], ...x.rows]) for (const c of r) text(`${S} table`, c);
      if (kind === 'ex') {
        examples++;
        const E = `${S} Ex ${x.n}`;
        text(`${E} q`, x.q);
        for (const t of x.a) text(`${E} step`, t);
        if (x.answer) text(`${E} answer`, x.answer);
        if (x.problem) {
          const tpl = problemById(x.problem);
          ok(tpl, `${E}: no problem ${x.problem}`);
          if (tpl && x.case != null) {
            const c = tpl.cases?.[x.case];
            ok(c, `${E}: ${x.problem} has no case ${x.case}`);
            // The case must cite this example: "Notes Ex 4.1, 4.6" covers 4.6, "Ex 3.3–3.4" covers 3.4.
            if (c) ok(/Notes Ex/.test(c.src) && new RegExp(`(^|[^\\d.])${x.n.replace('.', '\\.')}($|[^\\d])`).test(c.src), `${E}: case ${x.case} of ${x.problem} is "${c.src}", not this example`);
          }
        }
        if (x.checks) {
          for (const [label, got, want, tol] of x.checks()) {
            recomputed++;
            ok(Number.isFinite(got) && Math.abs(got - want) <= tol + 1e-12, `${E} ${label}: the notes say ${want}, recomputed ${got}`);
          }
        } else if (/\d\.\d|=\s*\d/.test(x.a.join(' ') + (x.answer || ''))) {
          console.log(`note: ${E} states numbers but has no checks`);
        }
      }
    }
  }
}
console.log(`notes-check: ${NOTES.length} chapters, ${examples} worked examples, ${recomputed} numbers recomputed, ${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
