/**
 * Chapter 4, rewritten from the teacher's notes (Ch 4, pp. 47–57). Example numbers are the notes'.
 */
const integrate = (f, a, b, n = 4000) => {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
};

const XS = [0, 1, 2, 3, 4, 5];
const PS = [0.35, 0.25, 0.2, 0.1, 0.05, 0.05];
const E = (g) => XS.reduce((t, x, i) => t + g(x) * PS[i], 0);

export default {
  ch: '4',
  title: 'Mathematical expectation',
  sections: [
    {
      id: '4.1',
      title: 'The mean (expected value) of a random variable',
      lab: 'dist',
      problems: ['c4.mean-variance-pmf', 'c4.commission', 'c4.expected-life', 'c4.expected-value'],
      blocks: [
        ['p', 'The **mean** or **expected value** of a random variable is the center of its distribution: the long-run average of its values if the experiment were repeated many times.'],
        ['key', String.raw`$\mu = E(X) = \sum_x x\,f(x)$ if $X$ is discrete; $\mu = E(X) = \int_{-\infty}^{\infty} x\,f(x)\,dx$ if $X$ is continuous.`],
        [
          'ex',
          {
            n: '4.1',
            q: 'Daily interruptions in a large computer network have the distribution below. How many interruptions can we expect each day?',
            data: { head: ['$x$', 0, 1, 2, 3, 4, 5], rows: [['$f(x)$', ...PS]] },
            a: [String.raw`$\mu = \sum x f(x) = 0(0.35) + 1(0.25) + 2(0.20) + 3(0.10) + 4(0.05) + 5(0.05)$`, '$= 0 + 0.25 + 0.4 + 0.3 + 0.2 + 0.25 = 1.4$.'],
            answer: '1.4 interruptions per day, as a long-run average (no single day has 1.4).',
            problem: 'c4.mean-variance-pmf',
            case: 0,
            checks: () => [['μ', E((x) => x), 1.4, 1e-12]],
          },
        ],
        ['ti', ['STAT ▸ 1:Edit: the values $x$ in L1, the probabilities in L2.', 'STAT ▸ CALC ▸ 1:1-Var Stats, List: L1, FreqList: L2, Calculate.', String.raw`$\bar{x}$ is $\mu$ (1.4) and $\sigma x$ is $\sigma$ (1.428). Ignore $Sx$ and $n$: the "data" here are probabilities.`]],
        [
          'ex',
          {
            n: '4.2',
            q: 'A salesperson has two appointments. At the first there is a 70% chance of a deal worth 1000 dollars commission; at the second, a 40% chance of a deal worth 1500 dollars. The results are independent. What is the expected commission?',
            a: [
              'Let $X$ be the total commission. List its values and use independence to multiply:',
              String.raw`$f(0) = (0.3)(0.6) = 0.18$; $f(1000) = (0.7)(0.6) = 0.42$; $f(1500) = (0.3)(0.4) = 0.12$; $f(2500) = (0.7)(0.4) = 0.28$.`,
              String.raw`$E(X) = 0(0.18) + 1000(0.42) + 1500(0.12) + 2500(0.28) = 0 + 420 + 180 + 700 = 1300$.`,
            ],
            answer: '1300 dollars (a long-run average: on any one day the commission is 0, 1000, 1500 or 2500).',
            problem: 'c4.commission',
            case: 0,
            checks: () => [
              ['sum f', 0.18 + 0.42 + 0.12 + 0.28, 1, 1e-12],
              ['E', 1000 * 0.7 * 0.6 + 1500 * 0.3 * 0.4 + 2500 * 0.7 * 0.4, 1300, 1e-9],
              ['by linearity', 1000 * 0.7 + 1500 * 0.4, 1300, 1e-9],
            ],
          },
        ],
        ['why', 'Shortcut by §4.3: the total is the sum of the two commissions, so $E(X) = 0.7(1000) + 0.4(1500) = 700 + 600 = 1300$. Same answer, no table.'],
        [
          'ex',
          {
            n: '4.3',
            q: String.raw`The life $X$ in hours of an electronic device has density $f(x) = \dfrac{20{,}000}{x^3}$ for $x > 100$, and 0 elsewhere. Find the expected life.`,
            a: [
              String.raw`$E(X) = \int_{100}^{\infty} x \cdot \dfrac{20{,}000}{x^3}\,dx = \int_{100}^{\infty} 20{,}000\,x^{-2}\,dx$`,
              String.raw`$= \left[-\dfrac{20{,}000}{x}\right]_{100}^{\infty} = 0 - \left(-\dfrac{20{,}000}{100}\right) = 200$.`,
            ],
            answer: '200 hours.',
            problem: 'c4.expected-life',
            case: 0,
            // The tail beyond 10^6 contributes 20000/10^6 = 0.02, added back exactly.
            checks: () => [['E', integrate((x) => 20000 / (x * x), 100, 1e6, 400000) + 20000 / 1e6, 200, 1e-3]],
          },
        ],
        ['key', String.raw`The expected value of a function $g(X)$: $E[g(X)] = \sum_x g(x)\,f(x)$, or $\int g(x)\,f(x)\,dx$. Apply $g$ to each value; keep the probabilities.`],
        [
          'ex',
          {
            n: '4.4',
            q: 'For the interruptions of Example 4.1, the cost, in thousands of dollars, is $g(X) = 2X + 1$. Find the expected daily cost.',
            a: [
              'The values of $g$: $2x + 1 = 1, 3, 5, 7, 9, 11$, with the same probabilities.',
              String.raw`$E(2X + 1) = 1(0.35) + 3(0.25) + 5(0.20) + 7(0.10) + 9(0.05) + 11(0.05) = 0.35 + 0.75 + 1 + 0.7 + 0.45 + 0.55 = 3.8$.`,
            ],
            answer: '3.8 thousand dollars per day.',
            problem: 'c4.expected-g',
            case: 0,
            checks: () => [
              ['E(2X+1)', E((x) => 2 * x + 1), 3.8, 1e-12],
              ['2E(X)+1', 2 * 1.4 + 1, 3.8, 1e-12],
            ],
          },
        ],
        ['fix', String.raw`The handwritten answer to Ex 4.4 reads "$E(X) = 3.8$". It is $E[g(X)] = E(2X + 1) = 3.8$; $E(X)$ itself is 1.4. (Check with §4.3: $2(1.4) + 1 = 3.8$.)`],
        ['ti', ['Values in L1, probabilities in L2. Highlight the L3 heading, type 2*L1+1, ENTER: L3 holds the values of $g$.', '1-Var Stats with List: L3, FreqList: L2 gives $\\bar{x} = 3.8$.']],
        [
          'ex',
          {
            n: '4.5',
            q: String.raw`$X$ has density $f(x) = \frac{x^2}{3}$ for $-1 < x < 2$, and 0 elsewhere. Find $E(4X + 3)$.`,
            a: [String.raw`$E(4X + 3) = \int_{-1}^{2} (4x + 3)\,\frac{x^2}{3}\,dx = \int_{-1}^{2} \left(\frac{4x^3}{3} + x^2\right) dx = \left[\frac{x^4}{3} + \frac{x^3}{3}\right]_{-1}^{2} = \frac{24}{3} - 0 = 8$.`],
            answer: '8.',
            problem: 'c4.expected-g-continuous',
            case: 0,
            checks: () => [
              ['E(4X+3)', integrate((x) => ((4 * x + 3) * x * x) / 3, -1, 2), 8, 1e-9],
              ['via E(X)', 4 * integrate((x) => (x * x * x) / 3, -1, 2) + 3, 8, 1e-9],
            ],
          },
        ],
      ],
    },
    {
      id: '4.2',
      title: 'Variance and standard deviation of a random variable',
      lab: 'dist',
      problems: ['c4.mean-variance-pmf', 'c4.pdf-mean'],
      blocks: [
        ['p', 'Two distributions can share a mean and differ in spread. The **variance** measures the spread about $\\mu$.'],
        ['key', String.raw`$\sigma^2 = E[(X - \mu)^2] = \sum_x (x - \mu)^2 f(x)$ (discrete), or $\int (x - \mu)^2 f(x)\,dx$ (continuous). The standard deviation $\sigma$ is its positive square root.`],
        ['p', String.raw`A shortcut, often quicker by hand: $\sigma^2 = E(X^2) - \mu^2$.`],
        [
          'ex',
          {
            n: '4.6',
            q: 'Find the variance and standard deviation of the daily interruptions of Example 4.1 ($\\mu = 1.4$).',
            a: [
              String.raw`$x - \mu$: $-1.4, -0.4, 0.6, 1.6, 2.6, 3.6$; squared: $1.96, 0.16, 0.36, 2.56, 6.76, 12.96$.`,
              String.raw`$\sigma^2 = \sum (x - \mu)^2 f(x) = 1.96(0.35) + 0.16(0.25) + 0.36(0.20) + 2.56(0.10) + 6.76(0.05) + 12.96(0.05) = 2.04$.`,
              String.raw`Check by the shortcut: $E(X^2) = 0 + 0.25 + 0.8 + 0.9 + 0.8 + 1.25 = 4$, and $4 - 1.4^2 = 2.04$.`,
              String.raw`$\sigma = \sqrt{2.04} = 1.43$.`,
            ],
            answer: 'σ² = 2.04, σ = 1.43 interruptions.',
            problem: 'c4.mean-variance-pmf',
            case: 0,
            checks: () => [
              ['σ²', E((x) => (x - 1.4) ** 2), 2.04, 1e-12],
              ['E(X²)', E((x) => x * x), 4, 1e-12],
              ['σ', Math.sqrt(2.04), 1.43, 5e-3],
            ],
          },
        ],
        [
          'ex',
          {
            n: '4.7',
            q: 'Weekly demand $X$ for a drinking-water product, in thousands of liters, has density $f(x) = 2(x - 1)$ for $1 < x < 2$, and 0 elsewhere. Find the mean and variance.',
            a: [
              String.raw`$\mu = \int_1^2 x \cdot 2(x - 1)\,dx = \left[\frac{2x^3}{3} - x^2\right]_1^2 = \frac{4}{3} - \left(-\frac{1}{3}\right) = \frac{5}{3}$.`,
              String.raw`$\sigma^2 = \int_1^2 \left(x - \frac{5}{3}\right)^2 2(x - 1)\,dx = \frac{1}{18}$. (Or: $E(X^2) = \int_1^2 x^2 \cdot 2(x-1)\,dx = \frac{17}{6}$, and $\frac{17}{6} - \frac{25}{9} = \frac{1}{18}$.)`,
            ],
            answer: 'μ = 5/3 ≈ 1.667 thousand liters; σ² = 1/18 ≈ 0.0556.',
            problem: 'c4.pdf-mean',
            case: 1,
            checks: () => [
              ['μ', integrate((x) => x * 2 * (x - 1), 1, 2), 5 / 3, 1e-9],
              ['σ²', integrate((x) => (x - 5 / 3) ** 2 * 2 * (x - 1), 1, 2), 1 / 18, 1e-9],
              ['E(X²)', integrate((x) => x * x * 2 * (x - 1), 1, 2), 17 / 6, 1e-9],
            ],
          },
        ],
      ],
    },
    {
      id: '4.3',
      title: 'Means and variances of linear combinations',
      problems: ['c4.linear-transform', 'c4.linear-combination'],
      blocks: [
        ['p', String.raw`A **linear combination** of random variables adds them up with constant weights: $Y = a_0 + a_1 X_1 + a_2 X_2 + \cdots + a_n X_n$, where the $a_i$ are constants (possibly negative). $2X - 4$ is linear; $X^2 + \log X$ is not.`],
        ['key', String.raw`$E(aX + b) = aE(X) + b$. So $E(b) = b$ (a constant's expectation is itself) and $E(aX) = aE(X)$ (constants come out).`],
        ['key', String.raw`$E[g(X) \pm h(X)] = E[g(X)] \pm E[h(X)]$, and in general $E(a_0 + a_1X_1 + \cdots + a_nX_n) = a_0 + a_1E(X_1) + \cdots + a_nE(X_n)$.`],
        ['key', String.raw`$\sigma^2_{aX + c} = a^2\sigma^2_X$. Adding a constant shifts without spreading; multiplying by $a$ scales the spread by $|a|$, the variance by $a^2$.`],
        ['key', String.raw`If $X_1, \ldots, X_n$ are INDEPENDENT: $\sigma^2_{a_0 + a_1X_1 + \cdots + a_nX_n} = a_1^2\sigma^2_{X_1} + \cdots + a_n^2\sigma^2_{X_n}$.`],
        ['why', 'The squares make every term positive: subtracting a variable still ADDS its variance. $X - Y$ is at least as uncertain as $X$ and $Y$ each.'],
        [
          'ex',
          {
            n: '4.8',
            q: String.raw`$X$ and $Y$, amounts of two impurities in a chemical product, are independent with $E(X) = -1$, $E(Y) = 2$, $\sigma^2_X = 2$, $\sigma^2_Y = 3$. Find the mean and variance of $Z = 3X - 2Y + 5$.`,
            a: [
              String.raw`$E(Z) = 3E(X) - 2E(Y) + 5 = 3(-1) - 2(2) + 5 = -2$.`,
              String.raw`$\sigma^2_Z = \text{Var}(3X + (-2)Y) = 3^2\sigma^2_X + (-2)^2\sigma^2_Y = 9(2) + 4(3) = 30$. (The $+5$ does not spread anything.)`,
            ],
            answer: 'E(Z) = −2, σ²_Z = 30.',
            problem: 'c4.linear-combination',
            case: 0,
            checks: () => [
              ['E', 3 * -1 - 2 * 2 + 5, -2, 0],
              ['Var', 9 * 2 + 4 * 3, 30, 0],
            ],
          },
        ],
        ['warn', String.raw`The notes mark this wrong on purpose: $\text{Var}(3X - 2Y) = 9\text{Var}(X) - 4\text{Var}(Y) = 6$. ✗ Coefficients are squared, so the minus sign disappears: the variances add.`],
      ],
    },
  ],
};
