/**
 * Chapter 6, rewritten from the teacher's notes (Ch 6, pp. 72–85). The notes pose these examples and
 * leave the working for class; every answer here is computed, by the printed z table (Table A.3) and
 * exactly, as the TI-84 gives it. Example numbers are the notes'.
 */
import { normCdf, normInv } from '../stats/dist.js';
import { zTable as zLook, zForArea as zAreaLook } from '../stats/tables.js';

// The printed-table readings, as numbers: the area for z, and the z for an area.
const zTable = (z) => zLook(z).value;
const zForArea = (a) => zAreaLook(a).z;

const GREYHOUND = [31.35, 32.52, 32.06, 31.26, 31.91, 32.37];

export default {
  ch: '6',
  title: 'Some continuous probability distributions',
  sections: [
    {
      id: '6.1',
      title: 'The continuous uniform distribution',
      lab: 'dist',
      problems: ['c6.uniform-conditional', 'c6.uniform'],
      blocks: [
        ['key', String.raw`$X$ uniform on $[A, B]$: $f(x) = \dfrac{1}{B - A}$ for $A \le x \le B$, and 0 elsewhere. Mean $\mu = \dfrac{A + B}{2}$, variance $\sigma^2 = \dfrac{(B - A)^2}{12}$.`],
        ['p', 'The density is a rectangle of base $B - A$ and height $1/(B - A)$ (area 1), so it is also called the rectangular distribution. A probability is the area of a slice of the rectangle: width × height.'],
        [
          'ex',
          {
            n: '6.1',
            q: 'The yearly height increase $X$ of cedar trees is uniform between 6 and 11 inches. (a) Sketch the density. Find the probability a tree grows (b) between 9 and 10 inches; (c) less than 8 inches; (d) less than 7 inches, given it grows less than 8; (e) exactly 7 inches.',
            a: [
              String.raw`(a) A rectangle over $6 \le x \le 11$ of height $\frac{1}{11 - 6} = \frac{1}{5} = 0.2$.`,
              String.raw`(b) $P(9 < X < 10) = (10 - 9)(0.2) = 0.2$.`,
              String.raw`(c) $P(X < 8) = (8 - 6)(0.2) = 0.4$.`,
              String.raw`(d) $P(X < 7 \mid X < 8) = \dfrac{P(X < 7 \text{ and } X < 8)}{P(X < 8)} = \dfrac{P(X < 7)}{P(X < 8)} = \dfrac{0.2}{0.4} = 0.5$.`,
              String.raw`(e) $P(X = 7) = 0$: a single value has no width.`,
            ],
            answer: '(b) 0.2 (c) 0.4 (d) 0.5 (e) 0. Mean 8.5 inches.',
            problem: 'c6.uniform-conditional',
            case: 0,
            checks: () => [
              ['(b)', (10 - 9) / 5, 0.2, 1e-12],
              ['(c)', (8 - 6) / 5, 0.4, 1e-12],
              ['(d)', (7 - 6) / 5 / ((8 - 6) / 5), 0.5, 1e-12],
            ],
          },
        ],
      ],
    },
    {
      id: '6.2',
      title: 'The normal distribution',
      lab: 'dist',
      problems: ['c6.z-area', 'c6.z-find', 'c6.normal-prob', 'c6.normal-percentile', 'c6.normal-count', 'c6.both-independent'],
      blocks: [
        ['key', String.raw`$X \sim N(\mu, \sigma^2)$ has density $f(x) = \dfrac{1}{\sqrt{2\pi}\,\sigma} e^{-\frac{(x - \mu)^2}{2\sigma^2}}$ for all real $x$. $E(X) = \mu$, $\text{Var}(X) = \sigma^2$.`],
        [
          'list',
          [
            'It is bell-shaped and symmetric about $\\mu$ (but not every bell-shaped curve is normal).',
            'Its support is every real number.',
            'Small $\\sigma^2$: tall and thin. Large $\\sigma^2$: fat and flat.',
            'Probabilities are areas under the curve: $P(x_1 < X < x_2) = \\int_{x_1}^{x_2} f(x)\\,dx$, found from a table or the calculator, never by hand.',
          ],
        ],
        ['def', 'Standard normal $Z$:', 'the normal distribution with mean 0 and variance 1. Table A.3 gives the area to the LEFT of each $z$: $P(Z < z)$.'],
        [
          'ex',
          {
            n: '6.2',
            q: 'Find $P(Z < 0.52)$.',
            a: ['Table A.3: row 0.5, column .02.'],
            answer: 'P(Z < 0.52) = 0.6985.',
            problem: 'c6.z-area',
            case: 0,
            checks: () => [
              ['table', zTable(0.52), 0.6985, 0],
              ['exact', normCdf(0.52), 0.6985, 5e-5],
            ],
          },
        ],
        ['key', String.raw`Right tail: $P(Z > z) = 1 - P(Z < z)$. Between: $P(a < Z < b) = P(Z < b) - P(Z < a)$.`],
        ['key', String.raw`Any normal becomes standard by $Z = \dfrac{X - \mu}{\sigma}$: how many standard deviations $x$ is from the mean.`],
        [
          'ex',
          {
            n: '6.3',
            q: 'Heights of three-year-old girls are approximately normal with mean 38.72 inches and standard deviation 3.17. (a) What proportion are shorter than 35 inches? (b) Find the 20th percentile of height.',
            a: [
              String.raw`(a) $z = \dfrac{35 - 38.72}{3.17} = -1.17$, and $P(Z < -1.17) = 0.1210$ from the table. Calculator: normalcdf$(-10^{99}, 35, 38.72, 3.17) = 0.1203$.`,
              String.raw`(b) Find $z$ with 0.20 to its left: the table's closest area is 0.2005 at $z = -0.84$. Then $x = \mu + z\sigma = 38.72 + (-0.84)(3.17) = 36.06$. Calculator: invNorm$(0.2, 38.72, 3.17) = 36.05$.`,
            ],
            answer: '(a) about 12% (0.1210 by the table, 0.1203 exact). (b) about 36.05 inches.',
            problem: 'c6.normal-prob',
            case: 0,
            checks: () => [
              ['(a) z', Math.round(((35 - 38.72) / 3.17) * 100) / 100, -1.17, 0],
              ['(a) table', zTable(-1.17), 0.121, 0],
              ['(a) exact', normCdf(35, 38.72, 3.17), 0.1203, 5e-5],
              ['(b) table z', zForArea(0.2), -0.84, 0],
              ['(b) table x', 38.72 - 0.84 * 3.17, 36.06, 5e-3],
              ['(b) exact', normInv(0.2, 38.72, 3.17), 36.05, 5e-3],
            ],
          },
        ],
        ['ti', ['2nd VARS ▸ 2:normalcdf(: lower, upper, $\\mu$, $\\sigma$. Use $-10^{99}$ (typed -1E99) for "no lower bound" and $10^{99}$ for "no upper bound".', '2nd VARS ▸ 3:invNorm(: area to the LEFT, $\\mu$, $\\sigma$. It returns the value with that area below it (a percentile).']],
        [
          'ex',
          {
            n: '6.4',
            q: 'Finishing times in the New York City 10-km run are normal with mean 61 minutes and standard deviation 9. (a) What percentage finish between 55 and 70 minutes? (b) What time must a runner beat to be in the fastest 10%? (c) Hailey and Jack both ran, independently. What is the probability both finish within an hour?',
            a: [
              String.raw`(a) $z_1 = \dfrac{55 - 61}{9} = -0.67$, $z_2 = \dfrac{70 - 61}{9} = 1.00$. $P = 0.8413 - 0.2514 = 0.5899$ by the table; normalcdf$(55, 70, 61, 9) = 0.5889$.`,
              String.raw`(b) The FASTEST 10% have the SHORTEST times: the 10th percentile. Table: area 0.1003 at $z = -1.28$, so $x = 61 - 1.28(9) = 49.48$. invNorm$(0.1, 61, 9) = 49.47$ minutes.`,
              String.raw`(c) One runner: $P(X < 60) = P(Z < -0.11) = 0.4562$ (exact 0.4557). Independent, so multiply: $0.4562^2 = 0.2081$ (exact 0.2077).`,
            ],
            answer: '(a) about 59% (b) about 49.5 minutes (c) about 0.208.',
            problem: 'c6.normal-prob',
            case: 1,
            checks: () => [
              ['(a) table', zTable(1) - zTable(-0.67), 0.5899, 1e-9],
              ['(a) exact', normCdf(70, 61, 9) - normCdf(55, 61, 9), 0.5889, 5e-5],
              ['(b) table z', zForArea(0.1), -1.28, 0],
              ['(b) exact', normInv(0.1, 61, 9), 49.47, 5e-3],
              ['(c) one, table', zTable(-0.11), 0.4562, 0],
              ['(c) both, table', zTable(-0.11) ** 2, 0.2081, 5e-5],
              ['(c) both, exact', normCdf(60, 61, 9) ** 2, 0.2077, 5e-5],
            ],
          },
        ],
        ['warn', '"Fastest" means smallest time, so the fastest 10% is the LEFT tail. Draw the curve and shade before you use invNorm, which always wants the area to the left.'],
        ['def', String.raw`$z_\alpha$:`, 'the $z$ value with area $\\alpha$ to its RIGHT under the standard normal curve (so area $1 - \\alpha$ to its left).'],
        [
          'ex',
          {
            n: '6.5',
            q: String.raw`Find $z_{0.1}$.`,
            a: [String.raw`Area to the left is $1 - 0.1 = 0.9$. The table's closest area is 0.8997 at $z = 1.28$. Calculator: invNorm$(0.9) = 1.2816$.`],
            answer: String.raw`$z_{0.1} = 1.28$.`,
            problem: 'c6.z-alpha',
            case: 0,
            checks: () => [
              ['table', zForArea(0.9), 1.28, 0],
              ['exact', normInv(0.9), 1.2816, 5e-5],
            ],
          },
        ],
        ['key', String.raw`Worth knowing by heart: $z_{0.05} = 1.645$, $z_{0.025} = 1.96$, $z_{0.005} = 2.576$.`],
      ],
    },
    {
      id: '6.3',
      title: 'Assessing normality: the normal probability plot',
      lab: 'npp',
      problems: ['c6.normal-scores', 'c6.normal-plot'],
      blocks: [
        ['p', 'A **normal probability plot** (Q-Q plot) checks whether data could come from a normal population:'],
        [
          'steps',
          [
            'Sort the data in ascending order.',
            String.raw`For the $i$th smallest of $n$ values, find the theoretical quantile $z_i = \Phi^{-1}\!\left(\frac{i - 0.5}{n}\right)$: the $z$ with area $\frac{i - 0.5}{n}$ to its left.`,
            'Plot the points with $z_i$ on the x-axis and the sorted data on the y-axis.',
          ],
        ],
        ['key', 'Data from a normal population give a plot that is roughly a straight line. A curve means skew; an S shape means tails heavier or lighter than a normal’s.'],
        [
          'ex',
          {
            n: '6.6',
            q: 'Finishing times (seconds) of a greyhound in six races: 31.35, 32.52, 32.06, 31.26, 31.91, 32.37. Is it reasonable that finishing time is normally distributed?',
            data: {
              head: ['$i$', 'sorted time', '$(i - 0.5)/6$', '$z_i$'],
              rows: [...GREYHOUND]
                .sort((a, b) => a - b)
                .map((x, i) => [i + 1, x.toFixed(2), ((i + 0.5) / 6).toFixed(4), normInv((i + 0.5) / 6).toFixed(3)]),
            },
            a: [
              'Sort the times and compute the six quantiles (table above). They are symmetric: $\\pm 1.383$, $\\pm 0.674$, $\\pm 0.210$.',
              'Plot sorted time against $z_i$. The six points lie close to a straight line.',
            ],
            answer: 'Yes: the plot is roughly linear, so a normal model for finishing time is reasonable.',
            problem: 'c6.normal-scores',
            case: 0,
            checks: () => [
              ['z1', normInv(0.5 / 6), -1.383, 5e-4],
              ['z2', normInv(1.5 / 6), -0.674, 5e-4],
              ['z3', normInv(2.5 / 6), -0.21, 5e-4],
            ],
          },
        ],
        ['ti', ['STAT ▸ 1:Edit: data in L1.', '2nd Y= ▸ 1:Plot1: On; Type: the last icon (normal probability plot); Data List: L1; Data Axis: Y (so the data go up the y-axis, as in the notes).', 'ZOOM ▸ 9:ZoomStat.']],
        ['p', 'With only a few points some wiggle is expected even from a normal population; look for a clear curve or S, not perfection. The normal probability plot lab shows how much normal samples of each size wiggle.'],
      ],
    },
  ],
};
