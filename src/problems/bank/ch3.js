/** Chapter 3 · Random variables and probability distributions. */
import { problem, kase, range, choice, data, num, prob, mc, tn, fx } from '../kit.js';

const C3 = { ch: '3' };

/** k + 1 probabilities in steps of 0.05, each at least 0.05, summing to 1. */
function pmfOf(rand, k) {
  for (;;) {
    const cuts = Array.from({ length: k }, () => 1 + Math.floor(rand() * 19)).sort((a, b) => a - b);
    const parts = [cuts[0], ...cuts.slice(1).map((c, i) => c - cuts[i]), 20 - cuts[k - 1]];
    if (parts.every((p) => p >= 1)) return parts.map((p) => p / 20);
  }
}

const pmfTable = (xs, ps, missing = -1) =>
  `<table class="results" style="max-width:420px"><tbody><tr><th>x</th>${xs.map((x) => `<td>${x}</td>`).join('')}</tr><tr><th>f(x)</th>${ps.map((p, i) => `<td>${i === missing ? '?' : fx(p, 2)}</td>`).join('')}</tr></tbody></table>`;

export default [
  problem({
    ...C3, id: 'c3.discrete-continuous', title: 'Discrete or continuous?', kind: 'conceptual', topics: ['random-variable'], src: 'Walpole §3.1',
    vars: {
      s: choice(
        ['d1', 'X = the number of heads in 10 tosses of a coin'],
        ['d2', 'X = the number of defective items in a batch of 50'],
        ['d3', 'X = the number of customers who arrive in an hour'],
        ['d4', 'X = the number of rolls of a die until the first six'],
        ['c1', 'X = the time until a light bulb burns out'],
        ['c2', 'X = the weight of a randomly chosen apple'],
        ['c3', 'X = the distance a car travels on one tank of gas'],
        ['c4', 'X = the amount of rain in a day'],
      ),
    },
    derive: ($) => ({ kind: $.s[0] }),
    text: (T) => `${T.s}. Is X a discrete or a continuous random variable?`,
    parts: [mc('k', [['d', 'Discrete: its values can be counted'], ['c', 'Continuous: it can take any value in an interval']], ($) => $.kind)],
    hints: ['A discrete random variable takes a countable set of values (often counts: 0, 1, 2, …). A continuous one takes any value in an interval (measurements).', 'Is X a count or a measurement?'],
    steps: ($) => [$.kind === 'd' ? 'X counts something, so its values are 0, 1, 2, …: a countable set. X is discrete.' : 'X is a measurement: between any two possible values there is another. X is continuous.'],
    cases: [kase('Walpole §3.1', { s: 'd4' }, { k: 'd' })],
  }),

  problem({
    ...C3, id: 'c3.pmf-table', title: 'A probability mass function', kind: 'numeric', topics: ['pmf'], src: 'Walpole §3.2',
    vars: { k: range(3, 4, 1), m: range(0, 4, 1), j: range(1, 4, 1), ps: data((r, v) => pmfOf(r, v.k)) },
    derive: ($) => {
      const xs = Array.from({ length: $.k + 1 }, (_, i) => i);
      return { xs, missing: $.ps[$.m], ge: $.ps.slice($.j).reduce((a, b) => a + b, 0) };
    },
    valid: ($) => $.m <= $.k && $.j <= $.k,
    text: () => 'X is the number of cars a household owns. Its probability distribution is below, with one value missing.',
    figure: ($) => pmfTable($.xs, $.ps, $.m),
    parts: [
      prob('missing', ($) => $.missing, { label: ($T, $) => `$f(${$.m})$` }),
      prob('ge', ($) => $.ge, { label: ($T, $) => String.raw`$P(X \ge ${$.j})$`, traps: [[($) => $.ps.slice($.j + 1).reduce((a, b) => a + b, 0), String.raw`That leaves out $x = j$ itself. "At least" includes it.`]] }),
    ],
    hints: [String.raw`The probabilities of a pmf add to 1: $\sum f(x) = 1$.`, 'P(X ≥ j) adds f(x) for every x from j up.'],
    steps: ($) => [
      String.raw`$f(${$.m}) = 1 - (${$.ps.filter((_, i) => i !== $.m).map((p) => fx(p, 2)).join(' + ')}) = ${fx($.missing, 2)}$`,
      String.raw`$P(X \ge ${$.j}) = ${$.ps.slice($.j).map((p) => fx(p, 2)).join(' + ')} = ${fx($.ge, 2)}$`,
    ],
    cases: [],
  }),

  problem({
    ...C3, id: 'c3.pmf-constant', title: 'Finding the constant in a pmf', kind: 'numeric', topics: ['pmf'], src: 'Walpole §3.2 (exercises)',
    vars: { form: choice(['lin', 'x + k'], ['sq', 'x² + k']), k: range(1, 6, 1), m: range(2, 4, 1), j: range(0, 3, 1) },
    derive: ($) => {
      const g = (x) => ($.form === 'lin' ? x + $.k : x * x + $.k);
      const xs = Array.from({ length: $.m + 1 }, (_, i) => i);
      const S = xs.reduce((a, x) => a + g(x), 0);
      const le = xs.filter((x) => x <= $.j).reduce((a, x) => a + g(x), 0) / S;
      return { xs, S, c: 1 / S, le, terms: xs.map(g) };
    },
    valid: ($) => $.j < $.m,
    text: (T, $) => String.raw`The probability distribution of X is $f(x) = c(${$.form === 'lin' ? `x + ${$.k}` : `x^2 + ${$.k}`})$ for $x = ${$.xs.join(', ')}$. Find c, and then $P(X \le ${$.j})$.`,
    parts: [num('c', ($) => $.c, { label: '$c$', tol: 0.002, traps: [[($) => $.S, 'That is the sum. c is its reciprocal, so that the probabilities add to 1.']] }), prob('le', ($) => $.le, { label: ($T, $) => String.raw`$P(X \le ${$.j})$` })],
    hints: [String.raw`Every pmf sums to 1: $c \sum g(x) = 1$, so $c = 1/\sum g(x)$.`, 'Once you have c, add f(x) for the x values asked for.'],
    steps: ($) => [
      String.raw`$$\sum f(x) = c\,(${$.terms.join(' + ')}) = ${$.S}c = 1 \;\Rightarrow\; c = \dfrac{1}{${$.S}} = ${tn($.c)}$$`,
      String.raw`$$P(X \le ${$.j}) = \dfrac{${$.terms.slice(0, $.j + 1).join(' + ')}}{${$.S}} = ${fx($.le, 4)}$$`,
    ],
    cases: [kase('Walpole §3.2 (exercise)', { form: 'sq', k: 4, m: 3, j: 1 }, { c: 1 / 30, le: 0.3 })],
  }),

  problem({
    ...C3, id: 'c3.pdf-constant', title: 'A probability density function', kind: 'numeric', level: 2, topics: ['pdf'], src: 'Walpole §3.3',
    vars: { k: range(1, 3, 1), b: range(1, 4, 1), a: range(0.1, 0.9, 0.1) },
    derive: ($) => {
      const c = ($.k + 1) / $.b ** ($.k + 1);
      const x = Number(($.a * $.b).toFixed(2));
      return { c, x, p: (x / $.b) ** ($.k + 1) };
    },
    text: (T, $) => String.raw`A continuous random variable X has density $f(x) = c\,x^{${$.k}}$ for $0 < x < ${$.b}$, and 0 elsewhere. Find c and $P(X < ${$.x})$.`,
    parts: [num('c', ($) => $.c, { label: '$c$', tol: 0.002 }), prob('p', ($) => $.p, { label: ($T, $) => String.raw`$P(X < ${$.x})$`, traps: [[($) => $.c * $.x ** $.k, String.raw`That is $f(${'x'})$, a height. A probability for a continuous variable is an area: integrate.`]] })],
    hints: [String.raw`The total area is 1: $\int_0^{b} c\,x^k\,dx = 1$.`, String.raw`$\int_0^{b} x^k\,dx = \dfrac{b^{k+1}}{k+1}$`, 'Then P(X < a) is the area from 0 to a.'],
    steps: ($) => [
      String.raw`$$\int_0^{${$.b}} c\,x^{${$.k}}\,dx = c\,\dfrac{${$.b}^{${$.k + 1}}}{${$.k + 1}} = 1 \;\Rightarrow\; c = \dfrac{${$.k + 1}}{${$.b ** ($.k + 1)}} = ${tn($.c)}$$`,
      String.raw`$$P(X < ${$.x}) = \int_0^{${$.x}} ${tn($.c)}\,x^{${$.k}}\,dx = \left(\dfrac{${$.x}}{${$.b}}\right)^{${$.k + 1}} = ${fx($.p, 4)}$$`,
    ],
    cases: [],
  }),

  problem({
    ...C3, id: 'c3.cdf', title: 'Probabilities from a cumulative distribution', kind: 'numeric', topics: ['cdf'], src: 'Walpole §3.3',
    vars: { beta: choice([2, '2'], [4, '4'], [5, '5'], [10, '10'], [20, '20']), a: range(0.2, 1.5, 0.1), w: range(0.3, 1.5, 0.1) },
    derive: ($) => {
      const x1 = Number(($.a * $.beta).toFixed(1));
      const x2 = Number((($.a + $.w) * $.beta).toFixed(1));
      const F = (x) => 1 - Math.exp(-x / $.beta);
      return { x1, x2, gt: 1 - F(x1), mid: F(x2) - F(x1) };
    },
    text: (T, $) => String.raw`The time X (in hours) until a component fails has cumulative distribution function $F(x) = 1 - e^{-x/${$.beta}}$ for $x > 0$. Find $P(X > ${$.x1})$ and $P(${$.x1} < X \le ${$.x2})$.`,
    parts: [
      prob('gt', ($) => $.gt, { label: ($T, $) => String.raw`$P(X > ${$.x1})$`, traps: [[($) => 1 - $.gt, String.raw`That is $F(${'x'}) = P(X \le x)$. More than x is $1 - F(x)$.`]] }),
      prob('mid', ($) => $.mid, { label: ($T, $) => String.raw`$P(${$.x1} < X \le ${$.x2})$` }),
    ],
    hints: [String.raw`$F(x) = P(X \le x)$.`, String.raw`$P(X > a) = 1 - F(a)$ and $P(a < X \le b) = F(b) - F(a)$.`],
    steps: ($) => [
      String.raw`$$P(X > ${$.x1}) = 1 - F(${$.x1}) = e^{-${$.x1}/${$.beta}} = ${fx($.gt, 4)}$$`,
      String.raw`$$P(${$.x1} < X \le ${$.x2}) = F(${$.x2}) - F(${$.x1}) = e^{-${$.x1}/${$.beta}} - e^{-${$.x2}/${$.beta}} = ${fx($.mid, 4)}$$`,
    ],
    twin: { part: 'mid', draw: (r, $) => { const x = r.exponential($.beta); return x > $.x1 && x <= $.x2; } },
    cases: [],
  }),
];
