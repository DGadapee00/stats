/** Chapter 9 · Two-sample inference. */
import { problem, kase, range, choice, data, num, prob, mc, tn, fx, pn, SIDE, hyp, pTex, decide, decisionPart, conclude, zTableP, zCrits, endpoint, statPart, pPart, confLabel, tLook, fLook, zCritLook } from '../kit.js';
import { twoPropTest, twoPropInterval, twoZTest, twoZInterval, fTest, fInterval, pooledTest, pooledInterval, welchTest, welchInterval, pairedTest, pairedInterval } from '../../stats/infer.js';
import { fCrit, fCdf } from '../../stats/dist.js';
import { fTable, tTable } from '../../stats/tables.js';
import { createRng } from '../../stats/rng.js';
import { mean, sd, variance } from '../../stats/describe.js';

const C9 = { ch: '9' };
const ALPHA = choice([0.01, '0.01'], [0.05, '0.05'], [0.1, '0.1']);
const CONF = choice([0.9, '90%'], [0.95, '95%'], [0.99, '99%']);
const REL = { two: 'different from', left: 'less than', right: 'greater than' };
const clear = ($) => Math.abs($.p - $.alpha) > 0.004 && $.p > 0.0005;
const d0tex = (d) => (d ? String(d) : '0');

/** Two independent normal samples, rounded to dp. */
function twoSamples(rand, { n1, n2, m1, m2, s1, s2, dp }) {
  const r = createRng(Math.floor(rand() * 2 ** 31));
  const a = Array.from({ length: n1 }, () => Number(r.normal(m1, s1).toFixed(dp)));
  const b = Array.from({ length: n2 }, () => Number(r.normal(m2, s2).toFixed(dp)));
  return [a, b];
}

/** The claim a test is about, in words, e.g. "the mean of formula 1 is less than that of formula 2". */
const claim2 = (side, d0, a, b, what) => (d0 ? `${what} of ${a} exceeds that of ${b} by ${side === 'right' ? 'more than' : side === 'left' ? 'less than' : 'an amount other than'} ${d0}` : `${what} of ${a} is ${REL[side]} that of ${b}`);

export default [
  problem({
    ...C9, id: 'c9.independent-or-paired', title: 'Independent or dependent samples?', kind: 'conceptual', topics: ['paired', 'independent-samples'], src: 'Notes §9.1',
    vars: {
      s: choice(
        ['i1', 'Patients taking drug A are compared with a separate group of patients taking drug B.'],
        ['i2', 'Satisfaction scores of randomly chosen customers in City A are compared with those of randomly chosen customers in City B.'],
        ['i3', 'Test scores of students at School X are compared with those of students at School Y.'],
        ['i4', 'The pain thresholds of 13 men are compared with those of 10 women.'],
        ['d1', 'The blood pressure of each patient is measured before and after treatment.'],
        ['d2', 'Students take a test before and after a training session.'],
        ['d3', 'Psychological measurements are taken on both members of pairs of identical twins.'],
        ['d4', 'Husbands’ incomes are compared with their wives’ incomes, household by household.'],
        ['d5', 'Each student’s reaction time is measured with the dominant hand and with the other hand.'],
      ),
    },
    derive: ($) => ({ key: $.s[0] }),
    text: (T) => T.s,
    parts: [mc('k', [['i', 'Independent samples'], ['d', 'Dependent (matched-pairs) samples']], ($) => $.key)],
    hints: ['Dependent: an individual in one sample determines (or is) the individual in the other.', 'Independent: choosing one sample tells you nothing about who is in the other.'],
    steps: ($) => [$.key === 'd' ? 'Each observation in one sample is paired with a specific observation in the other (the same person, or a natural partner). The samples are dependent: analyze the differences with a paired t procedure.' : 'The two groups are chosen separately; nobody in one group is matched with anybody in the other. The samples are independent.'],
    cases: [kase('Notes §9.1', { s: 'd1' }, { k: 'd' }), kase('Notes §9.1', { s: 'i1' }, { k: 'i' })],
  }),

  // ----------------------------------------------------------------- two proportions
  problem({
    ...C9, id: 'c9.two-prop-test', title: 'Two-proportion z-test', kind: 'numeric', level: 2, topics: ['proportion', 'two-sample', 'z-test'], src: 'Notes Ex 9.1–9.2',
    vars: { n1: range(100, 2500, 10), n2: range(100, 2500, 10), p1: range(0.1, 0.9, 0.01), gap: range(-0.1, 0.1, 0.005), side: SIDE, alpha: ALPHA },
    derive: ($) => {
      const x1 = Math.round($.n1 * $.p1);
      const x2 = Math.round($.n2 * Math.min(0.97, Math.max(0.03, $.p1 - $.gap)));
      const r = twoPropTest({ x1, n1: $.n1, x2, n2: $.n2, side: $.side });
      return { x1, x2, ...r, dec: decide(r.p, $.alpha), c1: $.n1 * r.p1 * (1 - r.p1), c2: $.n2 * r.p2 * (1 - r.p2) };
    },
    valid: ($) => clear($) && $.c1 >= 10 && $.c2 >= 10,
    text: (T, $) => `Two polishing solutions are compared. Of ${$.n1} lenses polished with solution 1, ${$.x1} had no polishing defects; of ${$.n2} polished with solution 2, ${$.x2} had none. The samples are independent. At α = ${$.alpha}, is the proportion without defects for solution 1 ${REL[$.side]} that for solution 2?`,
    parts: [
      num('pool', ($) => $.pool, { label: String.raw`Pooled $\hat p$`, tol: 0, abs: 0.0006 }),
      statPart('z', ($) => $.z, '$z_0$', { traps: [[($) => ($.p1 - $.p2) / Math.sqrt(($.p1 * (1 - $.p1)) / $.n1 + ($.p2 * (1 - $.p2)) / $.n2), 'That uses the unpooled standard error (the one for the interval). Under H₀: p₁ = p₂, the test pools the samples.']] }),
      pPart(($) => $.p, { alt: ($) => [zTableP($.side, $.z)] }),
      decisionPart(),
    ],
    hints: [String.raw`$\hat p = \dfrac{x_1 + x_2}{n_1 + n_2}$, the pooled proportion.`, String.raw`$z_0 = \dfrac{\hat p_1 - \hat p_2}{\sqrt{\hat p(1-\hat p)\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$`, 'TI-84: STAT → TESTS → 6:2-PropZTest.'],
    steps: ($) => {
      const [h0, h1] = hyp('p_1', 'p_2', $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        String.raw`$\hat p_1 = ${$.x1}/${$.n1} = ${fx($.p1, 4)}$, $\hat p_2 = ${$.x2}/${$.n2} = ${fx($.p2, 4)}$, pooled $\hat p = \dfrac{${$.x1} + ${$.x2}}{${$.n1} + ${$.n2}} = ${fx($.pool, 4)}$`,
        String.raw`$$z_0 = \dfrac{${fx($.p1, 4)} - ${fx($.p2, 4)}}{\sqrt{${fx($.pool, 4)}(${fx(1 - $.pool, 4)})\left(\frac{1}{${$.n1}} + \frac{1}{${$.n2}}\right)}} = ${fx($.z, 4)}$$`,
        String.raw`p-value $= ${pTex($.side, 'Z', $.z)} = ${fx($.p, 4)}$`,
        ...conclude($, `the proportion for solution 1 is ${REL[$.side]} that for solution 2`),
      ];
    },
    cases: [
      kase('Notes Ex 9.1', { n1: 300, n2: 300, p1: 253 / 300, gap: 7 / 300, side: 'two', alpha: 0.05 }, { pool: 0.8317, z: 0.76, p: 0.445, dec: 'fail' }),
      kase('Notes Ex 9.2 (as headaches: Nasonex vs placebo)', { n1: 2103, n2: 1671, p1: 547 / 2103, gap: 547 / 2103 - 368 / 1671, side: 'right', alpha: 0.05 }, { z: 2.84, p: 0.0023, dec: 'reject' }),
    ],
  }),

  problem({
    ...C9, id: 'c9.two-prop-interval', title: 'Two-proportion z-interval', kind: 'numeric', level: 2, topics: ['proportion', 'two-sample', 'confidence-interval'], src: 'Notes Ex 9.3',
    vars: { n1: range(100, 1500, 10), n2: range(100, 1500, 10), p1: range(0.1, 0.9, 0.01), gap: range(-0.12, 0.12, 0.005), conf: CONF },
    derive: ($) => {
      const x1 = Math.round($.n1 * $.p1);
      const x2 = Math.round($.n2 * Math.min(0.97, Math.max(0.03, $.p1 - $.gap)));
      const r = twoPropInterval({ x1, n1: $.n1, x2, n2: $.n2, conf: $.conf });
      const zs = zCrits(r.alpha);
      const d = r.p1 - r.p2;
      return { x1, x2, ...r, d, los: zs.map((z) => d - z * r.se), his: zs.map((z) => d + z * r.se), zt: zCritLook(r.alpha / 2) };
    },
    valid: ($) => $.n1 * $.p1 * (1 - $.p1) >= 10 && $.n2 * $.p2 * (1 - $.p2) >= 10,
    text: (T, $) => `Of ${$.n1} lenses polished with solution 1, ${$.x1} had no defects; of ${$.n2} polished with solution 2, ${$.x2} had none. Find a ${confLabel($.conf)} confidence interval for p₁ − p₂.`,
    parts: [endpoint('lo', ($) => $.lo, { alt: ($) => $.los, margin: ($) => $.E }), endpoint('hi', ($) => $.hi, { alt: ($) => $.his, margin: ($) => $.E })],
    hints: [String.raw`$(\hat p_1 - \hat p_2) \pm z_{\alpha/2}\sqrt{\dfrac{\hat p_1(1-\hat p_1)}{n_1} + \dfrac{\hat p_2(1-\hat p_2)}{n_2}}$ (no pooling in the interval).`, 'TI-84: STAT → TESTS → B:2-PropZInt.'],
    steps: ($) => [
      String.raw`$\hat p_1 = ${fx($.p1, 4)}$, $\hat p_2 = ${fx($.p2, 4)}$, $\hat p_1 - \hat p_2 = ${fx($.d, 4)}$`,
      $.zt.line,
      String.raw`$$\frac{\hat p_1 \hat q_1}{n_1} = \frac{${fx($.p1, 4)}(${fx(1 - $.p1, 4)})}{${$.n1}} = ${tn(($.p1 * (1 - $.p1)) / $.n1, 4)}, \quad \frac{\hat p_2 \hat q_2}{n_2} = \frac{${fx($.p2, 4)}(${fx(1 - $.p2, 4)})}{${$.n2}} = ${tn(($.p2 * (1 - $.p2)) / $.n2, 4)}$$`,
      String.raw`$$SE = \sqrt{${tn(($.p1 * (1 - $.p1)) / $.n1, 4)} + ${tn(($.p2 * (1 - $.p2)) / $.n2, 4)}} = ${fx($.se, 4)}$$`,
      String.raw`$$E = ${$.zt.value} \times ${fx($.se, 4)} = ${fx($.zt.value * $.se, 4)}$$`,
      String.raw`$$(${fx($.d - $.zt.value * $.se, 4)},\ ${fx($.d + $.zt.value * $.se, 4)})$$`,
      $.lo < 0 && $.hi > 0 ? 'The interval contains 0, so the data are consistent with p₁ = p₂.' : 'The interval does not contain 0, so the two proportions differ.',
    ],
    cases: [kase('Notes Ex 9.3', { n1: 300, n2: 300, p1: 253 / 300, gap: 7 / 300, conf: 0.95 }, { lo: -0.0365, hi: 0.0832 })],
  }),

  // ----------------------------------------------------------------- two means, variances known
  problem({
    ...C9, id: 'c9.two-z-test', title: 'Two-sample z-test (variances known)', kind: 'numeric', level: 2, topics: ['two-sample', 'z-test'], src: 'Notes Ex 9.4–9.5',
    vars: { ctx: choice(['octane', 'octane'], ['burn', 'burn']), n1: range(10, 40, 1), n2: range(10, 40, 1), v1: range(0.8, 2, 0.1), v2: range(0.8, 2, 0.1), gap: range(-1.2, 1.2, 0.01), d0: choice([0, '0'], [1, '1'], [2, '2'], [4, '4']), side: SIDE, alpha: ALPHA },
    derive: ($) => {
      const x1 = $.ctx === 'octane' ? 89 : 22;
      const x2 = Number((x1 - $.gap - $.d0).toFixed(2));
      const r = twoZTest({ x1, x2, v1: $.v1, v2: $.v2, n1: $.n1, n2: $.n2, d0: $.d0, side: $.side });
      return { x1, x2, ...r, dec: decide(r.p, $.alpha) };
    },
    valid: clear,
    text: (T, $) =>
      $.ctx === 'octane'
        ? `Two formulations of a motor fuel are tested for road octane number. The variances are σ₁² = ${$.v1} for formula 1 and σ₂² = ${$.v2} for formula 2. Samples of n₁ = ${$.n1} and n₂ = ${$.n2} give x̄₁ = ${$.x1} and x̄₂ = ${$.x2}. The populations are normal and independent. At α = ${$.alpha}, is there evidence that ${claim2($.side, $.d0, 'formula 1', 'formula 2', 'the mean octane number')}?`
        : `Two solid-fuel propellants are compared for burning rate (cm/s). The variances are σ₁² = ${$.v1} and σ₂² = ${$.v2}. Samples of n₁ = ${$.n1} and n₂ = ${$.n2} give x̄₁ = ${$.x1} and x̄₂ = ${$.x2}. The populations are normal and independent. At α = ${$.alpha}, is there evidence that ${claim2($.side, $.d0, 'propellant 1', 'propellant 2', 'the mean burning rate')}?`,
    parts: [statPart('z', ($) => $.z, '$z_0$'), pPart(($) => $.p, { alt: ($) => [zTableP($.side, $.z)] }), decisionPart()],
    hints: [String.raw`$z_0 = \dfrac{\bar x_1 - \bar x_2 - \Delta_0}{\sqrt{\sigma_1^2/n_1 + \sigma_2^2/n_2}}$, where $\Delta_0$ is the difference under $H_0$ (usually 0).`, 'TI-84: STAT → TESTS → 3:2-SampZTest (it takes σ, so enter √variance; it assumes Δ₀ = 0, so subtract Δ₀ from x̄₁ first).'],
    steps: ($) => {
      const [h0, h1] = hyp(String.raw`\mu_1 - \mu_2`, d0tex($.d0), $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        String.raw`$$z_0 = \dfrac{${$.x1} - ${$.x2} - ${d0tex($.d0)}}{\sqrt{\dfrac{${$.v1}}{${$.n1}} + \dfrac{${$.v2}}{${$.n2}}}} = ${fx($.z, 4)}$$`,
        String.raw`p-value $= ${pTex($.side, 'Z', $.z)} = ${fx($.p, 4)}$`,
        ...conclude($, claim2($.side, $.d0, $.ctx === 'octane' ? 'formula 1' : 'propellant 1', $.ctx === 'octane' ? 'formula 2' : 'propellant 2', $.ctx === 'octane' ? 'the mean octane number' : 'the mean burning rate')),
      ];
    },
    cases: [
      kase('Notes Ex 9.4', { ctx: 'octane', n1: 15, n2: 20, v1: 1.5, v2: 1.2, gap: -0.69, d0: 0, side: 'two', alpha: 0.05 }, { z: -1.73, p: 0.0845, dec: 'fail' }, { note: 'The notes give x̄₁ = 88.85 and x̄₂ = 89.54; only their difference matters.' }),
      kase('Notes Ex 9.5', { ctx: 'burn', n1: 35, n2: 35, v1: 9, v2: 9, gap: 6.35 - 4, d0: 4, side: 'right', alpha: 0.05 }, { z: 3.28, p: 0.0005, dec: 'reject' }, { note: 'The notes give x̄₁ = 24.37 and x̄₂ = 18.02 (a difference of 6.35) with σ₁ = σ₂ = 3.' }),
    ],
  }),

  problem({
    ...C9, id: 'c9.two-z-interval', title: 'Two-sample z-interval (variances known)', kind: 'numeric', level: 2, topics: ['two-sample', 'confidence-interval'], src: 'Notes Ex 9.6',
    vars: { n1: range(10, 40, 1), n2: range(10, 40, 1), v1: range(0.8, 2, 0.1), v2: range(0.8, 2, 0.1), x2: range(86, 92, 0.01), gap: range(-1.5, 1.5, 0.01), conf: CONF },
    derive: ($) => {
      const x1 = Number(($.x2 + $.gap).toFixed(2));
      const r = twoZInterval({ x1, x2: $.x2, v1: $.v1, v2: $.v2, n1: $.n1, n2: $.n2, conf: $.conf });
      const zs = zCrits(r.alpha);
      const d = x1 - $.x2;
      return { ...r, x1, d, los: zs.map((z) => d - z * r.se), his: zs.map((z) => d + z * r.se), zt: zCritLook(r.alpha / 2) };
    },
    text: (T, $) => `Road octane numbers of two fuel formulations: σ₁² = ${$.v1}, σ₂² = ${$.v2}, n₁ = ${$.n1}, n₂ = ${$.n2}, x̄₁ = ${$.x1}, x̄₂ = ${$.x2}. The populations are normal and independent. Find a ${confLabel($.conf)} confidence interval for μ₁ − μ₂.`,
    parts: [endpoint('lo', ($) => $.lo, { alt: ($) => $.los, margin: ($) => $.E }), endpoint('hi', ($) => $.hi, { alt: ($) => $.his, margin: ($) => $.E })],
    hints: [String.raw`$(\bar x_1 - \bar x_2) \pm z_{\alpha/2}\sqrt{\sigma_1^2/n_1 + \sigma_2^2/n_2}$`, 'TI-84: STAT → TESTS → 9:2-SampZInt.'],
    steps: ($) => [
      $.zt.line,
      String.raw`$$E = ${$.zt.value}\sqrt{\dfrac{${$.v1}}{${$.n1}} + \dfrac{${$.v2}}{${$.n2}}} = ${fx($.zt.value * $.se, 4)}$$`,
      String.raw`$$(${fx($.d, 2)} - ${fx($.zt.value * $.se, 4)},\ ${fx($.d, 2)} + ${fx($.zt.value * $.se, 4)}) = (${fx($.d - $.zt.value * $.se, 3)},\ ${fx($.d + $.zt.value * $.se, 3)})$$`,
      $.lo < 0 && $.hi > 0 ? 'The interval contains 0: no significant difference at this level.' : 'The interval does not contain 0: the means differ.',
    ],
    cases: [kase('Notes Ex 9.6', { n1: 15, n2: 20, v1: 1.5, v2: 1.2, x2: 89.54, gap: -0.69, conf: 0.95 }, { lo: -1.474, hi: 0.094 })],
  }),

  // ----------------------------------------------------------------- variances
  problem({
    ...C9, id: 'c9.f-critical', title: 'Critical values of F', kind: 'numeric', topics: ['f-distribution', 'f-table'], src: 'Notes Ex 9.7',
    vars: { a: choice([0.05, '0.05'], [0.01, '0.01']), v1: range(2, 15, 1), v2: range(2, 30, 1) },
    derive: ($) => {
      const up = fLook($.a, $.v1, $.v2);
      const low = fLook(1 - $.a, $.v1, $.v2);
      return { up, low, fu: fCrit($.a, $.v1, $.v2), fl: fCrit(1 - $.a, $.v1, $.v2) };
    },
    // Table A.6 prints columns ν₁ = 1–10, 12, 15, …; the lower point needs ν₂ as a column too.
    valid: ($) => $.up.values.length === 1 && $.low.values.length === 1 && [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].includes($.v2),
    text: (T, $) => String.raw`Find $f_{${$.a}}(${$.v1}, ${$.v2})$ and $f_{${fx(1 - $.a, 2)}}(${$.v1}, ${$.v2})$.`,
    parts: [
      num('fu', ($) => $.fu, { alt: ($) => $.up.values, tol: 0.004, label: String.raw`$f_{\alpha}(\nu_1, \nu_2)$` }),
      num('fl', ($) => $.fl, { alt: ($) => $.low.values, tol: 0.006, label: String.raw`$f_{1-\alpha}(\nu_1, \nu_2)$`, traps: [[($) => 1 / $.fu, String.raw`Swap the degrees of freedom: $f_{1-\alpha}(\nu_1, \nu_2) = 1/f_{\alpha}(\nu_2, \nu_1)$.`]] }),
    ],
    hints: ['Table A.6 gives only upper points (area α to the right) for α = 0.05 and 0.01: column ν₁, row ν₂.', String.raw`For a lower point: $f_{1-\alpha}(\nu_1, \nu_2) = \dfrac{1}{f_{\alpha}(\nu_2, \nu_1)}$, with the degrees of freedom swapped.`],
    steps: ($) => [$.up.line, $.low.line, String.raw`Exact values: $${fx($.fu, 4)}$ and $${fx($.fl, 4)}$`],
    cases: [kase('Notes Ex 9.7', { a: 0.05, v1: 3, v2: 10 }, { fu: 3.71, fl: 0.1138 })],
  }),

  problem({
    ...C9, id: 'c9.f-interval', title: 'Confidence interval for σ₁²/σ₂²', kind: 'numeric', level: 2, topics: ['f-distribution', 'variance', 'confidence-interval'], src: 'Notes Ex 9.8',
    vars: { n1: choice(...[6, 7, 8, 9, 10, 11, 13, 16, 21, 25].map((n) => [n, String(n)])), n2: choice(...[6, 7, 8, 9, 10, 11, 13, 16, 21, 25].map((n) => [n, String(n)])), s1sq: range(5, 40, 0.1), s2sq: range(5, 40, 0.1), conf: choice([0.9, '90%'], [0.98, '98%']) },
    derive: ($) => {
      const r = fInterval({ s1sq: $.s1sq, s2sq: $.s2sq, n1: $.n1, n2: $.n2, conf: $.conf });
      const a = r.alpha / 2;
      const ta = fTable(a, $.n1 - 1, $.n2 - 1);
      const tb = fTable(a, $.n2 - 1, $.n1 - 1);
      return { ...r, a, ta, tb, lot: ta.values.map((f) => r.ratio / f), hit: tb.values.map((f) => r.ratio * f) };
    },
    valid: ($) => $.ta.inTable && $.tb.inTable,
    text: (T, $) => `An experiment on pain thresholds to electric shock gives, for males, n₁ = ${$.n1} and s₁² = ${$.s1sq}; for females, n₂ = ${$.n2} and s₂² = ${$.s2sq}. The thresholds are normal and independent. Find a ${confLabel($.conf)} confidence interval for σ₁²/σ₂².`,
    parts: [
      num('lo', ($) => $.lo, { alt: ($) => $.lot, tol: 0.006, label: 'Lower bound' }),
      num('hi', ($) => $.hi, { alt: ($) => $.hit, tol: 0.006, label: 'Upper bound', traps: [[($) => $.ratio * $.ta.value, 'Swap the degrees of freedom for the upper bound: multiply by f(n₂ − 1, n₁ − 1).']] }),
    ],
    hints: [String.raw`Lower: $\dfrac{s_1^2/s_2^2}{f_{\alpha/2}(n_1 - 1, n_2 - 1)}$. Upper: $\dfrac{s_1^2/s_2^2}{f_{1-\alpha/2}(n_1 - 1, n_2 - 1)} = \dfrac{s_1^2}{s_2^2}\,f_{\alpha/2}(n_2 - 1, n_1 - 1)$.`, 'Table A.6 prints α = 0.05 and 0.01, so a 90% interval uses α/2 = 0.05 and a 98% interval α/2 = 0.01.'],
    steps: ($) => [
      String.raw`$s_1^2/s_2^2 = ${$.s1sq}/${$.s2sq} = ${fx($.ratio, 4)}$; $\alpha/2 = ${$.a}$`,
      String.raw`Table A.6: $f_{${$.a}}(${$.n1 - 1}, ${$.n2 - 1}) = ${fx($.ta.value, 2)}$ and $f_{${$.a}}(${$.n2 - 1}, ${$.n1 - 1}) = ${fx($.tb.value, 2)}$`,
      String.raw`$$\left(\dfrac{${fx($.ratio, 4)}}{${fx($.ta.value, 2)}},\ ${fx($.ratio, 4)} \times ${fx($.tb.value, 2)}\right) = (${fx($.ratio / $.ta.value, 4)},\ ${fx($.ratio * $.tb.value, 4)})$$`,
      $.lo < 1 && $.hi > 1 ? 'The interval contains 1, so equal variances are plausible.' : 'The interval does not contain 1, so the variances differ.',
    ],
    cases: [kase('Notes Ex 9.8', { n1: 13, n2: 10, s1sq: 12.7, s2sq: 26.4, conf: 0.9 }, { lo: 0.1567, hi: 1.347 })],
  }),

  problem({
    ...C9, id: 'c9.f-test', title: 'Two-sample F-test for variances', kind: 'numeric', level: 2, topics: ['f-distribution', 'variance', 'hypothesis-test'], src: 'Notes Ex 9.9–9.10',
    vars: { n1: range(6, 25, 1), n2: range(6, 25, 1), s1: range(2, 25, 0.01), ratio: range(0.25, 4, 0.01), side: SIDE, alpha: ALPHA },
    derive: ($) => {
      const s2 = Number(($.s1 / Math.sqrt($.ratio)).toFixed(2));
      const r = fTest({ s1sq: $.s1 * $.s1, s2sq: s2 * s2, n1: $.n1, n2: $.n2, side: $.side });
      return { s2, ...r, dec: decide(r.p, $.alpha), lowerSmaller: fCdf(r.f, r.d1, r.d2) < 0.5 };
    },
    valid: clear,
    text: (T, $) => `Arsenic concentration is measured in ${$.n1} metropolitan and ${$.n2} rural communities. The sample standard deviations are s₁ = ${$.s1} (metro) and s₂ = ${$.s2} (rural). The populations are normal and independent. At α = ${$.alpha}, test whether the metro variance is ${REL[$.side]} the rural variance.`,
    parts: [statPart('f', ($) => $.f, '$f_0$', { traps: [[($) => $.s1 / $.s2, String.raw`The F statistic compares variances: square the standard deviations, $f_0 = s_1^2/s_2^2$.`]] }), pPart(($) => $.p), decisionPart()],
    hints: [String.raw`$f_0 = s_1^2/s_2^2$ on $(n_1 - 1, n_2 - 1)$ degrees of freedom.`, 'Two-tailed p-value: twice the smaller tail area. TI-84: STAT → TESTS → E:2-SampFTest.'],
    steps: ($) => {
      const [h0, h1] = hyp(String.raw`\sigma_1^2`, String.raw`\sigma_2^2`, $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        String.raw`$$f_0 = \dfrac{s_1^2}{s_2^2} = \dfrac{${$.s1}^2}{${$.s2}^2} = ${fx($.f, 4)}, \qquad \nu_1 = ${$.d1},\ \nu_2 = ${$.d2}$$`,
        String.raw`p-value $= ${$.side === 'two' ? String.raw`2\min\{P(F < ${fx($.f, 4)}),\ P(F > ${fx($.f, 4)})\}` : $.side === 'right' ? `P(F > ${fx($.f, 4)})` : `P(F < ${fx($.f, 4)})`} = ${fx($.p, 4)}$`,
        ...conclude($, `the metro variance is ${REL[$.side]} the rural variance`),
      ];
    },
    twin: {
      part: 'p',
      n: 20000,
      draw: (r, $) => {
        const f = r.f($.d1, $.d2);
        if ($.side === 'right') return f >= $.f;
        if ($.side === 'left') return f <= $.f;
        // Two-tailed: twice the smaller tail, estimated by doubling that tail's indicator.
        return 2 * ($.lowerSmaller ? f <= $.f : f >= $.f);
      },
    },
    cases: [
      kase('Notes Ex 9.10', { n1: 10, n2: 8, s1: 7.63, ratio: (7.63 / 23.63) ** 2, side: 'two', alpha: 0.05 }, { f: 0.1043, p: 0.003, dec: 'reject' }),
      kase('Notes Ex 9.9 (pain thresholds, s² = 12.7 and 26.4)', { n1: 13, n2: 10, s1: Math.sqrt(12.7), ratio: 12.7 / 26.4, side: 'two', alpha: 0.1 }, { f: 0.4811, p: 0.2368, dec: 'fail' }),
    ],
  }),

  // ----------------------------------------------------------------- two means, variances unknown
  problem({
    ...C9, id: 'c9.pooled-t-test', title: 'Pooled two-sample t-test', kind: 'numeric', level: 3, topics: ['two-sample', 't-test', 'pooled'], src: 'Notes Ex 9.11',
    vars: { n1: range(6, 25, 1), n2: range(6, 25, 1), x1: range(10, 20, 0.1), gap: range(-5, 5, 0.1), v1: range(8, 30, 0.1), v2: range(8, 30, 0.1), side: SIDE, alpha: ALPHA },
    derive: ($) => {
      const x2 = Number(($.x1 - $.gap).toFixed(1));
      const r = pooledTest({ x1: $.x1, x2, s1: Math.sqrt($.v1), s2: Math.sqrt($.v2), n1: $.n1, n2: $.n2, side: $.side });
      return { x2, ...r, dec: decide(r.p, $.alpha) };
    },
    valid: clear,
    text: (T, $) => `Pain thresholds to electric shock: males n₁ = ${$.n1}, x̄₁ = ${$.x1}, s₁² = ${$.v1}; females n₂ = ${$.n2}, x̄₂ = ${$.x2}, s₂² = ${$.v2}. The thresholds are normal and independent, with equal variances assumed. At α = ${$.alpha}, is the mean threshold for men ${REL[$.side]} that for women?`,
    parts: [num('sp2', ($) => $.sp2, { label: String.raw`$s_p^2$`, tol: 0.002 }), statPart('t', ($) => $.t, '$t_0$'), pPart(($) => $.p), decisionPart()],
    hints: [String.raw`$s_p^2 = \dfrac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$`, String.raw`$t_0 = \dfrac{\bar x_1 - \bar x_2 - \Delta_0}{\sqrt{s_p^2\left(\frac1{n_1} + \frac1{n_2}\right)}}$ with $\nu = n_1 + n_2 - 2$.`, 'TI-84: STAT → TESTS → 4:2-SampTTest, Pooled: Yes.'],
    steps: ($) => {
      const [h0, h1] = hyp(String.raw`\mu_1 - \mu_2`, '0', $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        String.raw`$$s_p^2 = \dfrac{${$.n1 - 1}(${$.v1}) + ${$.n2 - 1}(${$.v2})}{${$.n1} + ${$.n2} - 2} = ${fx($.sp2, 4)}$$`,
        String.raw`$$t_0 = \dfrac{${$.x1} - ${$.x2}}{\sqrt{${fx($.sp2, 4)}\left(\frac{1}{${$.n1}} + \frac{1}{${$.n2}}\right)}} = ${fx($.t, 4)}, \qquad \nu = ${$.df}$$`,
        String.raw`p-value $= ${pTex($.side, 'T', $.t, $.df)} = ${fx($.p, 4)}$`,
        ...conclude($, `the mean threshold for men is ${REL[$.side]} that for women`),
      ];
    },
    twin: { part: 'p', n: 20000, draw: (r, $) => { const tt = r.t($.df); return $.side === 'right' ? tt >= $.t : $.side === 'left' ? tt <= $.t : Math.abs(tt) >= Math.abs($.t); } },
    cases: [kase('Notes Ex 9.11', { n1: 13, n2: 10, x1: 16.2, gap: 1.3, v1: 12.7, v2: 26.4, side: 'two', alpha: 0.05 }, { sp2: 18.57, t: 0.72, p: 0.4812, dec: 'fail' })],
  }),

  problem({
    ...C9, id: 'c9.pooled-t-interval', title: 'Pooled two-sample t-interval', kind: 'numeric', level: 3, topics: ['two-sample', 'confidence-interval', 'pooled'], src: 'Notes Ex 9.12',
    vars: { n1: range(6, 25, 1), n2: range(6, 25, 1), x1: range(10, 20, 0.1), gap: range(-5, 5, 0.1), v1: range(8, 30, 0.1), v2: range(8, 30, 0.1), conf: CONF },
    derive: ($) => {
      const x2 = Number(($.x1 - $.gap).toFixed(1));
      const r = pooledInterval({ x1: $.x1, x2, s1: Math.sqrt($.v1), s2: Math.sqrt($.v2), n1: $.n1, n2: $.n2, conf: $.conf });
      const look = tLook(r.alpha / 2, r.df);
      const d = $.x1 - x2;
      return { x2, ...r, d, look, los: look.values.map((t) => d - t * r.se), his: look.values.map((t) => d + t * r.se) };
    },
    text: (T, $) => `Pain thresholds: males n₁ = ${$.n1}, x̄₁ = ${$.x1}, s₁² = ${$.v1}; females n₂ = ${$.n2}, x̄₂ = ${$.x2}, s₂² = ${$.v2}. Normal, independent, equal variances assumed. Find a ${confLabel($.conf)} confidence interval for μ₁ − μ₂.`,
    parts: [endpoint('lo', ($) => $.lo, { alt: ($) => $.los, margin: ($) => $.E }), endpoint('hi', ($) => $.hi, { alt: ($) => $.his, margin: ($) => $.E })],
    hints: [String.raw`$(\bar x_1 - \bar x_2) \pm t_{\alpha/2,\,n_1+n_2-2}\sqrt{s_p^2\left(\frac1{n_1} + \frac1{n_2}\right)}$`, 'TI-84: STAT → TESTS → 0:2-SampTInt, Pooled: Yes.'],
    steps: ($) => [
      String.raw`$s_p^2 = ${fx($.sp2, 4)}$, $\nu = ${$.df}$`,
      $.look.line,
      String.raw`$$E = ${fx($.look.value, 3)}\sqrt{${fx($.sp2, 4)}\left(\frac{1}{${$.n1}} + \frac{1}{${$.n2}}\right)} = ${fx($.look.value * $.se, 4)}$$`,
      String.raw`$$(${fx($.d, 2)} \mp ${fx($.look.value * $.se, 4)}) = (${fx($.d - $.look.value * $.se, 4)},\ ${fx($.d + $.look.value * $.se, 4)})$$`,
    ],
    cases: [kase('Notes Ex 9.12', { n1: 13, n2: 10, x1: 16.2, gap: 1.3, v1: 12.7, v2: 26.4, conf: 0.95 }, { lo: -2.47, hi: 5.07 })],
  }),

  problem({
    ...C9, id: 'c9.welch-t-test', title: 'Two-sample t-test, unequal variances', kind: 'numeric', level: 3, topics: ['two-sample', 't-test', 'welch'], src: 'Notes Ex 9.13',
    vars: {
      n1: range(6, 12, 1), n2: range(6, 12, 1), side: SIDE, alpha: ALPHA, gap: range(-2, 2, 0.1),
      xy: data((rand, v) => twoSamples(rand, { n1: v.n1, n2: v.n2, m1: 40, m2: 40 - v.gap * 8, s1: 6, s2: 12, dp: 0 }).map((a) => a.map((x) => Math.max(1, x))), (v) => `${v[0].join(', ')} | ${v[1].join(', ')}`),
    },
    derive: ($) => {
      const [a, b] = $.xy;
      const r = welchTest({ x1: mean(a), x2: mean(b), s1: sd(a), s2: sd(b), n1: a.length, n2: b.length, side: $.side });
      return { a, b, x1: mean(a), x2: mean(b), s1: sd(a), s2: sd(b), ...r, dec: decide(r.p, $.alpha) };
    },
    valid: ($) => clear($) && $.s1 > 0 && $.s2 > 0,
    text: (T, $) => `Arsenic concentration (ppb) in ${$.a.length} metropolitan Phoenix communities: ${$.a.join(', ')}. In ${$.b.length} rural Arizona communities: ${$.b.join(', ')}. The populations are normal and independent, and the variances are not assumed equal. At α = ${$.alpha}, is the metro mean ${REL[$.side]} the rural mean?`,
    parts: [num('df', ($) => $.df, { label: 'Degrees of freedom ν (the TI-84 keeps decimals; rounded down is fine)', tol: 0, abs: 0.02, alt: ($) => [Math.floor($.df)], altGap: () => 1 }), statPart('t', ($) => $.t, '$t_0$'), pPart(($) => $.p), decisionPart()],
    hints: [String.raw`$t_0 = \dfrac{\bar x_1 - \bar x_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}}$`, String.raw`$\nu = \dfrac{\left(s_1^2/n_1 + s_2^2/n_2\right)^2}{\frac{(s_1^2/n_1)^2}{n_1 - 1} + \frac{(s_2^2/n_2)^2}{n_2 - 1}}$ (the TI-84 keeps the decimals).`, 'TI-84: data in L1 and L2, STAT → TESTS → 4:2-SampTTest, Pooled: No.'],
    steps: ($) => {
      const [h0, h1] = hyp(String.raw`\mu_1 - \mu_2`, '0', $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        String.raw`$\bar x_1 = ${fx($.x1, 3)}$, $s_1 = ${fx($.s1, 3)}$; $\bar x_2 = ${fx($.x2, 3)}$, $s_2 = ${fx($.s2, 3)}$`,
        String.raw`$$t_0 = \dfrac{${fx($.x1, 3)} - ${fx($.x2, 3)}}{\sqrt{\frac{${fx($.s1, 3)}^2}{${$.a.length}} + \frac{${fx($.s2, 3)}^2}{${$.b.length}}}} = ${fx($.t, 4)}, \qquad \nu = ${fx($.df, 2)}$$`,
        String.raw`p-value $= ${pTex($.side, 'T', $.t, $.df)} = ${fx($.p, 4)}$`,
        ...conclude($, `the metro mean is ${REL[$.side]} the rural mean`),
      ];
    },
    cases: [kase('Notes Ex 9.13', { n1: 10, n2: 8, side: 'two', alpha: 0.1, gap: 0, xy: [[3, 7, 25, 10, 15, 6, 12, 25, 15, 7], [78, 44, 40, 38, 33, 12, 1, 18]] }, { df: 8.17, t: -2.36, p: 0.0455, dec: 'reject' })],
  }),

  problem({
    ...C9, id: 'c9.welch-t-interval', title: 'Two-sample t-interval, unequal variances', kind: 'numeric', level: 3, topics: ['two-sample', 'confidence-interval', 'welch'], src: 'Notes Ex 9.14',
    vars: {
      n1: range(6, 12, 1), n2: range(6, 12, 1), conf: CONF, gap: range(-2, 2, 0.1),
      xy: data((rand, v) => twoSamples(rand, { n1: v.n1, n2: v.n2, m1: 40, m2: 40 - v.gap * 8, s1: 6, s2: 12, dp: 0 }).map((a) => a.map((x) => Math.max(1, x))), (v) => `${v[0].join(', ')} | ${v[1].join(', ')}`),
    },
    derive: ($) => {
      const [a, b] = $.xy;
      const x1 = mean(a);
      const x2 = mean(b);
      const r = welchInterval({ x1, x2, s1: sd(a), s2: sd(b), n1: a.length, n2: b.length, conf: $.conf });
      const look = tLook(r.alpha / 2, Math.floor(r.df));
      const d = x1 - x2;
      return { a, b, x1, x2, d, ...r, look, los: look.values.map((t) => d - t * r.se), his: look.values.map((t) => d + t * r.se) };
    },
    text: (T, $) => `Arsenic concentration (ppb) in metropolitan communities: ${$.a.join(', ')}. In rural communities: ${$.b.join(', ')}. Normal, independent, variances not assumed equal. Find a ${confLabel($.conf)} confidence interval for μ₁ − μ₂.`,
    parts: [endpoint('lo', ($) => $.lo, { alt: ($) => $.los, margin: ($) => $.E, altGap: ($) => 0.12 * $.E }), endpoint('hi', ($) => $.hi, { alt: ($) => $.his, margin: ($) => $.E, altGap: ($) => 0.12 * $.E })],
    hints: [String.raw`$(\bar x_1 - \bar x_2) \pm t_{\alpha/2,\nu}\sqrt{s_1^2/n_1 + s_2^2/n_2}$ with Welch's ν.`, 'With the table, round ν down; the TI-84 (0:2-SampTInt, Pooled: No) uses the exact ν.'],
    steps: ($) => [
      String.raw`$\bar x_1 - \bar x_2 = ${fx($.d, 3)}$, $\sqrt{s_1^2/n_1 + s_2^2/n_2} = ${fx($.se, 4)}$, $\nu = ${fx($.df, 2)}$`,
      $.look.line.replace('Table A.4', `Rounding ν down to ${Math.floor($.df)}, Table A.4`),
      String.raw`$$(${fx($.d, 3)} \mp ${fx($.look.value, 3)} \times ${fx($.se, 4)}) = (${fx($.d - $.look.value * $.se, 3)},\ ${fx($.d + $.look.value * $.se, 3)})$$`,
      `TI-84 with the exact ν: (${fx($.lo, 3)}, ${fx($.hi, 3)}).`,
    ],
    cases: [kase('Notes Ex 9.14', { n1: 10, n2: 8, conf: 0.9, gap: 0, xy: [[3, 7, 25, 10, 15, 6, 12, 25, 15, 7], [78, 44, 40, 38, 33, 12, 1, 18]] }, { lo: -36.63, hi: -4.37 })],
  }),

  // ----------------------------------------------------------------- paired
  problem({
    ...C9, id: 'c9.paired-t-test', title: 'Paired t-test', kind: 'numeric', level: 3, topics: ['paired', 't-test'], src: 'Notes Ex 9.15–9.16',
    vars: {
      n: range(6, 12, 1), side: SIDE, alpha: ALPHA, shift: range(-0.4, 0.4, 0.02),
      xy: data((rand, v) => {
        const r = createRng(Math.floor(rand() * 2 ** 31));
        const b = Array.from({ length: v.n }, () => Number(r.normal(1.1, 0.06).toFixed(3)));
        const a = b.map((x) => Number((x + v.shift + r.normal(0, 0.2)).toFixed(3)));
        return [a, b];
      }, (v) => `${v[0].join(', ')} | ${v[1].join(', ')}`),
    },
    derive: ($) => {
      const [a, b] = $.xy;
      const r = pairedTest({ xs: a, ys: b, side: $.side });
      return { a, b, ...r, dec: decide(r.p, $.alpha) };
    },
    valid: ($) => clear($) && $.sd > 0,
    text: (T, $) => `Two methods of producing metal bars are compared on ${$.n} randomly chosen machines. Strengths with method 1: ${$.a.join(', ')}. With method 2, on the same machines in the same order: ${$.b.join(', ')}. The differences are normal. At α = ${$.alpha}, is the mean difference (method 1 − method 2) ${REL[$.side]} 0?`,
    parts: [num('dbar', ($) => $.dbar, { label: String.raw`$\bar d$`, tol: 0.002, abs: 0.0006 }), num('sd', ($) => $.sd, { label: '$s_d$', tol: 0.003 }), statPart('t', ($) => $.t, '$t_0$', { traps: [[($) => ($.dbar) / Math.sqrt(variance($.a) / $.n + variance($.b) / $.n), 'That treats the samples as independent. They are paired: work with the differences.']] }), pPart(($) => $.p), decisionPart()],
    hints: ['The samples are paired (same machine), so compute each difference d = method 1 − method 2.', String.raw`$t_0 = \dfrac{\bar d - \Delta_0}{s_d/\sqrt n}$ with $\nu = n - 1$.`, 'TI-84: L3 = L1 − L2, then STAT → TESTS → 2:T-Test on L3.'],
    steps: ($) => {
      const [h0, h1] = hyp(String.raw`\mu_d`, '0', $.side);
      return [
        String.raw`$${h0}$ versus $${h1}$`,
        `Differences: ${$.d.map((x) => x.toFixed(3)).join(', ')}`,
        String.raw`$\bar d = ${fx($.dbar, 4)}$, $s_d = ${fx($.sd, 4)}$`,
        String.raw`$$t_0 = \dfrac{${fx($.dbar, 4)}}{${fx($.sd, 4)}/\sqrt{${$.n}}} = ${fx($.t, 4)}, \qquad \nu = ${$.df}$$`,
        String.raw`p-value $= ${pTex($.side, 'T', $.t, $.df)} = ${fx($.p, 4)}$`,
        ...conclude($, `the mean difference is ${REL[$.side]} 0`),
      ];
    },
    cases: [
      kase('Notes Ex 9.15', { n: 9, side: 'two', alpha: 0.01, shift: 0, xy: [[1.186, 0.992, 1.322, 1.339, 1.065, 1.402, 1.365, 1.537, 1.559], [1.061, 1.151, 1.063, 1.062, 1.2, 1.178, 1.037, 1.086, 1.052]] }, { dbar: 0.2086, sd: 0.2318, t: 2.7, p: 0.0271, dec: 'fail' }, { key: 'From the notes’ difference column: d̄ = 0.2152, t₀ = 2.75, p = 0.0251', note: 'The notes’ difference column has a slip: machine 4 is listed as 0.337, but 1.339 − 1.062 = 0.277. The TI-84 (L3 = L1 − L2) uses the columns, which give d̄ = 0.2086, t₀ = 2.70 and p = 0.0271; the decision at α = 0.01 is the same. (The calculator steps for this example also mention the dominant hand; that wording belongs to Ex 9.16.)' }),
      kase('Notes Ex 9.16 (reaction times: dominant − non-dominant hand)', { n: 12, side: 'left', alpha: 0.05, shift: 0, xy: [[0.177, 0.21, 0.186, 0.189, 0.198, 0.194, 0.16, 0.163, 0.166, 0.152, 0.19, 0.172], [0.179, 0.202, 0.208, 0.184, 0.215, 0.193, 0.194, 0.16, 0.209, 0.164, 0.21, 0.197]] }, { dbar: -0.0132, sd: 0.0164, t: -2.78, p: 0.009, dec: 'reject' }),
    ],
  }),

  problem({
    ...C9, id: 'c9.paired-t-interval', title: 'Paired t-interval', kind: 'numeric', level: 3, topics: ['paired', 'confidence-interval'], src: 'Notes Ex 9.17',
    vars: {
      n: range(6, 12, 1), conf: CONF, shift: range(-0.4, 0.4, 0.02),
      xy: data((rand, v) => {
        const r = createRng(Math.floor(rand() * 2 ** 31));
        const b = Array.from({ length: v.n }, () => Number(r.normal(1.1, 0.06).toFixed(3)));
        const a = b.map((x) => Number((x + v.shift + r.normal(0, 0.2)).toFixed(3)));
        return [a, b];
      }, (v) => `${v[0].join(', ')} | ${v[1].join(', ')}`),
    },
    derive: ($) => {
      const [a, b] = $.xy;
      const r = pairedInterval({ xs: a, ys: b, conf: $.conf });
      const look = tLook(r.alpha / 2, r.df);
      const se = r.sd / Math.sqrt(r.n);
      return { a, b, ...r, look, los: look.values.map((t) => r.dbar - t * se), his: look.values.map((t) => r.dbar + t * se) };
    },
    text: (T, $) => `Method 1 strengths: ${$.a.join(', ')}. Method 2, same machines in the same order: ${$.b.join(', ')}. The differences are normal. Find a ${confLabel($.conf)} confidence interval for the mean difference μ_d (method 1 − method 2).`,
    parts: [endpoint('lo', ($) => $.lo, { alt: ($) => $.los, margin: ($) => $.E }), endpoint('hi', ($) => $.hi, { alt: ($) => $.his, margin: ($) => $.E })],
    hints: [String.raw`$\bar d \pm t_{\alpha/2,\,n-1}\dfrac{s_d}{\sqrt n}$`, 'TI-84: L3 = L1 − L2, then STAT → TESTS → 8:TInterval on L3.'],
    steps: ($) => [
      String.raw`$\bar d = ${fx($.dbar, 4)}$, $s_d = ${fx($.sd, 4)}$, $n = ${$.n}$`,
      $.look.line,
      String.raw`$$${fx($.dbar, 4)} \pm ${fx($.look.value, 3)}\cdot\dfrac{${fx($.sd, 4)}}{\sqrt{${$.n}}} = (${fx($.dbar - ($.look.value * $.sd) / Math.sqrt($.n), 4)},\ ${fx($.dbar + ($.look.value * $.sd) / Math.sqrt($.n), 4)})$$`,
      $.lo < 0 && $.hi > 0 ? 'The interval contains 0: no significant difference at this level.' : 'The interval does not contain 0: the methods differ.',
    ],
    cases: [kase('Notes Ex 9.17', { n: 9, conf: 0.99, shift: 0, xy: [[1.186, 0.992, 1.322, 1.339, 1.065, 1.402, 1.365, 1.537, 1.559], [1.061, 1.151, 1.063, 1.062, 1.2, 1.178, 1.037, 1.086, 1.052]] }, { lo: -0.0507, hi: 0.4678 }, { note: 'Computed from the method columns. The notes’ difference column lists machine 4 as 0.337; it is 1.339 − 1.062 = 0.277. With that slip the interval would be (−0.047, 0.478).' })],
  }),

  // ----------------------------------------------------------------- choosing
  problem({
    ...C9, id: 'c9.which-test', title: 'Which procedure?', kind: 'conceptual', level: 2, topics: ['test-selection'], src: 'Notes Ch 8–9',
    vars: {
      s: choice(
        ['z1', 'A random sample of 50 sandwiches is weighed. The population standard deviation is known to be 18 mg. Is the mean sodium content above 920 mg?'],
        ['t1', 'A random sample of 12 songs is timed. Is the mean song length different from 240 seconds? (σ unknown, lengths normal)'],
        ['p1', 'Of 200 devices, 4 are defective. Is the defective rate below 5%?'],
        ['p2', '253 of 300 lenses with solution 1 and 246 of 300 with solution 2 have no defects. Do the solutions differ?'],
        ['z2', 'Two fuel formulas with known variances 1.5 and 1.2 are compared with samples of 15 and 20. Do their mean octane numbers differ?'],
        ['f', 'Do metropolitan and rural communities have the same variance in arsenic levels? (normal populations)'],
        ['tp', 'Pain thresholds of 13 men and 10 women are compared; the variances are assumed equal. Do the means differ?'],
        ['tw', 'Arsenic levels in 10 metro and 8 rural communities are compared; an F-test shows the variances differ. Do the means differ?'],
        ['pd', 'Each of 12 students is timed with the dominant hand and with the other hand. Is the dominant hand faster?'],
      ),
    },
    derive: ($) => ({ key: $.s }),
    text: (T) => T.s,
    parts: [
      mc('k', [
        ['z1', 'One-sample z-test'],
        ['t1', 'One-sample t-test'],
        ['p1', 'One-proportion z-test'],
        ['p2', 'Two-proportion z-test'],
        ['z2', 'Two-sample z-test'],
        ['f', 'Two-sample F-test'],
        ['tp', 'Two-sample t-test, pooled'],
        ['tw', 'Two-sample t-test, unpooled (Welch)'],
        ['pd', 'Paired t-test'],
      ], ($) => $.key),
    ],
    hints: ['Mean, proportion or variance? One sample or two?', 'For two means: are the samples paired? If not, are the σ’s known? If not, are the variances equal?'],
    steps: ($) =>
      [
        {
          z1: 'One mean, σ known, n ≥ 30: one-sample z-test.',
          t1: 'One mean, σ unknown, normal population: one-sample t-test with ν = n − 1.',
          p1: 'One proportion: one-proportion z-test. Check np₀(1 − p₀) ≥ 10: here it is 200(0.05)(0.95) = 9.5, just short, so the normal approximation is borderline (the notes run the test anyway, Ex 8.14).',
          p2: 'Two proportions from independent samples: two-proportion z-test with the pooled p̂.',
          z2: 'Two means, independent samples, variances known: two-sample z-test.',
          f: 'Comparing two variances: F-test with f₀ = s₁²/s₂².',
          tp: 'Two means, independent, σ’s unknown but assumed equal: pooled t-test with ν = n₁ + n₂ − 2.',
          tw: 'Two means, independent, σ’s unknown and unequal: unpooled (Welch) t-test.',
          pd: 'The same students are measured twice: paired samples. Take differences and use a paired t-test.',
        }[$.key],
      ],
    cases: [kase('Notes Ex 9.16', { s: 'pd' }, { k: 'pd' })],
  }),
];
