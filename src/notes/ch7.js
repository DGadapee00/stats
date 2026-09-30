/**
 * Chapter 7, rewritten from the teacher's notes (Ch 7, pp. 86–94). The notes pose these examples and
 * leave the working for class; every answer here is computed, by the printed z table and exactly.
 */
import { normCdf, binomCdf } from '../stats/dist.js';
import { zTable as zLook } from '../stats/tables.js';

const zTable = (z) => zLook(z).value;
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  ch: '7',
  title: 'Fundamental sampling distributions',
  sections: [
    {
      id: '7.1',
      title: 'Linear functions of normal random variables',
      problems: ['c7.linear-normal'],
      blocks: [
        ['p', String.raw`Recall from §4.3: $E(a_0 + a_1X_1 + \cdots + a_nX_n) = a_0 + a_1E(X_1) + \cdots + a_nE(X_n)$, and for INDEPENDENT $X_i$, $\sigma^2_{a_0 + a_1X_1 + \cdots + a_nX_n} = a_1^2\sigma^2_{X_1} + \cdots + a_n^2\sigma^2_{X_n}$.`],
        ['key', String.raw`A linear function of normal random variables is itself NORMAL: if $X_1, \ldots, X_n$ are normal, so is $Y = a_0 + a_1X_1 + \cdots + a_nX_n$. (Only normal random variables have this property.)`],
        ['p', 'So the mean and variance from §4.3 are all you need to know $Y$ completely.'],
        [
          'ex',
          {
            n: '7.1',
            q: String.raw`$X_1$ and $X_2$ are independent normals: $X_1$ has mean 1 and variance 4, $X_2$ has mean $-2$ and variance 9. With $Y = 3 - X_1 + 2X_2$, find $P(Y > 8)$.`,
            a: [
              String.raw`$E(Y) = 3 - 1 + 2(-2) = -2$.`,
              String.raw`$\sigma_Y^2 = (-1)^2(4) + 2^2(9) = 40$, so $\sigma_Y = \sqrt{40} = 6.325$.`,
              String.raw`$Y$ is normal, so $P(Y > 8) = P\!\left(Z > \dfrac{8 - (-2)}{6.325}\right) = P(Z > 1.58) = 1 - 0.9429 = 0.0571$. Exact: 0.0569.`,
            ],
            answer: 'P(Y > 8) ≈ 0.057.',
            problem: 'c7.linear-normal',
            case: 0,
            checks: () => [
              ['E', 3 - 1 + 2 * -2, -2, 0],
              ['Var', 4 + 4 * 9, 40, 0],
              ['z', r2(10 / Math.sqrt(40)), 1.58, 0],
              ['table', 1 - zTable(1.58), 0.0571, 1e-9],
              ['exact', 1 - normCdf(8, -2, Math.sqrt(40)), 0.0569, 5e-5],
            ],
          },
        ],
        [
          'ex',
          {
            n: '7.2',
            q: String.raw`$X_1, \ldots, X_n$ is a random sample from a population with mean $\mu$ and variance $\sigma^2$. Find the mean and variance of the sample mean $\bar{X}$.`,
            a: [
              String.raw`$\bar{X} = \frac{1}{n}X_1 + \cdots + \frac{1}{n}X_n$: a linear combination with every $a_i = 1/n$, and the $X_i$ are independent.`,
              String.raw`$E(\bar{X}) = \frac{1}{n}\mu + \cdots + \frac{1}{n}\mu = \mu$.`,
              String.raw`$\sigma^2_{\bar{X}} = \frac{1}{n^2}\sigma^2 + \cdots + \frac{1}{n^2}\sigma^2 = n \cdot \frac{\sigma^2}{n^2} = \frac{\sigma^2}{n}$.`,
            ],
            answer: String.raw`$\mu_{\bar{X}} = \mu$, $\sigma^2_{\bar{X}} = \sigma^2/n$, so $\sigma_{\bar{X}} = \sigma/\sqrt{n}$.`,
          },
        ],
        [
          'ex',
          {
            n: '7.3',
            q: 'If the population in Example 7.2 is normal, what is the distribution of $\\bar{X}$?',
            a: ['$\\bar{X}$ is a linear function of normal random variables, so it is normal, with the mean and variance of Example 7.2.'],
            answer: String.raw`$\bar{X} \sim N\!\left(\mu, \dfrac{\sigma^2}{n}\right)$ exactly, for every $n$.`,
          },
        ],
      ],
    },
    {
      id: '7.2',
      title: 'The sampling distribution of x̄ and the central limit theorem',
      lab: 'clt',
      problems: ['c7.xbar-mean-sd', 'c7.xbar-prob', 'c7.clt-when'],
      blocks: [
        ['p', 'A statistic is computed from a random sample, so it is itself random: another sample would give another value. Its probability distribution is its **sampling distribution**.'],
        ['key', String.raw`From a NORMAL population with mean $\mu$ and variance $\sigma^2$: $\bar{X} \sim N\!\left(\mu, \dfrac{\sigma^2}{n}\right)$, and $Z = \dfrac{\bar{X} - \mu}{\sigma/\sqrt{n}}$.`],
        [
          'ex',
          {
            n: '7.4',
            q: 'A machine fills soft-drink cans with mean 12.1 fluid ounces and standard deviation 0.5; fill volumes are independent normal random variables. What is the probability the average of 10 cans is less than 12 ounces?',
            a: [
              String.raw`$\bar{X} \sim N(12.1, 0.5^2/10)$: $\sigma_{\bar{X}} = 0.5/\sqrt{10} = 0.1581$.`,
              String.raw`$P(\bar{X} < 12) = P\!\left(Z < \dfrac{12 - 12.1}{0.1581}\right) = P(Z < -0.63) = 0.2643$. Exact: 0.2635.`,
            ],
            answer: 'About 0.264.',
            problem: 'c7.xbar-prob',
            case: 0,
            checks: () => [
              ['se', 0.5 / Math.sqrt(10), 0.1581, 5e-5],
              ['z', r2(-0.1 / (0.5 / Math.sqrt(10))), -0.63, 0],
              ['table', zTable(-0.63), 0.2643, 0],
              ['exact', normCdf(12, 12.1, 0.5 / Math.sqrt(10)), 0.2635, 5e-5],
            ],
          },
        ],
        ['warn', String.raw`Use $\sigma/\sqrt{n}$, not $\sigma$, for a question about an AVERAGE. With $\sigma = 0.5$ the answer would be $P(Z < -0.2) = 0.42$, the chance for one can.`],
        ['key', String.raw`**Central limit theorem.** From ANY population with mean $\mu$ and variance $\sigma^2$, for large enough $n$, $\bar{X}$ is approximately $N\!\left(\mu, \dfrac{\sigma^2}{n}\right)$, whatever the population's shape. The larger $n$, the better the approximation.`],
        ['p', 'How large is large? The usual rule of thumb is $n \\ge 30$. A normal population needs no rule (Example 7.3); a very skewed one may need more.'],
        [
          'ex',
          {
            n: '7.5',
            q: 'Weight gain during pregnancy has mean 30 pounds and standard deviation 12.9, and is skewed right. What is the probability that the mean weight gain of a random sample of patients is greater than 36.2 pounds, when (a) $n = 10$; (b) $n = 35$?',
            a: [
              '(a) The population is skewed and $n = 10$ is small: we cannot say $\\bar{X}$ is normal, so the normal curve cannot give this probability.',
              String.raw`(b) $n = 35 \ge 30$: by the CLT, $\bar{X}$ is approximately normal with $\sigma_{\bar{X}} = 12.9/\sqrt{35} = 2.1805$.`,
              String.raw`$P(\bar{X} > 36.2) = P\!\left(Z > \dfrac{36.2 - 30}{2.1805}\right) = P(Z > 2.84) = 1 - 0.9977 = 0.0023$. Exact: 0.0022.`,
            ],
            answer: '(a) cannot be found with the normal model; (b) about 0.002.',
            problem: 'c7.xbar-prob',
            case: 1,
            checks: () => [
              ['se', 12.9 / Math.sqrt(35), 2.1805, 5e-5],
              ['z', r2(6.2 / (12.9 / Math.sqrt(35))), 2.84, 0],
              ['table', 1 - zTable(2.84), 0.0023, 1e-9],
              ['exact', 1 - normCdf(36.2, 30, 12.9 / Math.sqrt(35)), 0.0022, 5e-5],
            ],
          },
        ],
      ],
    },
    {
      id: '7.3',
      title: 'The normal approximation to the binomial',
      lab: 'clt',
      problems: ['c7.normal-approx-binomial'],
      blocks: [
        ['p', 'A binomial $\\text{Bin}(n, p)$ has $\\mu = np$ and $\\sigma^2 = np(1 - p)$, and for large $n$ its probability histogram is bell-shaped. The steps:'],
        [
          'steps',
          [
            'Identify the binomial: $n$ and $p$.',
            'Check that $n$ is large enough: $np(1 - p) \\ge 10$.',
            'Use the normal with $\\mu = np$, $\\sigma = \\sqrt{np(1-p)}$.',
            'Correct for continuity: each whole number $x$ stands for the interval $x - 0.5$ to $x + 0.5$.',
          ],
        ],
        [
          'table',
          {
            head: ['Binomial event', 'Normal area'],
            rows: [
              ['$X \\le a$', '$X < a + 0.5$'],
              ['$X < a$ (that is, $X \\le a - 1$)', '$X < a - 0.5$'],
              ['$X \\ge a$', '$X > a - 0.5$'],
              ['$X > a$ (that is, $X \\ge a + 1$)', '$X > a + 0.5$'],
              ['$X = a$', '$a - 0.5 < X < a + 0.5$'],
            ],
            note: 'Rule: include the bars the event includes, all of each bar.',
          },
        ],
        [
          'ex',
          {
            n: '7.6',
            q: 'Each of 1000 LED bulbs on a tree burns out with probability 0.05, independently. Approximate the probability that (a) at most 975 work; (b) more than 950 work.',
            a: [
              String.raw`$X$ = number working: $\text{Bin}(1000, 0.95)$. $np(1-p) = 1000(0.95)(0.05) = 47.5 \ge 10$. ✓`,
              String.raw`$\mu = 950$, $\sigma = \sqrt{47.5} = 6.892$.`,
              String.raw`(a) $P(X \le 975) \approx P(X < 975.5) = P\!\left(Z < \dfrac{975.5 - 950}{6.892}\right) = P(Z < 3.70) \approx 1$ (beyond the table; 0.9999 exact).`,
              String.raw`(b) More than 950 is $X \ge 951$: $P(X > 950.5) = P\!\left(Z > \dfrac{0.5}{6.892}\right) = P(Z > 0.07) = 1 - 0.5279 = 0.4721$. Exact $z$: 0.4711.`,
            ],
            answer: '(a) about 1 (b) about 0.47. (The exact binomial answers are 0.99998 and 0.4797.)',
            problem: 'c7.normal-approx-binomial',
            case: 0,
            checks: () => [
              ['σ', Math.sqrt(47.5), 6.892, 5e-4],
              ['(a) z', r2(25.5 / Math.sqrt(47.5)), 3.7, 0],
              ['(b) z', r2(0.5 / Math.sqrt(47.5)), 0.07, 0],
              ['(b) table', 1 - zTable(0.07), 0.4721, 1e-9],
              ['(b) exact z', 1 - normCdf(0.5 / Math.sqrt(47.5)), 0.4711, 5e-5],
              ['(a) binomial', binomCdf(975, 1000, 0.95), 0.99998, 5e-6],
              ['(b) binomial', 1 - binomCdf(950, 1000, 0.95), 0.4797, 5e-5],
            ],
          },
        ],
        ['warn', '"More than 950" does not include 950. Translate to whole numbers first ($X \\ge 951$), then take the whole bar: $X > 950.5$.'],
      ],
    },
    {
      id: '7.4',
      title: 'The sampling distribution of p̂',
      lab: 'clt',
      problems: ['c7.point-estimate', 'c7.phat'],
      blocks: [
        ['def', 'Sample proportion:', String.raw`$\hat{p} = \dfrac{x}{n}$, where $x$ is the number in the sample with the characteristic. It is a point estimate of the population proportion $p$.`],
        [
          'ex',
          {
            n: '7.7',
            q: 'In a Gallup poll, 558 of 1016 adult Americans said the federal income tax they pay is fair. Give a point estimate of the proportion of all adult Americans who think so.',
            a: [String.raw`$\hat{p} = \dfrac{558}{1016} = 0.5492$.`],
            answer: 'About 0.549, or 54.9%.',
            problem: 'c7.point-estimate',
            case: 0,
            checks: () => [['p̂', 558 / 1016, 0.5492, 5e-5]],
          },
        ],
        ['key', String.raw`If $np(1 - p) \ge 10$: $\hat{p}$ is approximately $N\!\left(p, \dfrac{p(1-p)}{n}\right)$, so $\mu_{\hat{p}} = p$ and $\sigma_{\hat{p}} = \sqrt{\dfrac{p(1-p)}{n}}$.`],
        ['why', String.raw`$\hat{p} = X/n$ with $X$ binomial: $E(\hat{p}) = np/n = p$ and $\text{Var}(\hat{p}) = np(1-p)/n^2 = p(1-p)/n$. The normal shape is the normal approximation to the binomial of §7.3.`],
        [
          'ex',
          {
            n: '7.8',
            q: '76% of Americans believe the state of moral values in the U.S. is getting worse. For a simple random sample of $n = 60$: (a) describe the sampling distribution of $\\hat{p}$; (b) find the probability that at most 70% of the sample hold this belief.',
            a: [
              String.raw`(a) $np(1 - p) = 60(0.76)(0.24) = 10.94 \ge 10$, so $\hat{p}$ is approximately normal with mean $0.76$ and standard deviation $\sqrt{\dfrac{0.76(0.24)}{60}} = 0.0551$.`,
              String.raw`(b) $P(\hat{p} \le 0.70) = P\!\left(Z \le \dfrac{0.70 - 0.76}{0.0551}\right) = P(Z \le -1.09) = 0.1379$. Exact: 0.1383.`,
            ],
            answer: '(a) approximately N(0.76, 0.0551²); (b) about 0.138.',
            problem: 'c7.phat',
            case: 0,
            checks: () => [
              ['np(1-p)', 60 * 0.76 * 0.24, 10.94, 5e-3],
              ['σ', Math.sqrt((0.76 * 0.24) / 60), 0.0551, 5e-5],
              ['z', r2(-0.06 / Math.sqrt((0.76 * 0.24) / 60)), -1.09, 0],
              ['table', zTable(-1.09), 0.1379, 0],
              ['exact', normCdf(0.7, 0.76, Math.sqrt((0.76 * 0.24) / 60)), 0.1383, 5e-5],
            ],
          },
        ],
      ],
    },
  ],
};
