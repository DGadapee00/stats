/**
 * Authoring kit for problem generators. A template is a generator: variables with ranges, answers
 * computed from them, and a worked solution that reads like the teacher's: formula, numbers in,
 * result, with every table lookup named. See PROBLEMS.md.
 */
import { zTable, zCritTable, tTable, chi2Table, fTable, binomTable, poisTable } from '../stats/tables.js';

// ---------- variables ----------
export const range = (min, max, step, opts = {}) => ({ type: 'range', min, max, step, ...opts });
export const choice = (...opts) => ({ type: 'choice', options: opts.map(([value, label]) => ({ value, label })) });
/**
 * A data set drawn fresh for each version. `make(rand, values)` returns an array; it runs after
 * the ranges and choices, so it can use them (a sample of size n). `format` writes it for the text.
 */
export const data = (make, format = null) => ({ type: 'data', make, format });

// ---------- parts ----------
/**
 * Numeric answer. `get($)` is the exact answer. Options:
 *   alt($)  other accepted answers (the table route): a number or a list
 *   tol     relative tolerance (default 0.5%)   abs  absolute tolerance
 *   traps   [[valueFn, message], …]: a named mistake, recognised when typed
 *   unit    text after the box ("minutes")        label  the part's question
 */
export const num = (id, get, o = {}) => ({
  id,
  kind: 'numeric',
  get,
  alt: o.alt ?? null,
  tol: o.tol ?? 0.005,
  abs: o.abs ?? 0,
  traps: o.traps ?? [],
  unit: o.unit ?? null,
  label: o.label ?? null,
  prob: false,
});

/**
 * A probability. Graded to about table precision: within 0.001 of the exact value or of the
 * table route in `alt`, so 0.309 and 0.3085 are both right for 0.30854, and 25% reads as 0.25.
 */
export const prob = (id, get, o = {}) => ({ ...num(id, get, { abs: 0.001, tol: 0, ...o }), prob: true });

/** Multiple choice. An option may carry a third entry: why that answer is wrong. */
export const mc = (id, options, correct, o = {}) => {
  const norm = (list) => list.map(([value, label, why]) => (why ? { value, label, why } : { value, label }));
  return {
    id,
    kind: 'choice',
    options: typeof options === 'function' ? ($) => norm(options($)) : norm(options),
    correct,
    multi: !!o.multi,
    label: o.label ?? null,
  };
};

export const tf = (id, correct, o = {}) => mc(id, [[1, 'True'], [0, 'False']], correct ? 1 : 0, o);

/** Free response (a sketch, a sentence of interpretation), checked by the student against a rubric. */
export const self = (id, prompt, rubric) => ({ id, kind: 'self', label: prompt, rubric });

// ---------- template ----------
export function problem(spec) {
  return {
    level: 1,
    kind: 'numeric',
    topics: [],
    vars: {},
    derive: () => ({}),
    valid: () => true,
    hints: [],
    steps: () => [],
    cases: [],
    ...spec,
  };
}

/** A worked case: the notes' or a worksheet's own numbers. want: partId → expected value. */
export const kase = (src, v, want, o = {}) => ({ src, v, want, key: o.key ?? null, note: o.note ?? null });

// ---------- numbers in TeX ----------

/** A number for the inside of `$…$`, to `n` significant figures, never in e-notation. */
export function tn(x, n = 4) {
  if (!Number.isFinite(x)) return x > 0 ? '\\infty' : x < 0 ? '-\\infty' : '-';
  if (x === 0) return '0';
  const a = Math.abs(x);
  if (a >= 1e-4 && a < 1e7) return String(Number(x.toPrecision(n)));
  const [m, e] = x.toExponential(n - 1).split('e');
  return `${Number(m)}\\times 10^{${Number(e)}}`;
}

/** A number to `dp` decimal places, trailing zeros kept: fx(0.3, 4) → "0.3000". */
export const fx = (x, dp = 4) => (Object.is(Math.round(x * 10 ** dp), -0) ? (0).toFixed(dp) : x.toFixed(dp));

/** A number in parentheses when negative, for a product or a subtraction: pn(-1.5) → "(-1.5)". */
export const pn = (x, n = 4) => (x < 0 ? `(${tn(x, n)})` : tn(x, n));

/** Round half away from zero, as a person does. */
export const roundTo = (x, dp) => Math.sign(x) * Math.round(Math.abs(x) * 10 ** dp + 1e-9) / 10 ** dp;

// ---------- table lookups, for solutions and `alt` ----------

/**
 * Φ(z) the two ways: exact, and read off Table A.3 after rounding z to 2 places. `line` is the
 * step to show, e.g. "Table A.3 at z = −1.24: 0.1075".
 */
export function zLook(z) {
  const t = zTable(z);
  const zs = fx(t.z, 2);
  const line = t.off
    ? String.raw`$z = ${zs}$ is past the end of Table A.3, so $\Phi(z) \approx ${fx(t.value, 4)}$ (or ${t.z < 0 ? 0 : 1})`
    : String.raw`Table A.3 at $z = ${zs}$: $\Phi(${zs}) = ${fx(t.value, 4)}$`;
  return { z: t.z, table: t.value, values: t.values, line };
}

/** z_α from the table, with the note on how it was read. */
export function zCritLook(alpha) {
  const t = zCritTable(alpha);
  const line = t.tie
    ? String.raw`Table A.3: the area $${fx(1 - alpha, 4)}$ falls halfway between $z = ${fx(t.values[1], 2)}$ and $${fx(t.values[2], 2)}$, so $z_{${alpha}} = ${t.z}$`
    : String.raw`Table A.3: the area closest to $${fx(1 - alpha, 4)}$ is at $z = ${fx(t.z, 2)}$, so $z_{${alpha}} = ${fx(t.z, 2)}$`;
  return { value: t.z, values: t.values, line };
}

const dfTex = (df) => (df === Infinity ? '\\infty' : String(df));

/** t_α(ν) from Table A.4, with the line for the solution (both rows when ν falls between them). */
export function tLook(alpha, df) {
  const t = tTable(alpha, df);
  if (!t.inTable) return { value: null, values: [], line: '' };
  const line =
    t.rows.length === 1 && t.rows[0] === df
      ? String.raw`Table A.4, $\nu = ${dfTex(df)}$, $\alpha = ${alpha}$: $t_{${alpha}} = ${fx(t.value, 3)}$`
      : String.raw`Table A.4 has no row for $\nu = ${df}$; the rows ${t.rows.map((r) => String.raw`$\nu = ${dfTex(r)}$`).join(' and ')} give ${t.values.map((v) => `$${fx(v, 3)}$`).join(' and ')} (either is accepted; the smaller $\nu$ is the safer choice)`;
  return { value: t.value, values: t.values, line };
}

/** χ²_α(ν) from Table A.5. */
export function chi2Look(alpha, df) {
  const t = chi2Table(alpha, df);
  if (!t.inTable) return { value: null, values: [], line: '' };
  const line =
    t.rows.length === 1 && t.rows[0] === df
      ? String.raw`Table A.5, $\nu = ${df}$, $\alpha = ${alpha}$: $\chi^2_{${alpha}} = ${t.value}$`
      : String.raw`Table A.5 has no row for $\nu = ${df}$; the rows ${t.rows.map((r) => String.raw`$\nu = ${r}$`).join(' and ')} give ${t.values.map((v) => `$${v}$`).join(' and ')}`;
  return { value: t.value, values: t.values, line };
}

/** f_α(ν₁, ν₂) from Table A.6, through the reciprocal rule for a lower point. */
export function fLook(alpha, v1, v2) {
  const t = fTable(alpha, v1, v2);
  if (!t.inTable) return { value: null, values: [], line: '' };
  const line = t.reciprocal
    ? String.raw`$f_{${fx(alpha, 2)}}(${v1}, ${v2}) = \dfrac{1}{f_{${t.reciprocal.alpha}}(${v2}, ${v1})} = \dfrac{1}{${fx(t.reciprocal.value, 2)}} = ${fx(t.value, 4)}$ (Table A.6)`
    : String.raw`Table A.6, $f_{${alpha}}(${v1}, ${v2}) = ${fx(t.value, 2)}$`;
  return { value: t.value, values: t.values, line };
}

export { binomTable, poisTable };
