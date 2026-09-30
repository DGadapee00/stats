/** Chapter 4 · Mathematical expectation. */
import { problem, kase, range, choice, data, num, tn, fx, pn } from '../kit.js';

const C4 = { ch: '4' };

function pmfOf(rand, k) {
  for (;;) {
    const cuts = Array.from({ length: k }, () => 1 + Math.floor(rand() * 19)).sort((a, b) => a - b);
    const parts = [cuts[0], ...cuts.slice(1).map((c, i) => c - cuts[i]), 20 - cuts[k - 1]];
    if (parts.every((p) => p >= 1)) return parts.map((p) => p / 20);
  }
}

const pmfTable = (xs, ps) =>
  `<table class="results" style="max-width:420px"><tbody><tr><th>x</th>${xs.map((x) => `<td>${x}</td>`).join('')}</tr><tr><th>f(x)</th>${ps.map((p) => `<td>${fx(p, 2)}</td>`).join('')}</tr></tbody></table>`;

export default [
  problem({
    ...C4, id: 'c4.mean-variance-pmf', title: 'Mean and variance from a distribution', kind: 'numeric', topics: ['expectation', 'variance'], src: 'Walpole §4.1–4.2',
    vars: { k: range(3, 4, 1), shift: range(0, 2, 1), ps: data((r, v) => pmfOf(r, v.k)) },
    derive: ($) => {
      const xs = $.ps.map((_, i) => i + $.shift);
      const mu = xs.reduce((a, x, i) => a + x * $.ps[i], 0);
      const ex2 = xs.reduce((a, x, i) => a + x * x * $.ps[i], 0);
      const v = ex2 - mu * mu;
      return { xs, mu, ex2, v, sd: Math.sqrt(v) };
    },
    valid: ($) => $.v > 0.01,
    text: () => 'The number of defective parts X in a daily sample has the probability distribution below. Find the mean, variance and standard deviation of X.',
    figure: ($) => pmfTable($.xs, $.ps),
    parts: [
      num('mu', ($) => $.mu, { label: String.raw`$\mu = E(X)$` }),
      num('v', ($) => $.v, { label: String.raw`$\sigma^2$`, traps: [[($) => $.ex2, String.raw`That is $E(X^2)$. Subtract $\mu^2$.`]] }),
      num('sd', ($) => $.sd, { label: String.raw`$\sigma$` }),
    ],
    hints: [String.raw`$\mu = \sum x f(x)$`, String.raw`$\sigma^2 = E(X^2) - \mu^2$, with $E(X^2) = \sum x^2 f(x)$.`],
    steps: ($) => [
      String.raw`$$\mu = ${$.xs.map((x, i) => `${x}(${fx($.ps[i], 2)})`).join(' + ')} = ${tn($.mu, 6)}$$`,
      String.raw`$$E(X^2) = ${$.xs.map((x, i) => `${x}^2(${fx($.ps[i], 2)})`).join(' + ')} = ${tn($.ex2, 6)}$$`,
      String.raw`$$\sigma^2 = ${tn($.ex2, 6)} - ${pn($.mu, 6)}^2 = ${tn($.v, 6)}, \qquad \sigma = ${tn($.sd, 4)}$$`,
    ],
    cases: [],
  }),

  problem({
    ...C4, id: 'c4.linear-transform', title: 'Mean and variance of aX + b', kind: 'numeric', topics: ['expectation', 'variance', 'linear-combination'], src: 'Walpole §4.3',
    vars: { mu: range(2, 40, 1), sd: range(1, 8, 0.5), a: range(-4, 6, 1, { exclude: [0, 1] }), b: range(-20, 30, 5) },
    derive: ($) => ({ ey: $.a * $.mu + $.b, vy: $.a * $.a * $.sd * $.sd, sy: Math.abs($.a) * $.sd }),
    text: (T, $) => String.raw`A random variable X has mean ${$.mu} and standard deviation ${$.sd}. Let $Y = ${$.a}X ${$.b < 0 ? '-' : '+'} ${Math.abs($.b)}$. Find the mean, variance and standard deviation of Y.`,
    parts: [
      num('ey', ($) => $.ey, { label: '$E(Y)$' }),
      num('vy', ($) => $.vy, { label: String.raw`$\sigma_Y^2$`, traps: [[($) => $.a * $.sd * $.sd, String.raw`The multiplier is squared: $\sigma^2_{aX+b} = a^2\sigma^2$.`], [($) => $.a * $.a * $.sd * $.sd + $.b, 'Adding a constant shifts every value by the same amount; it does not change the spread.']] }),
      num('sy', ($) => $.sy, { label: String.raw`$\sigma_Y$`, traps: [[($) => $.a * $.sd, 'A standard deviation is never negative: it is |a|σ.']] }),
    ],
    hints: [String.raw`$E(aX + b) = aE(X) + b$`, String.raw`$\sigma^2_{aX+b} = a^2\sigma_X^2$: the constant b drops out.`],
    steps: ($) => [
      String.raw`$E(Y) = ${$.a}(${$.mu}) ${$.b < 0 ? '-' : '+'} ${Math.abs($.b)} = ${$.ey}$`,
      String.raw`$\sigma_Y^2 = ${pn($.a)}^2(${$.sd})^2 = ${tn($.vy, 6)}$`,
      String.raw`$\sigma_Y = |${$.a}|(${$.sd}) = ${tn($.sy, 6)}$`,
    ],
    cases: [],
  }),

  problem({
    ...C4, id: 'c4.linear-combination', title: 'Mean and variance of aX + bY', kind: 'numeric', level: 2, topics: ['linear-combination', 'variance', 'independence'], src: 'Walpole §4.3',
    vars: { mx: range(2, 20, 1), vx: range(1, 16, 1), my: range(2, 20, 1), vy: range(1, 16, 1), a: range(1, 4, 1), b: range(-4, 4, 1, { exclude: [0] }) },
    derive: ($) => ({ m: $.a * $.mx + $.b * $.my, v: $.a * $.a * $.vx + $.b * $.b * $.vy }),
    text: (T, $) => String.raw`X and Y are independent, with $\mu_X = ${$.mx}$, $\sigma_X^2 = ${$.vx}$, $\mu_Y = ${$.my}$ and $\sigma_Y^2 = ${$.vy}$. Let $Z = ${$.a === 1 ? '' : $.a}X ${$.b < 0 ? '-' : '+'} ${Math.abs($.b) === 1 ? '' : Math.abs($.b)}Y$. Find the mean and variance of Z.`,
    parts: [
      num('m', ($) => $.m, { label: '$E(Z)$' }),
      num('v', ($) => $.v, { label: String.raw`$\sigma_Z^2$`, traps: [[($) => $.a * $.a * $.vx - $.b * $.b * $.vy, String.raw`Variances never subtract. For independent X and Y, $\sigma^2_{aX - bY} = a^2\sigma_X^2 + b^2\sigma_Y^2$.`], [($) => $.a * $.vx + $.b * $.vy, 'The coefficients are squared in a variance.']] }),
    ],
    hints: [String.raw`$E(aX + bY) = a\mu_X + b\mu_Y$`, String.raw`For independent X and Y: $\sigma^2_{aX+bY} = a^2\sigma_X^2 + b^2\sigma_Y^2$. The sign of b disappears when it is squared.`],
    steps: ($) => [
      String.raw`$E(Z) = ${$.a}(${$.mx}) + ${pn($.b)}(${$.my}) = ${$.m}$`,
      String.raw`$\sigma_Z^2 = ${$.a}^2(${$.vx}) + ${pn($.b)}^2(${$.vy}) = ${$.v}$`,
      $.b < 0 ? 'Subtracting Y still adds its variance: the difference is spread out by both variables.' : 'Both variables add their spread.',
    ],
    twin: { part: 'v', n: 60000, draw: (r, $) => { const z = $.a * r.normal($.mx, Math.sqrt($.vx)) + $.b * r.normal($.my, Math.sqrt($.vy)); return (z - $.m) ** 2; } },
    cases: [],
  }),

  problem({
    ...C4, id: 'c4.pdf-mean', title: 'Mean and variance from a density', kind: 'numeric', level: 2, topics: ['expectation', 'variance', 'pdf'], src: 'Walpole §4.1–4.2',
    vars: { k: range(1, 4, 1) },
    derive: ($) => {
      const mu = ($.k + 1) / ($.k + 2);
      const ex2 = ($.k + 1) / ($.k + 3);
      return { mu, ex2, v: ex2 - mu * mu };
    },
    text: (T, $) => String.raw`X has density $f(x) = ${$.k + 1}x^{${$.k}}$ for $0 < x < 1$, and 0 elsewhere. Find $E(X)$ and $\sigma^2$.`,
    parts: [num('mu', ($) => $.mu, { label: '$E(X)$' }), num('v', ($) => $.v, { label: String.raw`$\sigma^2$`, traps: [[($) => $.ex2, String.raw`That is $E(X^2)$. Subtract $\mu^2$.`]] })],
    hints: [String.raw`$E(X) = \int x f(x)\,dx$`, String.raw`$\sigma^2 = E(X^2) - \mu^2$, with $E(X^2) = \int x^2 f(x)\,dx$.`],
    steps: ($) => [
      String.raw`$$E(X) = \int_0^1 x\cdot ${$.k + 1}x^{${$.k}}\,dx = \dfrac{${$.k + 1}}{${$.k + 2}} = ${tn($.mu)}$$`,
      String.raw`$$E(X^2) = \int_0^1 x^2 \cdot ${$.k + 1}x^{${$.k}}\,dx = \dfrac{${$.k + 1}}{${$.k + 3}} = ${tn($.ex2)}$$`,
      String.raw`$$\sigma^2 = ${tn($.ex2)} - (${tn($.mu)})^2 = ${tn($.v)}$$`,
    ],
    twin: { part: 'mu', draw: (r, $) => r.next() ** (1 / ($.k + 1)) },
    cases: [kase('Walpole §4.1', { k: 1 }, { mu: 2 / 3, v: 1 / 18 })],
  }),

  problem({
    ...C4, id: 'c4.expected-value', title: 'Expected profit', kind: 'numeric', topics: ['expectation'], src: 'Walpole §4.1',
    vars: { prem: range(100, 900, 50), pay: range(5000, 50000, 1000), p: range(0.001, 0.03, 0.001) },
    derive: ($) => ({ e: $.prem - $.p * $.pay }),
    text: (T, $) => `An insurance company sells a one-year policy for ${$.prem} dollars. If the insured event happens (probability ${$.p}), the company pays ${$.pay.toLocaleString('en-US')} dollars. What is the company's expected profit on one policy?`,
    parts: [num('e', ($) => $.e, { label: 'Expected profit', unit: 'dollars', tol: 0, abs: 0.5, traps: [[($) => -$.p * $.pay, 'That leaves out the premium, which the company keeps either way.'], [($) => $.prem - $.pay, 'That is the profit if the event happens. Weight each outcome by its probability.']] })],
    hints: [String.raw`$E(X) = \sum x f(x)$ over the outcomes.`, `Profit is the premium if nothing happens, and the premium minus the payout if it does.`],
    steps: ($) => [
      String.raw`Profit $X$: $${$.prem}$ with probability $${fx(1 - $.p, 3)}$, and $${$.prem} - ${$.pay} = ${$.prem - $.pay}$ with probability $${$.p}$.`,
      String.raw`$$E(X) = ${$.prem}(${fx(1 - $.p, 3)}) + (${$.prem - $.pay})(${$.p}) = ${$.prem} - ${$.p}(${$.pay}) = ${tn($.e, 6)}$$`,
    ],
    cases: [],
  }),
];
