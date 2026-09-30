/**
 * Chapter 10, rewritten from the teacher's notes (Ch 10, pp. 171–181). The notes pose these examples
 * and work them on the TI-84 in class; every answer here is computed. Example numbers are the notes'.
 */
import { linRegTest } from '../stats/infer.js';

const STEAM_X = [21, 24, 32, 47, 50, 59, 68, 74, 62, 50, 41, 30];
const STEAM_Y = [185.79, 214.47, 288.03, 424.84, 454.58, 539.03, 621.55, 675.06, 562.03, 452.93, 369.95, 273.98];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NOISE_X = [1, 0, 1, 2, 5, 1, 4, 6, 2, 3];
const NOISE_Y = [70, 63, 65, 70, 70, 70, 80, 75, 80, 80];

const steam = () => linRegTest({ xs: STEAM_X, ys: STEAM_Y, side: 'two' });

export default {
  ch: '10',
  title: 'Simple linear regression',
  lede: String.raw`When two quantitative variables are measured on the same individuals, a scatter plot shows how they move together and a straight line can summarize it. This chapter fits that line by least squares, measures the strength of the relation with the correlation coefficient, and tests whether an apparent linear relation is real.`,
  sections: [
    {
      id: '10.1',
      title: 'Bivariate data and scatter plots',
      lab: 'reg',
      problems: ['c10.association'],
      blocks: [
        ['p', 'A **univariate** data set measures one variable on each individual; a **bivariate** data set measures two. The **response variable** $Y$ is the one explained by the **explanatory** (predictor) variable $X$.'],
        [
          'ex',
          {
            n: '10.1',
            q: 'A chemical plant’s monthly steam usage (pounds) is thought to depend on the month’s average temperature (°F). Last year’s data are below. Which is the response, and what does a scatter plot show?',
            data: { head: ['Month', 'Temp. $x$', 'Usage $y$'], rows: MONTHS.map((m, i) => [m, STEAM_X[i], STEAM_Y[i].toFixed(2)]) },
            a: ['Usage depends on temperature: temperature is $X$ (explanatory), usage is $Y$ (response).', 'Plot each month as a point $(x, y)$. The points rise almost exactly along a straight line.'],
            answer: 'A strong, positive, linear relation.',
            problem: 'c10.association',
            case: 0,
          },
        ],
        ['ti', ['STAT ▸ 1:Edit: $x$ in L1, $y$ in L2.', '2nd Y= ▸ 1:Plot1: On, Type: scatter (the first icon), Xlist: L1, Ylist: L2.', 'ZOOM ▸ 9:ZoomStat.']],
      ],
    },
    {
      id: '10.2',
      title: 'The least-squares line',
      lab: 'reg',
      problems: ['c10.fit', 'c10.interpret'],
      blocks: [
        ['key', String.raw`The fitted line is $\hat{y} = a + bx$, with slope $b = \dfrac{S_{xy}}{S_{xx}} = \dfrac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}$ and intercept $a = \bar{y} - b\bar{x}$.`],
        ['why', 'Of all straight lines, this one makes the sum of the squared vertical distances from the points (the residuals $y_i - \\hat{y}_i$) as small as possible: "least squares".'],
        [
          'ex',
          {
            n: '10.2',
            q: 'For the steam data: (a) fit the regression line; (b) interpret the slope; (c) interpret the intercept; (d) predict usage at 10°F; (e) and at 60°F; (f) find and interpret $R^2$.',
            a: [
              String.raw`(a) LinReg(a+bx): $\hat{y} = -6.336 + 9.208x$.`,
              '(b) Each 1°F rise in average temperature goes with an estimated 9.208 more pounds of steam per month, on average.',
              '(c) At 0°F the line gives −6.336 pounds, which is impossible. The intercept has no practical meaning here: 0°F is far outside the temperatures observed (21°F to 74°F).',
              String.raw`(d) $\hat{y} = -6.336 + 9.208(10) = 85.75$ pounds. But 10°F is outside the data: this is an **extrapolation**, and the line may not hold there.`,
              String.raw`(e) $\hat{y} = -6.336 + 9.208(60) = 546.17$ pounds: inside the data's range, so a reasonable prediction.`,
              String.raw`(f) $R^2 = 0.9999$: 99.99% of the variation in steam usage is explained by the linear relation with temperature.`,
            ],
            problem: 'c10.fit',
            case: 0,
            checks: () => {
              const R = steam();
              return [
                ['a', R.a, -6.336, 5e-4],
                ['b', R.b, 9.208, 5e-4],
                ['ŷ(10)', R.a + R.b * 10, 85.75, 5e-3],
                ['ŷ(60)', R.a + R.b * 60, 546.17, 5e-3],
                ['R²', R.r2, 0.9999, 5e-5],
              ];
            },
          },
        ],
        ['fix', 'The notes ask for a prediction at 10°F without comment. 10°F is below every temperature in the data, so it is an extrapolation; the answer is what the line says, not something the data support.'],
        ['ti', ['STAT ▸ CALC ▸ 8:LinReg(a+bx), Xlist: L1, Ylist: L2 (leave FreqList and Store RegEQ empty); Calculate.', 'With DiagnosticOn (below) it also shows $r^2$ and $r$.']],
        ['def', 'Coefficient of determination $R^2$:', 'the share of the variation in $y$ explained by the line, between 0 and 1. For a straight-line fit it equals $r^2$.'],
      ],
    },
    {
      id: '10.3',
      title: 'Correlation and the test for a linear relation',
      lab: 'reg',
      problems: ['c10.correlation-test', 'c10.association'],
      blocks: [
        ['p', 'Two linearly related variables are **positively associated** if one tends to increase as the other does, and **negatively associated** if one decreases as the other increases.'],
        ['def', 'Correlation coefficient $r$:', 'measures the strength and direction of a LINEAR relation, $-1 \\le r \\le 1$. Near $\\pm 1$: points close to a line. Near 0: no linear relation (there may still be a curved one).'],
        ['key', String.raw`Test for a linear relation (LinRegTTest): $H_0: \beta = 0$ (no linear relation) vs $H_1: \beta \ne 0$, $> 0$ or $< 0$. $t_0 = \dfrac{r\sqrt{n - 2}}{\sqrt{1 - r^2}}$ with $n - 2$ df.`],
        [
          'ex',
          {
            n: '10.3',
            q: 'For the steam data, find $r$ and test whether temperature and usage are linearly related, at $\\alpha = 0.05$.',
            a: [
              '$r = 0.99993$: an extremely strong positive linear relation.',
              '$H_0: \\beta = 0$, $H_1: \\beta \\ne 0$. LinRegTTest: $t_0 = 272.6$ on 10 df, p-value $\\approx 1 \\times 10^{-20}$.',
              'p-value $< 0.05$: reject $H_0$.',
            ],
            answer: 'There is sufficient evidence that temperature and steam usage are linearly related.',
            problem: 'c10.correlation-test',
            case: 1,
            checks: () => {
              const R = steam();
              return [
                ['r', R.r, 0.99993, 5e-6],
                ['t', R.t, 272.6, 0.05],
                ['p < 1e-19', R.p < 1e-19 ? 1 : 0, 1, 0],
              ];
            },
          },
        ],
        ['ti', ['Once: 2nd 0 (CATALOG) ▸ DiagnosticOn ▸ ENTER ENTER, so LinReg shows $r$.', 'STAT ▸ TESTS ▸ F:LinRegTTest, Xlist: L1, Ylist: L2, choose the alternative ($\\beta$ & $\\rho$ $\\ne$, $<$, $>$ 0); Calculate.']],
        [
          'ex',
          {
            n: '10.4',
            q: 'Noise exposure (sound pressure level) and blood pressure rise (mm Hg) for 10 people (below). Find $r$ and test whether they are positively correlated, at $\\alpha = 0.05$.',
            data: { head: ['Noise $x$', ...NOISE_X], rows: [['BP rise $y$', ...NOISE_Y]] },
            a: [
              'LinReg: $\\hat{y} = 68.13 + 1.667x$, $r = 0.5262$: a moderate positive linear relation.',
              '$H_0: \\beta = 0$, $H_1: \\beta > 0$. $t_0 = \\dfrac{0.5262\\sqrt{8}}{\\sqrt{1 - 0.5262^2}} = 1.75$ on 8 df; p-value $= 0.0591$.',
              '$0.0591 \\ge 0.05$: fail to reject $H_0$.',
            ],
            answer: 'There is not sufficient evidence (at the 0.05 level) of a positive linear relation between noise exposure and blood pressure rise.',
            problem: 'c10.correlation-test',
            case: 0,
            checks: () => {
              const R = linRegTest({ xs: NOISE_X, ys: NOISE_Y, side: 'right' });
              return [
                ['r', R.r, 0.5262, 5e-5],
                ['t', R.t, 1.75, 5e-3],
                ['p', R.p, 0.0591, 5e-5],
                ['b', R.b, 1.667, 5e-4],
              ];
            },
          },
        ],
        ['warn', 'Correlation is not causation, and $r$ only measures LINEAR relations. Always look at the scatter plot: a curve can have a high $r$ (and a U-shaped residual plot), and one outlier far out in $x$ can make or break it. The regression lab shows both.'],
      ],
    },
  ],
};
