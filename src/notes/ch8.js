/**
 * Chapter 8, rewritten from the teacher's notes (Ch 8, pp. 95–128). The notes pose these examples and
 * work them on the TI-84 in class; every answer here is computed. Example numbers are the notes'.
 */
import { tCdf } from '../stats/dist.js';
import { tTable, zCritTable } from '../stats/tables.js';
import { zTest, zInterval, tTest, tInterval, propTest, propInterval, mean, sd } from '../stats/infer.js';

const CANDY = [19.68, 20.66, 19.56, 19.98, 20.65, 19.61, 20.55, 20.36, 21.02, 21.5, 19.74];
const SONGS = [201, 257, 284, 208, 179, 222, 217, 206, 240];

const r2 = (x) => Math.round(x * 100) / 100;
const tt = (a, df) => {
  const v = tTable(a, df);
  return typeof v === 'number' ? v : v.value;
};

const FOUR_STEPS = [
  'State $H_0$ and $H_1$.',
  'Compute the test statistic.',
  'Find the p-value. If p-value $< \\alpha$, reject $H_0$; otherwise, fail to reject $H_0$.',
  'State the conclusion in context: "There is (not) sufficient evidence to conclude [$H_1$ in words]."',
];

export default {
  ch: '8',
  title: 'One-sample inference',
  lede: String.raw`With one sample in hand, what can we say about the population it came from? This chapter gives the two answers the rest of the course uses: a confidence interval, a range of plausible values for a mean or a proportion, and a hypothesis test, which asks whether the data contradict a claimed value and measures how strongly with a p-value.`,
  sections: [
    {
      id: '8.1',
      title: 'Point estimates and confidence intervals',
      problems: ['c8.z-interval', 'c8.ci-meaning'],
      blocks: [
        ['p', '**Statistical inference** draws conclusions about a population from a sample. It has two parts: estimating parameters, and testing hypotheses.'],
        [
          'table',
          {
            head: ['Parameter', 'Point estimate'],
            rows: [
              ['population mean $\\mu$', 'sample mean $\\bar{x}$'],
              ['population variance $\\sigma^2$', 'sample variance $s^2$'],
              ['population proportion $p$', 'sample proportion $\\hat{p}$'],
            ],
          },
        ],
        [
          'ex',
          {
            n: '8.1',
            q: 'A random sample of 44 breakfast sandwiches from a fast-food restaurant has mean sodium content 925 mg. Give a point estimate of the mean sodium content of all its sandwiches.',
            a: ['The sample mean estimates the population mean.'],
            answer: String.raw`$\bar{x} = 925$ mg.`,
          },
        ],
        ['def', 'Unbiased estimator:', String.raw`one whose sampling distribution is centered on the parameter, $E(\hat{\Theta}) = \theta$. Of two unbiased estimators, the one with the smaller variance is **more efficient**.`],
        ['p', 'Even a good point estimate is almost never exactly right. A **confidence interval** gives a range of plausible values:'],
        ['key', String.raw`point estimate $\pm E$, where the margin of error is $E = \text{critical value} \times \text{standard error of the estimate}$. The confidence level (90%, 95%, 99%) is how often intervals built this way contain the parameter.`],
        ['key', String.raw`**Z-interval** for $\mu$, $\sigma$ known: $\bar{x} \pm z_{\alpha/2}\,\dfrac{\sigma}{\sqrt{n}}$. Needs a roughly normal population OR $n \ge 30$.`],
        [
          'ex',
          {
            n: '8.2',
            q: 'For the 44 sandwiches ($\\bar{x} = 925$ mg), find a 90% confidence interval for the mean sodium content, if the population standard deviation is 18 mg.',
            a: [
              String.raw`$n = 44 \ge 30$. ✓ 90% confidence: $\alpha = 0.10$, $z_{0.05} = 1.645$.`,
              String.raw`$E = 1.645 \times \dfrac{18}{\sqrt{44}} = 1.645 \times 2.7136 = 4.46$.`,
              String.raw`$925 \pm 4.46$: $(920.54,\ 929.46)$.`,
            ],
            answer: 'We are 90% confident the mean sodium content is between 920.54 and 929.46 mg.',
            problem: 'c8.z-interval',
            case: 0,
            checks: () => {
              const I = zInterval({ xbar: 925, sigma: 18, n: 44, conf: 0.9 });
              return [
                ['z', zCritTable(0.05).z, 1.645, 1e-9],
                ['lo', I.lo, 920.54, 5e-3],
                ['hi', I.hi, 929.46, 5e-3],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ 7:ZInterval.', 'Inpt: Stats (summary numbers given) or Data (a list in L1). Enter $\\sigma$, $\\bar{x}$, $n$, C-Level, then Calculate.']],
        ['why', 'The 95% belongs to the method, not to one interval: any one interval either contains $\\mu$ or does not. The CI coverage lab draws 100 intervals at once.'],
      ],
    },
    {
      id: '8.2',
      title: 'Hypothesis tests, p-values and errors',
      lab: 'power',
      problems: ['c8.hypotheses', 'c8.errors'],
      blocks: [
        ['def', 'Null hypothesis $H_0$:', 'the statement being tested: no change, no effect, no difference. It is assumed true until the evidence says otherwise. It always contains the equals sign.'],
        ['def', 'Alternative hypothesis $H_1$:', 'what we are trying to find evidence for. Its sign ($<$, $>$ or $\\ne$) makes the test left-, right- or two-tailed.'],
        [
          'ex',
          {
            n: '8.3',
            q: 'Give $H_0$, $H_1$ and the tail. (a) 2% of children on competing antibiotics get headaches; is the percentage for a new antibiotic more than 2%? (b) The Blue Book price of a used three-year-old Corvette is 86,012 dollars; is the mean price in Miami different? (c) An old filling machine has standard deviation 0.23 ounce; does a new machine have less variability?',
            a: [
              '(a) $H_0: p = 0.02$, $H_1: p > 0.02$. Right-tailed.',
              '(b) $H_0: \\mu = 86{,}012$, $H_1: \\mu \\ne 86{,}012$. Two-tailed.',
              '(c) $H_0: \\sigma = 0.23$, $H_1: \\sigma < 0.23$. Left-tailed.',
            ],
            problem: 'c8.hypotheses',
            case: 0,
          },
        ],
        ['p', 'There are two possible decisions: **reject $H_0$** (the evidence favors $H_1$) or **fail to reject $H_0$**. We never "accept" $H_0$: failing to find evidence against it does not prove it.'],
        ['def', 'p-value:', 'the probability, assuming $H_0$ is true, of a sample statistic at least as extreme as the one observed. Small p-value = strong evidence against $H_0$.'],
        ['key', 'If p-value $< \\alpha$, reject $H_0$. If p-value $\\ge \\alpha$, fail to reject. $\\alpha$, the **significance level**, is chosen in advance (0.01, 0.05, 0.10).'],
        [
          'table',
          {
            head: ['', 'Reject $H_0$', 'Fail to reject $H_0$'],
            rows: [
              ['$H_0$ true', 'Type I error', 'correct'],
              ['$H_0$ false', 'correct', 'Type II error'],
            ],
            note: String.raw`$\alpha = P(\text{Type I error})$ and $\beta = P(\text{Type II error})$. The power of the test is $1 - \beta$.`,
          },
        ],
        [
          'ex',
          {
            n: '8.4',
            q: 'The restaurant claims its sandwich’s mean sodium is 920 mg; skeptics test $H_1: \\mu > 920$. Explain (a) a Type I error; (b) a Type II error, in context.',
            a: [
              '(a) Type I: concluding the mean sodium is more than 920 mg when it really is 920 mg (rejecting a true $H_0$).',
              '(b) Type II: failing to conclude the mean is more than 920 mg when it really is higher (not rejecting a false $H_0$).',
            ],
            problem: 'c8.errors',
            case: 0,
          },
        ],
        ['why', 'Lowering $\\alpha$ makes Type I errors rarer but Type II errors more common; only a bigger sample lowers both. The errors-and-power lab shows the trade.'],
      ],
    },
    {
      id: '8.3',
      title: 'The z test for a mean (σ known)',
      lab: 'power',
      problems: ['c8.z-test', 'c8.z-test-data', 'c8.ci-and-test'],
      blocks: [
        ['p', 'Assumption: a roughly normal population, or $n \\ge 30$. Then the four steps:'],
        ['steps', FOUR_STEPS],
        ['key', String.raw`$z_0 = \dfrac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}$. p-value: $P(Z > z_0)$ right-tailed, $P(Z < z_0)$ left-tailed, $2P(Z > |z_0|)$ two-tailed.`],
        [
          'ex',
          {
            n: '8.5',
            q: 'A restaurant claims its sandwich has mean sodium 920 mg; skeptics think it is higher. A sample of 44 has mean 925 mg; $\\sigma = 18$ mg. Test at $\\alpha = 0.1$.',
            a: [
              '$H_0: \\mu = 920$, $H_1: \\mu > 920$ (right-tailed). $n = 44 \\ge 30$. ✓',
              String.raw`$z_0 = \dfrac{925 - 920}{18/\sqrt{44}} = \dfrac{5}{2.7136} = 1.84$.`,
              'p-value $= P(Z > 1.84) = 0.0327$ (Z-Test gives 0.0327).',
              '$0.0327 < 0.1$: reject $H_0$.',
            ],
            answer: 'There is sufficient evidence to conclude the mean sodium content is higher than 920 mg.',
            problem: 'c8.z-test',
            case: 0,
            checks: () => {
              const T = zTest({ xbar: 925, sigma: 18, n: 44, mu0: 920, side: 'right' });
              return [
                ['z', r2(T.z), 1.84, 0],
                ['p', T.p, 0.0327, 5e-5],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ 1:Z-Test.', 'Inpt: Stats or Data; enter $\\mu_0$, $\\sigma$, then $\\bar{x}$ and $n$ (or the list); pick the alternative ($\\ne$, $<$, $>$). Calculate shows $z$ and p; Draw shades the p-value.']],
        [
          'ex',
          {
            n: '8.6',
            q: 'Snickers “fun size” bars should weigh 20 g; the machine is set to a mean of 20.1 g. An engineer weighs 11 bars (below) to see whether the machine needs recalibrating, at $\\alpha = 0.01$. Weights are normal with $\\sigma = 0.6$ g.',
            data: { rows: [CANDY.slice(0, 6), CANDY.slice(6)] },
            a: [
              '$H_0: \\mu = 20.1$, $H_1: \\mu \\ne 20.1$ (two-tailed: off in either direction is a problem).',
              String.raw`$\bar{x} = 223.31/11 = 20.30$; $z_0 = \dfrac{20.30 - 20.1}{0.6/\sqrt{11}} = \dfrac{0.2009}{0.1809} = 1.11$.`,
              'p-value $= 2P(Z > 1.11) = 0.2668$.',
              '$0.2668 \\ge 0.01$: fail to reject $H_0$.',
            ],
            answer: 'There is not sufficient evidence that the mean weight differs from 20.1 g: no need to shut down.',
            problem: 'c8.z-test-data',
            case: 0,
            checks: () => {
              const T = zTest({ xbar: mean(CANDY), sigma: 0.6, n: 11, mu0: 20.1, side: 'two' });
              return [
                ['sum', CANDY.reduce((a, b) => a + b, 0), 223.31, 1e-9],
                ['x̄', r2(mean(CANDY)), 20.3, 0],
                ['z', r2(T.z), 1.11, 0],
                ['p', T.p, 0.2668, 5e-5],
              ];
            },
          },
        ],
        ['key', 'Two-tailed test by interval: for $H_1: \\mu \\ne \\mu_0$ at level $\\alpha$, reject $H_0$ exactly when the $100(1 - \\alpha)\\%$ confidence interval does NOT contain $\\mu_0$.'],
        [
          'ex',
          {
            n: '8.7',
            q: 'Use a confidence interval to check the decision of Example 8.6.',
            a: [String.raw`$\alpha = 0.01$, so a 99% z-interval: $20.30 \pm 2.576 \times 0.1809 = 20.30 \pm 0.47$, which is $(19.83,\ 20.77)$.`, 'It contains 20.1.'],
            answer: 'Fail to reject $H_0$: the same decision as the test.',
            problem: 'c8.ci-and-test',
            case: 0,
            checks: () => {
              const I = zInterval({ xbar: mean(CANDY), sigma: 0.6, n: 11, conf: 0.99 });
              return [
                ['lo', I.lo, 19.83, 5e-3],
                ['hi', I.hi, 20.77, 5e-3],
              ];
            },
          },
        ],
      ],
    },
    {
      id: '8.4',
      title: 'Inference on a mean, σ unknown: the t distribution',
      lab: 'ci',
      problems: ['c8.t-critical', 'c8.t-prob', 'c8.t-interval', 'c8.t-test', 'c8.t-test-data'],
      blocks: [
        ['p', 'In practice $\\sigma$ is unknown and we use $s$. That adds uncertainty, and the $t$ distribution allows for it:'],
        [
          'list',
          [
            'continuous, bell-shaped, symmetric about 0, total area 1;',
            'a family of curves, one for each number of **degrees of freedom** (df, $\\nu$);',
            'thicker tails than the standard normal; as df grows, $t$ approaches $z$.',
          ],
        ],
        ['def', String.raw`$t_{\alpha,\nu}$:`, 'the value with area $\\alpha$ to its right under the $t$ curve with $\\nu$ df (Table A.4).'],
        [
          'ex',
          {
            n: '8.8',
            q: String.raw`(a) Find $t_{0.025,17}$. (b) Find $t_{0.005,13}$. (c) For $T$ with 10 df, find $P(T < 0.7)$.`,
            a: [
              '(a) Table A.4, row 17, column 0.025: 2.110.',
              '(b) Row 13, column 0.005: 3.012.',
              '(c) The table cannot give this; tcdf$(-10^{99}, 0.7, 10) = 0.7501$.',
            ],
            answer: '(a) 2.110 (b) 3.012 (c) 0.7501.',
            problem: 'c8.t-critical',
            case: 0,
            checks: () => [
              ['(a)', tt(0.025, 17), 2.11, 5e-4],
              ['(b)', tt(0.005, 13), 3.012, 5e-4],
              ['(c)', tCdf(0.7, 10), 0.7501, 5e-5],
            ],
          },
        ],
        ['key', String.raw`**T-interval**: $\bar{x} \pm t_{\alpha/2,\,n-1}\,\dfrac{s}{\sqrt{n}}$, for a sample from a roughly normal population with $\sigma$ unknown.`],
        [
          'ex',
          {
            n: '8.9',
            q: 'Marissa times 9 randomly chosen songs on her phone (seconds, below). Song lengths are normal. Find a 99% confidence interval for the mean song length.',
            data: { rows: [SONGS] },
            a: [
              String.raw`1-Var Stats: $\bar{x} = 223.78$, $s = 31.88$, $n = 9$.`,
              String.raw`$t_{0.005,8} = 3.355$; $E = 3.355 \times \dfrac{31.88}{\sqrt{9}} = 35.65$.`,
              String.raw`$223.78 \pm 35.65$: $(188.12,\ 259.44)$.`,
            ],
            answer: 'We are 99% confident the mean song length is between 188.1 and 259.4 seconds.',
            problem: 'c8.t-interval',
            case: 0,
            checks: () => {
              const I = tInterval({ xbar: mean(SONGS), s: sd(SONGS), n: 9, conf: 0.99 });
              return [
                ['x̄', mean(SONGS), 223.78, 5e-3],
                ['s', sd(SONGS), 31.88, 5e-3],
                ['t', tt(0.005, 8), 3.355, 5e-4],
                ['lo', I.lo, 188.12, 5e-3],
                ['hi', I.hi, 259.44, 5e-3],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ 8:TInterval. Inpt: Data (List L1, Freq 1) or Stats ($\\bar{x}$, $Sx$, $n$); C-Level; Calculate.']],
        ['key', String.raw`**T-test**: $t_0 = \dfrac{\bar{x} - \mu_0}{s/\sqrt{n}}$, with $n - 1$ degrees of freedom. Assumes a roughly normal population. Same four steps as the z test.`],
        [
          'ex',
          {
            n: '8.10',
            q: 'American men average 69.5 inches tall. A random sample of 43 NFL athletes has mean 70.78 inches and standard deviation 2.77. Are NFL athletes taller on average? Use $\\alpha = 0.05$.',
            a: [
              '$H_0: \\mu = 69.5$, $H_1: \\mu > 69.5$.',
              String.raw`$t_0 = \dfrac{70.78 - 69.5}{2.77/\sqrt{43}} = \dfrac{1.28}{0.4224} = 3.03$, df $= 42$.`,
              'p-value $= P(T > 3.03) = 0.0021$ (T-Test).',
              '$0.0021 < 0.05$: reject $H_0$.',
            ],
            answer: 'There is sufficient evidence that NFL athletes are taller than American men on average.',
            problem: 'c8.t-test',
            case: 0,
            checks: () => {
              const T = tTest({ xbar: 70.78, s: 2.77, n: 43, mu0: 69.5, side: 'right' });
              return [
                ['t', r2(T.t), 3.03, 0],
                ['p', T.p, 0.0021, 5e-5],
              ];
            },
          },
        ],
        [
          'ex',
          {
            n: '8.11',
            q: 'Marissa believes her songs average 240 seconds. Test this with the 9 songs of Example 8.9, at $\\alpha = 0.01$.',
            a: [
              '$H_0: \\mu = 240$, $H_1: \\mu \\ne 240$.',
              String.raw`$t_0 = \dfrac{223.78 - 240}{31.88/\sqrt{9}} = -1.53$, df $= 8$.`,
              'p-value $= 2P(T < -1.53) = 0.1654$.',
              '$0.1654 \\ge 0.01$: fail to reject $H_0$.',
            ],
            answer: 'There is not sufficient evidence that the mean song length differs from 240 seconds.',
            problem: 'c8.t-test-data',
            case: 0,
            checks: () => {
              const T = tTest({ xbar: mean(SONGS), s: sd(SONGS), n: 9, mu0: 240, side: 'two' });
              return [
                ['t', r2(T.t), -1.53, 0],
                ['p', T.p, 0.1654, 5e-5],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ 2:T-Test. Inpt: Data or Stats; $\\mu_0$; the alternative; Calculate or Draw.']],
        [
          'ex',
          {
            n: '8.12',
            q: 'Check Example 8.11 with a confidence interval.',
            a: ['$\\alpha = 0.01$, so use the 99% interval of Example 8.9: $(188.12, 259.44)$.', 'It contains 240.'],
            answer: 'Fail to reject $H_0$, as the test found.',
            problem: 'c8.ci-and-test',
            case: 1,
            checks: () => {
              const I = tInterval({ xbar: mean(SONGS), s: sd(SONGS), n: 9, conf: 0.99 });
              return [['240 inside', I.lo < 240 && 240 < I.hi ? 1 : 0, 1, 0]];
            },
          },
        ],
      ],
    },
    {
      id: '8.5',
      title: 'Inference on a proportion',
      lab: 'clt',
      problems: ['c8.prop-test', 'c8.prop-interval', 'c8.ci-and-test'],
      blocks: [
        ['p', String.raw`The sample proportion $\hat{p} = x/n$ estimates the population proportion $p$ (Example 8.13 repeats Example 7.7: $\hat{p} = 558/1016 = 0.5492$).`],
        ['key', String.raw`**One-proportion z-test**: $z_0 = \dfrac{\hat{p} - p_0}{\sqrt{p_0(1 - p_0)/n}}$. Assumption: $np_0(1 - p_0) \ge 10$.`],
        [
          'ex',
          {
            n: '8.14',
            q: 'A customer requires a defective rate below 0.05. In a random sample of 200 devices, 4 are defective. Does the manufacturer meet the requirement? Use $\\alpha = 0.05$.',
            a: [
              '$H_0: p = 0.05$, $H_1: p < 0.05$ (the claim to support is "below").',
              String.raw`$\hat{p} = 4/200 = 0.02$; $z_0 = \dfrac{0.02 - 0.05}{\sqrt{0.05(0.95)/200}} = \dfrac{-0.03}{0.01541} = -1.95$.`,
              'p-value $= P(Z < -1.95) = 0.0258$ (1-PropZTest).',
              '$0.0258 < 0.05$: reject $H_0$.',
            ],
            answer: 'There is sufficient evidence the defective rate is below 0.05.',
            problem: 'c8.prop-test',
            case: 1,
            checks: () => {
              const T = propTest({ x: 4, n: 200, p0: 0.05, side: 'left' });
              return [
                ['z', r2(T.z), -1.95, 0],
                ['p', T.p, 0.0258, 5e-5],
                ['np0q0', T.check, 9.5, 1e-9],
              ];
            },
          },
        ],
        ['fix', String.raw`Here $np_0(1 - p_0) = 200(0.05)(0.95) = 9.5$, just under the notes' own condition of 10. The notes run the test anyway; strictly, the normal approximation is not justified, so treat this p-value as approximate.`],
        [
          'ex',
          {
            n: '8.15',
            q: 'Someone claims 40% of a city’s adults are college graduates. In a random sample of 100 adults, 43 are. Test the claim at $\\alpha = 0.1$.',
            a: [
              '$H_0: p = 0.4$, $H_1: p \\ne 0.4$. $np_0(1-p_0) = 24 \\ge 10$. ✓',
              String.raw`$\hat{p} = 0.43$; $z_0 = \dfrac{0.43 - 0.4}{\sqrt{0.4(0.6)/100}} = \dfrac{0.03}{0.0490} = 0.61$.`,
              'p-value $= 2P(Z > 0.61) = 0.5403$.',
              '$0.5403 \\ge 0.1$: fail to reject $H_0$.',
            ],
            answer: 'There is not sufficient evidence that the proportion of college graduates differs from 40%.',
            problem: 'c8.prop-test',
            case: 0,
            checks: () => {
              const T = propTest({ x: 43, n: 100, p0: 0.4, side: 'two' });
              return [
                ['z', r2(T.z), 0.61, 0],
                ['p', T.p, 0.5403, 5e-5],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ 5:1-PropZTest: $p_0$, $x$, $n$, the alternative; Calculate or Draw.']],
        ['key', String.raw`**One-proportion z-interval**: $\hat{p} \pm z_{\alpha/2}\sqrt{\dfrac{\hat{p}(1 - \hat{p})}{n}}$. Assumption: $n\hat{p}(1 - \hat{p}) \ge 10$.`],
        ['fix', String.raw`The notes' box states the interval's condition as $n\hat{p}(1 - \hat{p}) \le 10$. It must be $\ge 10$: the sample has to be LARGE enough for the normal approximation.`],
        [
          'ex',
          {
            n: '8.16',
            q: 'For the 100 adults of Example 8.15 (43 graduates), find a 90% confidence interval for the proportion of college graduates.',
            a: [
              String.raw`$\hat{p} = 0.43$; $n\hat{p}(1-\hat{p}) = 24.5 \ge 10$. ✓`,
              String.raw`$E = 1.645\sqrt{\dfrac{0.43(0.57)}{100}} = 1.645 \times 0.0495 = 0.0814$.`,
              String.raw`$0.43 \pm 0.0814$: $(0.3486,\ 0.5114)$.`,
            ],
            answer: 'We are 90% confident between 34.9% and 51.1% of the city’s adults are college graduates.',
            problem: 'c8.prop-interval',
            case: 0,
            checks: () => {
              const I = propInterval({ x: 43, n: 100, conf: 0.9 });
              return [
                ['check', I.check, 24.51, 5e-3],
                ['lo', I.lo, 0.3486, 5e-5],
                ['hi', I.hi, 0.5114, 5e-5],
              ];
            },
          },
        ],
        ['ti', ['STAT ▸ TESTS ▸ A:1-PropZInt: $x$, $n$, C-Level; Calculate.']],
        [
          'ex',
          {
            n: '8.17',
            q: 'Use a confidence interval to check the decision of Example 8.15.',
            a: ['$\\alpha = 0.1$: use the 90% interval of Example 8.16, $(0.3486, 0.5114)$. It contains 0.4.'],
            answer: 'Fail to reject $H_0$, the same as the test.',
            checks: () => {
              const I = propInterval({ x: 43, n: 100, conf: 0.9 });
              return [['0.4 inside', I.lo < 0.4 && 0.4 < I.hi ? 1 : 0, 1, 0]];
            },
          },
        ],
        ['warn', String.raw`For a proportion the match between test and interval is close but not exact: the test's standard error uses $p_0$, the interval's uses $\hat{p}$. When $p_0$ sits right at an end of the interval the two can disagree; the test is the one to report.`],
      ],
    },
  ],
};
