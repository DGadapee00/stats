/**
 * Chapter 3, rewritten from the teacher's notes (Ch 3, pp. 41–46). Example numbers are the notes'.
 */
import { binomPmf } from '../stats/dist.js';

/** Simpson's rule, for checking the integrals the notes do by hand. */
const integrate = (f, a, b, n = 2000) => {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
};
const f35 = (x) => (x >= -1 && x <= 2 ? (x * x) / 3 : 0);

export default {
  ch: '3',
  title: 'Random variables and probability distributions',
  sections: [
    {
      id: '3.1',
      title: 'Random variables',
      problems: ['c3.discrete-continuous'],
      blocks: [
        ['def', 'Random variable.', 'A variable whose numerical value is set by the outcome of a random experiment: exactly one number for each sample point. Written with capital letters, $X$, $Y$; a value it takes, with lower case, $x$, $y$.'],
        [
          'ex',
          {
            n: '3.1',
            q: 'Two balls are drawn in succession, without replacement, from an urn with 4 red and 3 black balls. $Y$ is the number of red balls drawn. List its values.',
            data: { head: ['Sample point', '$y$'], rows: [['RR', 2], ['RB', 1], ['BR', 1], ['BB', 0]] },
            a: ['Each sample point gets one value of $Y$: count its reds.'],
            answer: '$Y$ takes the values 0, 1, 2: a discrete random variable.',
            problem: 'c3.discrete-continuous',
            case: 0,
          },
        ],
        [
          'ex',
          {
            n: '3.2',
            q: '$X$ is the waiting time, in hours, between successive speeders spotted by a radar unit. What values can it take?',
            a: ['Any $x \\ge 0$: a time can be any number, not just whole ones.'],
            answer: 'A continuous random variable.',
            problem: 'c3.discrete-continuous',
            case: 1,
          },
        ],
        ['list', ['A **discrete** random variable takes a countable set of separate values, usually whole numbers you can list (counts).', 'A **continuous** random variable takes any value in a range, decimals and fractions included (measurements).']],
      ],
    },
    {
      id: '3.2',
      title: 'Discrete probability distributions',
      lab: 'dist',
      problems: ['c3.build-distribution', 'c3.pmf-table', 'c3.pmf-constant'],
      blocks: [
        ['def', 'Probability mass function (pmf).', String.raw`$f(x) = P(X = x)$, listed for every value $x$. It must satisfy (1) $f(x) \ge 0$ and (2) $\sum_x f(x) = 1$.`],
        [
          'ex',
          {
            n: '3.3',
            q: 'A car agency sells 50% of its inventory of a foreign car with side airbags. Find the probability distribution of $X$, the number of cars with side airbags among the next 4 sold.',
            a: [
              'Each car has airbags with probability 1/2, independently. The number of orders that give $x$ cars with airbags out of 4 is $_4C_x$, and each order has probability $(1/2)^4 = 1/16$.',
              String.raw`$f(0) = \tfrac{1}{16}$, $f(1) = {}_4C_1 \tfrac{1}{16} = \tfrac{4}{16}$, $f(2) = {}_4C_2 \tfrac{1}{16} = \tfrac{6}{16}$, $f(3) = \tfrac{4}{16}$, $f(4) = \tfrac{1}{16}$.`,
              'In one formula: $f(x) = {}_4C_x\,(1/2)^4$ for $x = 0, 1, 2, 3, 4$. (This is the binomial distribution of Chapter 5.)',
            ],
            answer: 'f(x) = 1/16, 4/16, 6/16, 4/16, 1/16 for x = 0, …, 4: symmetric about 2.',
            problem: 'c3.build-distribution',
            case: 0,
            checks: () => [
              ...[1, 4, 6, 4, 1].map((k, x) => [`f(${x})`, binomPmf(x, 4, 0.5), k / 16, 1e-12]),
              ['sum', [0, 1, 2, 3, 4].reduce((t, x) => t + binomPmf(x, 4, 0.5), 0), 1, 1e-12],
            ],
          },
        ],
        ['p', 'Plot a pmf as spikes (a line at each $x$ of height $f(x)$) or as a **probability histogram**: a bar of width 1 centered at each $x$, so each bar’s AREA is its probability.'],
        ['def', 'Cumulative distribution function (CDF).', String.raw`$F(x) = P(X \le x) = \sum_{t \le x} f(t)$, for every real $x$.`],
        ['fix', String.raw`The notes' definition box writes the sum over $t < x$. It must be $t \le x$: $F(x)$ is $P(X \le x)$, which includes $f(x)$ itself (in Ex 3.4, $F(0) = f(0) = 1/16$, not 0).`],
        [
          'ex',
          {
            n: '3.4',
            q: 'Find the CDF of $X$ in Example 3.3.',
            a: [
              String.raw`Add up the pmf: $F(0) = \tfrac{1}{16}$, $F(1) = \tfrac{5}{16}$, $F(2) = \tfrac{11}{16}$, $F(3) = \tfrac{15}{16}$, $F(4) = 1$.`,
              String.raw`Between the values it stays flat: $F(x) = 0$ for $x < 0$; $\tfrac{1}{16}$ for $0 \le x < 1$; $\tfrac{5}{16}$ for $1 \le x < 2$; $\tfrac{11}{16}$ for $2 \le x < 3$; $\tfrac{15}{16}$ for $3 \le x < 4$; $1$ for $x \ge 4$.`,
            ],
            answer: 'A step function: it jumps by f(x) at each value x, and is right-continuous (the filled dot is on the left end of each step).',
            checks: () => {
              let c = 0;
              return [1, 5, 11, 15, 16].map((k, x) => {
                c += binomPmf(x, 4, 0.5);
                return [`F(${x})`, c, k / 16, 1e-12];
              });
            },
          },
        ],
        ['key', 'For a discrete $X$: $P(a < X \\le b) = F(b) - F(a)$. Watch the endpoints: $P(X < 3) = P(X \\le 2) = F(2)$.'],
      ],
    },
    {
      id: '3.3',
      title: 'Continuous probability distributions',
      lab: 'dist',
      problems: ['c3.density-cdf', 'c3.pdf-constant', 'c3.cdf'],
      blocks: [
        ['p', String.raw`For a continuous $X$, any single value has probability 0: there are infinitely many values between 0 and 1, so $P(X = 0.5) = 1/\infty = 0$. Probability lives on intervals instead.`],
        ['def', 'Probability density function (pdf).', String.raw`A function $f(x)$ with (1) $f(x) \ge 0$ for all $x$; (2) $\int_{-\infty}^{\infty} f(x)\,dx = 1$; and (3) $P(a < X < b) = \int_a^b f(x)\,dx$, the area under $f$ between $a$ and $b$.`],
        ['key', 'For a continuous $X$, $P(a < X < b) = P(a \\le X \\le b)$: including an endpoint adds probability 0. (Not so for a discrete $X$.)'],
        [
          'ex',
          {
            n: '3.5',
            q: String.raw`The error $X$ (°C) in the reaction temperature of a lab experiment has density $f(x) = \frac{x^2}{3}$ for $-1 < x < 2$, and 0 elsewhere. (a) Verify that $f$ is a density. (b) Find $P(0 < X \le 1)$.`,
            a: [
              String.raw`(a) $f(x) = x^2/3 \ge 0$ everywhere. And $\int_{-1}^{2} \frac{x^2}{3}\,dx = \frac{x^3}{9}\Big|_{-1}^{2} = \frac{8}{9} - \frac{-1}{9} = 1$. ✓`,
              String.raw`(b) $P(0 < X \le 1) = \int_0^1 \frac{x^2}{3}\,dx = \frac{x^3}{9}\Big|_0^1 = \frac{1}{9}$.`,
            ],
            answer: '(b) 1/9 = 0.1111.',
            problem: 'c3.density-cdf',
            case: 0,
            checks: () => [
              ['total area', integrate(f35, -1, 2), 1, 1e-9],
              ['P(0<X≤1)', integrate(f35, 0, 1), 1 / 9, 1e-9],
            ],
          },
        ],
        ['ti', ['MATH ▸ 9:fnInt(, then fill in the template: lower 0, upper 1, the function X²/3, variable X.', 'ENTER gives 0.1111111111.']],
        ['def', 'CDF of a continuous $X$:', String.raw`$F(x) = P(X \le x) = \int_{-\infty}^{x} f(t)\,dt$. Then $P(a < X < b) = F(b) - F(a)$, and $f(x) = F'(x)$ wherever the derivative exists.`],
        [
          'ex',
          {
            n: '3.6',
            q: 'For the density of Example 3.5, find $F(x)$ and use it to find $P(0 < X \\le 1)$.',
            a: [
              String.raw`For $-1 < x < 2$: $F(x) = \int_{-1}^{x} \frac{t^2}{3}\,dt = \frac{t^3}{9}\Big|_{-1}^{x} = \frac{x^3 + 1}{9}$.`,
              String.raw`So $F(x) = 0$ for $x < -1$; $\frac{x^3 + 1}{9}$ for $-1 \le x < 2$; $1$ for $x \ge 2$.`,
              String.raw`$P(0 < X \le 1) = F(1) - F(0) = \frac{2}{9} - \frac{1}{9} = \frac{1}{9}$, as before.`,
            ],
            checks: () => [
              ['F(1)', integrate(f35, -1, 1), 2 / 9, 1e-9],
              ['F(0)', integrate(f35, -1, 0), 1 / 9, 1e-9],
              ['F(1.5) formula', integrate(f35, -1, 1.5), (1.5 ** 3 + 1) / 9, 1e-9],
            ],
          },
        ],
        ['key', 'Every CDF is non-decreasing, from 0 on the far left to 1 on the far right. A discrete CDF is a step function; a continuous one is a continuous curve.'],
      ],
    },
  ],
};
