/**
 * Chapter 5, rewritten from the teacher's notes (Ch 5, pp. 58–71). Example numbers are the notes'.
 */
import { binomPmf, binomCdf, geomPmf, geomCdf, poisPmf, poisCdf } from '../stats/dist.js';

export default {
  ch: '5',
  title: 'Some discrete probability distributions',
  sections: [
    {
      id: '5.1',
      title: 'The binomial distribution',
      lab: 'dist',
      problems: ['c5.is-binomial', 'c5.binom-pmf', 'c5.binom-cdf', 'c5.binom-mean-var', 'c5.binom-table'],
      blocks: [
        ['p', 'A **Bernoulli trial** is a random experiment with exactly two outcomes, called success and failure (flipping a coin). A **binomial experiment** is:'],
        [
          'list',
          [
            'a FIXED number $n$ of identical Bernoulli trials;',
            'with the same probability of success $p$ on every trial (failure $1 - p$);',
            'and the trials are INDEPENDENT.',
          ],
        ],
        ['p', 'The **binomial random variable** $X$ counts the successes in the $n$ trials.'],
        [
          'ex',
          {
            n: '5.1',
            q: 'Is $X$ binomial? (a) Flip a coin 5 times; $X$ = number of heads. (b) Throw a die 10 times; $X$ = number of 5s or 6s. (c) A couple has children until their first girl; $X$ = number of children. (d) Test-fire a rifle 10 times while adjusting its scope; $X$ = number of bull’s-eyes. (e) From a box of 8 blue, 6 red and 3 white balls, pick 4; $X$ = number of red. (f) Someone tries their usual passwords, and the account locks after 3 wrong tries; $X$ = number of tries.',
            a: [
              '(a) Yes: $n = 5$ independent flips, success = head, $p = 0.5$.',
              '(b) Yes: $n = 10$ independent throws, success = 5 or 6, $p = 2/6 = 1/3$.',
              '(c) No: there is no fixed $n$. (This one is geometric, §5.2.)',
              '(d) No: adjusting the scope between shots changes $p$, so the shots are not identical independent trials.',
              '(e) No: picking without replacement changes the chance of red after each draw, so the trials are not independent.',
              '(f) No: no fixed $n$, and no fixed success probability from try to try.',
            ],
            problem: 'c5.is-binomial',
            case: 0,
          },
        ],
        ['key', String.raw`If $X$ is binomial with $n$ trials and success probability $p$: $P(X = x) = {}_nC_x\,p^x (1 - p)^{n - x}$, for $x = 0, 1, 2, \ldots, n$.`],
        ['why', String.raw`$p^x(1-p)^{n-x}$ is the probability of one particular order of $x$ successes and $n - x$ failures; $_nC_x$ counts the orders.`],
        [
          'ex',
          {
            n: '5.2',
            q: '15% of people in the U.S. have blood type O-negative. In a simple random sample of 4 people, let $X$ be the number with O-negative. Make the probability distribution table.',
            a: [
              'Each person is a trial (O-negative = success), $n = 4$, independent: $X$ is binomial with $n = 4$, $p = 0.15$.',
              String.raw`$P(X = 0) = {}_4C_0 (0.15)^0 (0.85)^4 = 0.5220$; $P(X = 1) = {}_4C_1 (0.15)^1 (0.85)^3 = 0.3685$.`,
              'Likewise $P(X = 2) = 0.0975$, $P(X = 3) = 0.0115$, $P(X = 4) = 0.0005$.',
            ],
            answer: 'x: 0, 1, 2, 3, 4 with f(x) = 0.5220, 0.3685, 0.0975, 0.0115, 0.0005.',
            problem: 'c5.binom-pmf',
            case: 0,
            checks: () => [[0.522, 0], [0.3685, 1], [0.0975, 2], [0.0115, 3], [0.0005, 4]].map(([v, x]) => [`f(${x})`, binomPmf(x, 4, 0.15), v, 5e-5]),
          },
        ],
        [
          'ex',
          {
            n: '5.3',
            q: '65% of adult Americans favor the death penalty for murder. In a random sample of 15, find the probability that (a) exactly 10 favor it; (b) no more than 6 favor it.',
            a: ['$X$ = number in favor: binomial, $n = 15$, $p = 0.65$.', '(a) $P(X = 10) = $ binompdf(15, 0.65, 10) $= 0.2123$.', '(b) "No more than 6" is $X \\le 6$: $P(X \\le 6) = $ binomcdf(15, 0.65, 6) $= 0.0422$.'],
            answer: '(a) 0.2123, (b) 0.0422.',
            problem: 'c5.binom-pmf',
            case: 1,
            checks: () => [
              ['(a)', binomPmf(10, 15, 0.65), 0.2123, 5e-5],
              ['(b)', binomCdf(6, 15, 0.65), 0.0422, 5e-5],
            ],
          },
        ],
        ['ti', ['2nd VARS (DISTR) ▸ A:binompdf( for $P(X = x)$: trials $n$, $p$, x value.', '2nd VARS ▸ B:binomcdf( for $P(X \\le x)$, same inputs.', 'Everything else is built from these two (below).']],
        [
          'ex',
          {
            n: '5.4',
            q: '41% of U.S. households are wireless-only. In a random sample of 20 households, find the probability that the number of wireless-only households is (a) exactly 5; (b) fewer than 3; (c) no more than 3; (d) at least 3; (e) between 5 and 7, inclusive.',
            a: [
              '$X$ is binomial, $n = 20$, $p = 0.41$.',
              '(a) $P(X = 5) = $ binompdf(20, 0.41, 5) $= 0.0656$.',
              '(b) Fewer than 3 is 0, 1, 2: $P(X < 3) = P(X \\le 2) = $ binomcdf(20, 0.41, 2) $= 0.0028$.',
              '(c) $P(X \\le 3) = $ binomcdf(20, 0.41, 3) $= 0.0128$.',
              '(d) At least 3 is the complement of 0, 1, 2: $P(X \\ge 3) = 1 - P(X \\le 2) = 1 - 0.0028 = 0.9972$.',
              '(e) $P(5 \\le X \\le 7) = P(X \\le 7) - P(X \\le 4) = 0.3381$. (Or add binompdf for 5, 6 and 7.)',
            ],
            answer: '(a) 0.0656 (b) 0.0028 (c) 0.0128 (d) 0.9972 (e) 0.3381.',
            problem: 'c5.binom-cdf',
            case: 1,
            checks: () => [
              ['(a)', binomPmf(5, 20, 0.41), 0.0656, 5e-5],
              ['(b)', binomCdf(2, 20, 0.41), 0.0028, 5e-5],
              ['(c)', binomCdf(3, 20, 0.41), 0.0128, 5e-5],
              ['(d)', 1 - binomCdf(2, 20, 0.41), 0.9972, 5e-5],
              ['(e)', binomCdf(7, 20, 0.41) - binomCdf(4, 20, 0.41), 0.3381, 5e-5],
            ],
          },
        ],
        [
          'table',
          {
            head: ['In words', 'Event', 'On the TI-84'],
            rows: [
              ['exactly $a$', '$X = a$', 'binompdf($n, p, a$)'],
              ['at most $a$, no more than $a$', '$X \\le a$', 'binomcdf($n, p, a$)'],
              ['fewer than $a$', '$X \\le a - 1$', 'binomcdf($n, p, a - 1$)'],
              ['at least $a$', '$X \\ge a$', '1 − binomcdf($n, p, a - 1$)'],
              ['more than $a$', '$X \\ge a + 1$', '1 − binomcdf($n, p, a$)'],
              ['$a$ to $b$ inclusive', '$a \\le X \\le b$', 'binomcdf($n, p, b$) − binomcdf($n, p, a - 1$)'],
            ],
            note: 'For a discrete $X$ the endpoints matter: write out which whole numbers the event includes before reaching for the calculator.',
          },
        ],
        ['key', String.raw`Binomial mean and variance: $\mu = np$, $\sigma^2 = np(1 - p)$. (Only for the binomial.)`],
        [
          'ex',
          {
            n: '5.5',
            q: 'For the 20 households of Example 5.4, find the mean and standard deviation of the number of wireless-only households.',
            a: [String.raw`$\mu = np = 20(0.41) = 8.2$ households.`, String.raw`$\sigma^2 = np(1 - p) = 20(0.41)(0.59) = 4.838$, so $\sigma = \sqrt{4.838} = 2.2$ households.`],
            answer: 'μ = 8.2, σ = 2.2 households.',
            problem: 'c5.binom-mean-var',
            case: 0,
            checks: () => [
              ['μ', 20 * 0.41, 8.2, 1e-12],
              ['σ²', 20 * 0.41 * 0.59, 4.838, 1e-9],
              ['σ', Math.sqrt(20 * 0.41 * 0.59), 2.2, 5e-3],
            ],
          },
        ],
      ],
    },
    {
      id: '5.2',
      title: 'The geometric distribution',
      lab: 'dist',
      problems: ['c5.geometric'],
      blocks: [
        ['p', 'A **geometric experiment** repeats independent, identical Bernoulli trials (success probability $p$ each time) until the FIRST success. The geometric random variable $X$ is the number of the trial on which it happens.'],
        ['key', String.raw`$P(X = x) = p(1 - p)^{x - 1}$, for $x = 1, 2, 3, \ldots$ Mean $\mu = \dfrac{1}{p}$, variance $\sigma^2 = \dfrac{1 - p}{p^2}$.`],
        ['why', 'The first success on trial $x$ means $x - 1$ failures first, then a success: $(1-p)^{x-1} p$.'],
        [
          'ex',
          {
            n: '5.6',
            q: 'On average 1 in every 100 items made is defective. (a) What is the probability that the 5th item inspected is the first defective? (b) What is the probability the first defective is found within 5 inspections?',
            a: [
              '$X$ = number of items inspected to find the first defective: geometric with $p = 0.01$.',
              String.raw`(a) $P(X = 5) = 0.01(0.99)^4 = $ geometpdf(0.01, 5) $= 0.0096$.`,
              String.raw`(b) $P(X \le 5) = $ geometcdf(0.01, 5) $= 0.0490$.`,
            ],
            answer: '(a) 0.0096 (b) 0.0490.',
            problem: 'c5.geometric',
            case: 0,
            checks: () => [
              ['(a)', geomPmf(5, 0.01), 0.0096, 5e-5],
              ['(b)', geomCdf(5, 0.01), 0.049, 5e-5],
            ],
          },
        ],
        ['ti', ['2nd VARS ▸ F:geometpdf( with $p$ and x value: $P(X = x)$.', '2nd VARS ▸ G:geometcdf(: $P(X \\le x)$. (Letters vary by model; scroll the DISTR menu.)']],
        [
          'ex',
          {
            n: '5.7',
            q: 'In the same process, how many inspections does it take, on average, to find the first defective? Find the standard deviation too.',
            a: [String.raw`$\mu = 1/p = 1/0.01 = 100$ items.`, String.raw`$\sigma^2 = (1 - p)/p^2 = 0.99/0.0001 = 9900$, so $\sigma = \sqrt{9900} = 99.5$ items.`],
            answer: 'μ = 100 items, σ = 99.5 items.',
            problem: 'c5.geometric',
            case: 0,
            checks: () => [
              ['μ', 1 / 0.01, 100, 1e-9],
              ['σ²', 0.99 / 0.0001, 9900, 1e-6],
              ['σ', Math.sqrt(9900), 99.5, 5e-3],
            ],
          },
        ],
      ],
    },
    {
      id: '5.3',
      title: 'The Poisson distribution',
      lab: 'dist',
      problems: ['c5.poisson-basics', 'c5.poisson-rate', 'c5.poisson-table', 'c5.which-distribution'],
      blocks: [
        ['p', 'The **Poisson distribution** counts events in a fixed interval of time or region of space, when the events are rare, random and independent: fatalities per 100 million miles, calls per hour, flaws per square meter.'],
        ['key', String.raw`$P(X = x) = \dfrac{e^{-\lambda}\lambda^x}{x!}$, for $x = 0, 1, 2, \ldots$, where $\lambda$ is the average number of events in the interval. Mean and variance are both $\lambda$.`],
        ['warn', String.raw`$\lambda$ must match the interval asked about. If deaths occur at 1.5 per 100 million miles, then over 200 million miles $\lambda = 3$, and over 50 million miles $\lambda = 0.75$.`],
        [
          'ex',
          {
            n: '5.8',
            q: 'Traffic fatalities occur at a rate of 1.5 per 100 million miles, following a Poisson distribution. Find the probability of (a) no deaths in 100 million miles; (b) at least one; (c) more than one. (d) Give the mean, variance and standard deviation. (e) Find the probability of exactly 2 deaths in 200 million miles; (f) fewer than 2 deaths in 50 million miles.',
            a: [
              '$X$ = deaths in 100 million miles: Poisson with $\\lambda = 1.5$.',
              String.raw`(a) $P(X = 0) = \dfrac{e^{-1.5}(1.5)^0}{0!} = $ poissonpdf(1.5, 0) $= 0.2231$.`,
              String.raw`(b) $P(X \ge 1) = 1 - P(X = 0) = 1 - 0.2231 = 0.7769$.`,
              String.raw`(c) $P(X > 1) = 1 - P(X \le 1) = 1 - $ poissoncdf(1.5, 1) $= 0.4422$.`,
              String.raw`(d) $\mu = 1.5$, $\sigma^2 = 1.5$, $\sigma = \sqrt{1.5} = 1.225$.`,
              String.raw`(e) $Y$ = deaths in 200 million miles has $\lambda = 3$: $P(Y = 2) = $ poissonpdf(3, 2) $= 0.2240$.`,
              String.raw`(f) $Z$ = deaths in 50 million miles has $\lambda = 0.75$: $P(Z < 2) = P(Z \le 1) = $ poissoncdf(0.75, 1) $= 0.8266$.`,
            ],
            answer: '(a) 0.2231 (b) 0.7769 (c) 0.4422 (d) 1.5, 1.5, 1.225 (e) 0.2240 (f) 0.8266.',
            problem: 'c5.poisson-basics',
            case: 0,
            checks: () => [
              ['(a)', poisPmf(0, 1.5), 0.2231, 5e-5],
              ['(b)', 1 - poisPmf(0, 1.5), 0.7769, 5e-5],
              ['(c)', 1 - poisCdf(1, 1.5), 0.4422, 5e-5],
              ['(d) σ', Math.sqrt(1.5), 1.225, 5e-4],
              ['(e)', poisPmf(2, 3), 0.224, 5e-5],
              ['(f)', poisCdf(1, 0.75), 0.8266, 5e-5],
            ],
          },
        ],
        ['fix', 'In part (b) the notes compute 1 − 0.2231 = 0.7669. The subtraction gives 0.7769.'],
        ['ti', ['2nd VARS ▸ poissonpdf($\\lambda$, x) for $P(X = x)$; poissoncdf($\\lambda$, x) for $P(X \\le x)$.']],
        [
          'table',
          {
            head: ['', 'Binomial', 'Geometric', 'Poisson'],
            rows: [
              ['$X$ counts', 'successes in $n$ trials', 'trials to the first success', 'events in an interval'],
              ['values', '$0, 1, \\ldots, n$', '$1, 2, 3, \\ldots$', '$0, 1, 2, \\ldots$'],
              ['mean', '$np$', '$1/p$', '$\\lambda$'],
              ['variance', '$np(1-p)$', '$(1-p)/p^2$', '$\\lambda$'],
            ],
            note: 'Which one? A fixed number of trials: binomial. Trials until something first happens: geometric. A rate per unit of time or space, with no fixed number of trials: Poisson.',
          },
        ],
      ],
    },
  ],
};
