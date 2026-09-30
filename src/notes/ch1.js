/**
 * Chapter 1, rewritten from the teacher's notes (Ch 1, pp. 4–25). Example numbers are the notes'.
 */
import { mean, median, sd, fiveNumber, boxPlot, range } from '../stats/describe.js';

const BATTERIES = [
  2.2, 4.1, 3.5, 4.5, 3.2, 3.7, 3.0, 2.6, 3.4, 1.6, 3.1, 3.3, 3.8, 3.1, 4.7, 3.7, 2.5, 4.3, 3.4, 3.6, 2.9, 3.3, 3.9, 3.1, 3.3, 3.1, 3.7, 4.4,
  3.2, 4.1, 1.9, 3.4, 4.7, 3.8, 3.2, 2.6, 3.9, 3.0, 4.2, 3.5,
];
const NO_N = [0.32, 0.53, 0.28, 0.37, 0.47, 0.43, 0.36, 0.42, 0.38, 0.43];
const WITH_N = [0.26, 0.43, 0.47, 0.49, 0.52, 0.75, 0.79, 0.86, 0.62, 0.46];
const CALLS = [1, 2, 3, 7, 4, 5, 4, 3, 3, 1, 48, 6];
const ORINGS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3];
const SCORES = [82, 77, 90, 71, 62, 68, 74, 84, 94, 88];
const INJURIES =
  'Hip Back Back Back Hand Neck Knee Knee Knee Hand Knee Shoulder Wrist Back Groin Shoulder Shoulder Back Knee Back Hip Shoulder Elbow Back Back Back Back Back Back Wrist'.split(' ');
const CLAIMS = [6751, 9908, 3461, 2336, 21147, 2332, 189, 1185, 370, 1414, 4668, 1953, 10034, 735, 802, 618, 180, 1657];

const count = (xs, lo, hi) => xs.filter((x) => x >= lo - 1e-9 && x <= hi + 1e-9).length;
const tally = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());

export default {
  ch: '1',
  title: 'Statistics and data analysis',
  sections: [
    {
      id: '1.1',
      title: 'Basic concepts',
      problems: ['c1.parameter-statistic'],
      blocks: [
        ['p', '**Statistics** is the science of collecting, organizing, summarizing and analyzing information to draw conclusions and answer questions.'],
        ['def', 'Population.', 'All the observations we are concerned with.'],
        ['def', 'Sample.', 'The part of the population actually studied, used to learn about the whole.'],
        ['def', 'Individual.', 'One person or object in the population or sample.'],
        [
          'ex',
          {
            n: '1.1',
            q: 'An engineer wants the average tensile strength of a type of steel rod in this month’s production batch. The plant makes 50,000 rods this month; the engineer tests 100 chosen at random. Identify the population and the sample.',
            a: ['Population: all 50,000 steel rods produced this month.', 'Sample: the 100 rods selected and tested.'],
          },
        ],
        ['def', 'Parameter.', 'A number that describes a POPULATION (the average tensile strength of all 50,000 rods).'],
        ['def', 'Statistic.', 'A number that describes a SAMPLE (the average strength of the 100 tested).'],
        ['key', 'Parameter ↔ Population, Statistic ↔ Sample: the first letters match.'],
        [
          'ex',
          {
            n: '1.2',
            q: 'Suppose 48.2% of ALL students on your campus own a car. Is 48.2% a parameter or a statistic?',
            a: ['It describes every student on campus, the population.'],
            answer: 'Parameter.',
            problem: 'c1.parameter-statistic',
            case: 0,
          },
        ],
        [
          'ex',
          {
            n: '1.3',
            q: 'A sample of 100 students finds that 46% own a car. Parameter or statistic?',
            a: ['It describes the 100 students sampled.'],
            answer: 'Statistic.',
            problem: 'c1.parameter-statistic',
            case: 1,
          },
        ],
      ],
    },
    {
      id: '1.2',
      title: 'Sampling',
      blocks: [
        ['def', 'Census.', 'Data from every individual in the population. Complete, but time-consuming and costly for a large population (the U.S. census runs every 10 years).'],
        ['def', 'Simple random sample.', 'A sample of size $n$ chosen so that every individual has an equally likely chance of being chosen.'],
        ['p', 'The key is to let chance, not convenience, pick the sample. A sample chosen because it was easy to reach (a **convenience sample**) can be biased, and its results are meaningless for the population.'],
        [
          'ex',
          {
            n: '1.4',
            q: 'An accounting firm wants to survey a simple random sample of 5 of its 30 clients, numbered 01 to 30. How can the TI-84 choose them?',
            a: ['Number the clients 1 to 30.', 'Draw 5 random integers from 1 to 30 with randInt (below).', 'If a number repeats, draw again until you have 5 different clients.'],
          },
        ],
        ['ti', ['MATH ▸ PROB ▸ 5:randInt(', 'lower: 1, upper: 30, n: 5, then Paste and ENTER.', 'Repeated a number? Press ENTER again for a new draw. (8:randIntNoRep( gives no repeats at all.)']],
      ],
    },
    {
      id: '1.3',
      title: 'Types of data',
      problems: ['c1.data-type'],
      blocks: [
        ['def', 'Qualitative (categorical) data', 'are labels or categories: eye colour, type of car. A number used as a label is still qualitative: a zip code or a Social Security number means nothing when averaged.'],
        ['def', 'Quantitative (numerical) data', 'are measured or counted quantities, of two kinds:'],
        ['list', ['**Discrete:** only separate values, usually counts (students in a class, cars in a lot).', '**Continuous:** any value in a range (height, weight, temperature, time).']],
        ['warn', 'Ask "does the average make sense?" If not, the data are qualitative, however they are written down.'],
      ],
    },
    {
      id: '1.4',
      title: 'Graphical displays',
      lab: 'describe',
      problems: ['c1.frequency'],
      blocks: [
        ['p', 'A **stem-and-leaf plot** splits each value into a stem (leading digits) and a leaf (the last digit). It shows the shape and keeps every value.'],
        [
          'ex',
          {
            n: '1.5',
            q: 'The lives, in years, of 40 similar car batteries. Make a stem-and-leaf plot and a relative frequency table.',
            data: {
              rows: [
                [2.2, 4.1, 3.5, 4.5, 3.2, 3.7, 3.0, 2.6],
                [3.4, 1.6, 3.1, 3.3, 3.8, 3.1, 4.7, 3.7],
                [2.5, 4.3, 3.4, 3.6, 2.9, 3.3, 3.9, 3.1],
                [3.3, 3.1, 3.7, 4.4, 3.2, 4.1, 1.9, 3.4],
                [4.7, 3.8, 3.2, 2.6, 3.9, 3.0, 4.2, 3.5],
              ],
            },
            a: [
              'Stems are the whole years 1 to 4, leaves the tenths. Stem 1: 6 9; stem 2: 2 5 6 6 9; stem 3: 0 0 1 1 1 1 2 2 2 3 3 3 4 4 4 5 5 6 7 7 7 8 8 9 9; stem 4: 1 1 2 3 4 5 7 7. Frequencies 2, 5, 25, 8.',
              'Four stems squeeze the picture. A **double-stem** plot writes each stem twice: $\\star$ for leaves 0–4 and $\\cdot$ for leaves 5–9. Frequencies: 1· 2, 2⋆ 1, 2· 4, 3⋆ 15, 3· 10, 4⋆ 5, 4· 3.',
              'Classes of width 0.5 (1.5–1.9, 2.0–2.4, …) give the frequency table below. Relative frequency = frequency ÷ 40.',
            ],
            answer: 'The most common lifetime is 3.0 to 3.4 years (15 of the 40, relative frequency 0.375).',
            problem: 'c1.frequency',
            checks: () => [
              ...[[1.5, 1.9, 2], [2.0, 2.4, 1], [2.5, 2.9, 4], [3.0, 3.4, 15], [3.5, 3.9, 10], [4.0, 4.4, 5], [4.5, 4.9, 3]].map(([lo, hi, f]) => [`class ${lo}–${hi}`, count(BATTERIES, lo, hi), f, 0]),
              ['n', BATTERIES.length, 40, 0],
              ['stem 3', count(BATTERIES, 3.0, 3.9), 25, 0],
            ],
          },
        ],
        [
          'table',
          {
            head: ['Class', 'Midpoint', 'Frequency', 'Relative frequency'],
            rows: [
              ['1.5–1.9', 1.7, 2, 0.05],
              ['2.0–2.4', 2.2, 1, 0.025],
              ['2.5–2.9', 2.7, 4, 0.1],
              ['3.0–3.4', 3.2, 15, 0.375],
              ['3.5–3.9', 3.7, 10, 0.25],
              ['4.0–4.4', 4.2, 5, 0.125],
              ['4.5–4.9', 4.7, 3, 0.075],
            ],
            note: 'Classes must have equal widths and must not overlap. The relative frequencies add to 1.',
          },
        ],
        ['p', 'A **histogram** draws each class as a bar over its interval, with height equal to its frequency or relative frequency. The shape it shows has a name:'],
        [
          'list',
          [
            '**Skewed left** (long tail on the left): age at retirement, lifetime of a durable product.',
            '**Symmetric:** adult heights, IQ scores.',
            '**Skewed right** (long tail on the right): incomes, house prices.',
          ],
        ],
        ['warn', 'The skew is named for the side of the TAIL, not the side where most of the data sit.'],
        ['ti', ['STAT ▸ 1:Edit, and type the data into L1.', '2nd Y= (STAT PLOT) ▸ 1:Plot1: On, Type: the histogram icon, Xlist: L1, Freq: 1.', 'ZOOM ▸ 9:ZoomStat. (WINDOW sets Xscl, the class width.)']],
      ],
    },
    {
      id: '1.5',
      title: 'Measures of location: mean, median, mode',
      lab: 'describe',
      problems: ['c1.mean-median', 'c1.which-center', 'c1.mode'],
      blocks: [
        ['key', String.raw`Population mean (a parameter): $\mu = \dfrac{x_1 + x_2 + \cdots + x_N}{N}$. Sample mean (a statistic): $\bar{x} = \dfrac{x_1 + x_2 + \cdots + x_n}{n}$.`],
        ['p', String.raw`The **median** $\tilde{x}$ is the middle of the data in ascending order. Sort the data and count $n$:`],
        ['list', [String.raw`$n$ odd: the median is the value in position $\frac{n+1}{2}$ (for 7, 8, 9 it is the 2nd value, 8).`, String.raw`$n$ even: the median is the mean of the values in positions $\frac{n}{2}$ and $\frac{n}{2} + 1$ (for 7, 8, 9, 10 it is $(8 + 9)/2 = 8.5$).`]],
        [
          'ex',
          {
            n: '1.6',
            q: 'Stem weights (grams) of 10 northern red oak seedlings grown without nitrogen, and 10 with nitrogen. Find the sample mean and median of each group.',
            data: { head: ['No nitrogen', 'Nitrogen'], rows: NO_N.map((x, i) => [x, WITH_N[i]]) },
            a: [
              String.raw`No nitrogen: $\bar{x} = \dfrac{0.32 + 0.53 + \cdots + 0.43}{10} = \dfrac{3.99}{10} = 0.399$.`,
              String.raw`Sorted: 0.28, 0.32, 0.36, 0.37, **0.38**, **0.42**, 0.43, 0.43, 0.47, 0.53. With $n = 10$ the middle values are the 5th and 6th: $\tilde{x} = \dfrac{0.38 + 0.42}{2} = 0.40$.`,
              String.raw`Nitrogen (your turn, same steps): $\bar{x} = 5.65/10 = 0.565$; sorted, the 5th and 6th values are 0.49 and 0.52, so $\tilde{x} = 0.505$.`,
            ],
            answer: 'No nitrogen: mean 0.399, median 0.40. Nitrogen: mean 0.565, median 0.505.',
            problem: 'c1.mean-median',
            checks: () => [
              ['no-N sum', NO_N.reduce((a, b) => a + b, 0), 3.99, 1e-9],
              ['no-N mean', mean(NO_N), 0.399, 1e-9],
              ['no-N median', median(NO_N), 0.4, 1e-9],
              ['N mean', mean(WITH_N), 0.565, 1e-9],
              ['N median', median(WITH_N), 0.505, 1e-9],
            ],
          },
        ],
        ['ti', ['STAT ▸ 1:Edit: data in L1.', 'STAT ▸ CALC ▸ 1:1-Var Stats, List: L1, FreqList empty, Calculate.', String.raw`It shows $\bar{x}$, $\Sigma x$, $\Sigma x^2$, $Sx$ (the sample $s$), $\sigma x$ (the population $\sigma$), $n$, and (scroll down) minX, Q1, Med, Q3, maxX.`]],
        [
          'ex',
          {
            n: '1.7',
            q: 'Yolanda times 12 random calls on her phone (minutes): 1, 2, 3, 7, 4, 5, 4, 3, 3, 1, 48, 6. The mean is 7.25 and the median 3.5. Which better describes a typical call?',
            a: ['One 48-minute call pulls the mean far to the right: 11 of the 12 calls are 7 minutes or less.', 'The data are skewed right, so $\\bar{x} > \\tilde{x}$, and the median describes the center better.'],
            answer: 'The median, 3.5 minutes.',
            problem: 'c1.which-center',
            checks: () => [
              ['mean', mean(CALLS), 7.25, 1e-9],
              ['median', median(CALLS), 3.5, 1e-9],
            ],
          },
        ],
        ['def', 'Resistant.', 'A measure is resistant if extreme values do not change it much. The median is resistant; the mean is not.'],
        ['key', String.raw`Skewed left: mean < median. Symmetric: mean ≈ median. Skewed right: mean > median. So use the mean for symmetric data (it uses every value) and the median for skewed data (it is resistant).`],
        ['why', 'The median only counts how many values lie on each side. Moving the largest value further out does not change that count, so it does not move the median; it does move the total, and so the mean.'],
        ['def', 'Mode.', 'The most frequent value. It works for qualitative data too. A data set may have no mode (every value once), one (unimodal) or two (bimodal).'],
        [
          'ex',
          {
            n: '1.8',
            q: 'O-ring failures on the shuttle Columbia’s 17 flights before its fatal one: 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3. Find the mode.',
            a: ['0 occurs 11 times, more than any other value.'],
            answer: 'Mode = 0.',
            problem: 'c1.mode',
            checks: () => [['count of 0', tally(ORINGS).get(0), 11, 0]],
          },
        ],
        [
          'ex',
          {
            n: '1.9',
            q: 'Ten exam scores: 82, 77, 90, 71, 62, 68, 74, 84, 94, 88. Find the mode.',
            a: ['Every score occurs once.'],
            answer: 'There is no mode.',
            checks: () => [['largest count', Math.max(...tally(SCORES).values()), 1, 0]],
          },
        ],
        [
          'ex',
          {
            n: '1.10',
            q: 'Locations of 30 injuries needing physical therapy: Hip, Back, Back, Back, Hand, Neck, Knee, Knee, Knee, Hand, Knee, Shoulder, Wrist, Back, Groin, Shoulder, Shoulder, Back, Knee, Back, Hip, Shoulder, Elbow, Back, Back, Back, Back, Back, Back, Wrist. Find the mode.',
            a: ['Count each: Back 12, Knee 5, Shoulder 4, Hip 2, Hand 2, Wrist 2, Neck 1, Groin 1, Elbow 1.'],
            answer: 'Mode = Back (qualitative data can have a mode, but no mean or median).',
            checks: () => [
              ['n', INJURIES.length, 30, 0],
              ['Back', tally(INJURIES).get('Back'), 12, 0],
              ['Knee', tally(INJURIES).get('Knee'), 5, 0],
              ['Shoulder', tally(INJURIES).get('Shoulder'), 4, 0],
            ],
          },
        ],
      ],
    },
    {
      id: '1.6',
      title: 'Measures of variability',
      lab: 'describe',
      problems: ['c1.range-sd'],
      blocks: [
        ['p', 'Variability (dispersion) is how far the observations spread from the center.'],
        ['key', String.raw`Range: $R = \text{largest} - \text{smallest}$.`],
        ['key', String.raw`Population standard deviation: $\sigma = \sqrt{\dfrac{\sum (x_i - \mu)^2}{N}}$. Sample standard deviation: $s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2}{n - 1}}$. The variances are $\sigma^2$ and $s^2$.`],
        ['warn', String.raw`A sample divides by $n - 1$, a population by $N$. On the TI-84, $Sx$ is the sample $s$ and $\sigma x$ the population $\sigma$; this course's data are nearly always samples, so read $Sx$.`],
        [
          'ex',
          {
            n: '1.11',
            q: 'Compare the variability of the two seedling samples of Example 1.6.',
            a: [
              String.raw`No nitrogen: max 0.53, min 0.28, $R = 0.25$; 1-Var Stats gives $s = 0.073$.`,
              String.raw`Nitrogen: max 0.86, min 0.26, $R = 0.60$; $s = 0.187$.`,
            ],
            answer: 'The nitrogen group varies more, by both the range and the standard deviation.',
            problem: 'c1.range-sd',
            checks: () => [
              ['no-N range', range(NO_N), 0.25, 1e-9],
              ['no-N s', sd(NO_N), 0.073, 5e-4],
              ['N range', range(WITH_N), 0.6, 1e-9],
              ['N s', sd(WITH_N), 0.187, 5e-4],
            ],
          },
        ],
        ['p', 'Example 1.12 in the notes shows two histograms of IQ scores from 100 students at each of two universities. University A’s scores spread from about 55 to 160, University B’s bunch between 85 and 130: A has the larger standard deviation.'],
      ],
    },
    {
      id: '1.7',
      title: 'Quartiles, outliers and the box plot',
      lab: 'describe',
      problems: ['c1.quartiles', 'c1.outliers', 'c1.resistant'],
      blocks: [
        ['list', ['$Q_1$, the first quartile, has 25% of the data below it.', '$Q_2$ is the median: 50% below.', '$Q_3$, the third quartile, has 75% below.']],
        ['key', String.raw`$\text{IQR} = Q_3 - Q_1$: the spread of the middle half of the data.`],
        ['p', 'The notes find quartiles the TI-84 way: $Q_1$ is the median of the lower half of the sorted data and $Q_3$ the median of the upper half. When $n$ is odd the median itself is left out of both halves.'],
        [
          'ex',
          {
            n: '1.13',
            q: 'A random sample of 18 collision-coverage claims (dollars): 6751, 9908, 3461, 2336, 21147, 2332, 189, 1185, 370, 1414, 4668, 1953, 10034, 735, 802, 618, 180, 1657. Find the IQR.',
            a: [
              'Sort: 180, 189, 370, 618, **735**, 802, 1185, 1414, 1657 | 1953, 2332, 2336, 3461, **4668**, 6751, 9908, 10034, 21147.',
              String.raw`$n = 18$ is even, so the median is the mean of the 9th and 10th: $Q_2 = (1657 + 1953)/2 = 1805$.`,
              String.raw`Lower half (the first 9): its median is the 5th, $Q_1 = 735$. Upper half: $Q_3 = 4668$.`,
              String.raw`$\text{IQR} = 4668 - 735 = 3933$.`,
            ],
            answer: 'IQR = 3933 dollars.',
            problem: 'c1.quartiles',
            checks: () => {
              const f = fiveNumber(CLAIMS);
              return [
                ['Q1', f.q1, 735, 0],
                ['median', f.median, 1805, 0],
                ['Q3', f.q3, 4668, 0],
                ['IQR', f.q3 - f.q1, 3933, 0],
              ];
            },
          },
        ],
        ['p', 'Always check for extreme observations, **outliers**. The quartile rule:'],
        ['steps', ['Find $Q_1$ and $Q_3$.', String.raw`Compute $\text{IQR} = Q_3 - Q_1$.`, String.raw`Fences: lower $= Q_1 - 1.5 \times \text{IQR}$, upper $= Q_3 + 1.5 \times \text{IQR}$.`, 'A value below the lower fence or above the upper fence is an outlier.']],
        [
          'ex',
          {
            n: '1.14',
            q: 'Check the claims of Example 1.13 for outliers.',
            a: [
              String.raw`$Q_1 = 735$, $Q_3 = 4668$, $\text{IQR} = 3933$.`,
              String.raw`Lower fence $= 735 - 1.5(3933) = -5164.5$: nothing is below it, so no outlier on the left.`,
              String.raw`Upper fence $= 4668 + 1.5(3933) = 10567.5$: 21147 is above it.`,
            ],
            answer: 'The 21,147-dollar claim is the only outlier.',
            problem: 'c1.outliers',
            checks: () => {
              const b = boxPlot(CLAIMS);
              return [
                ['lower fence', b.lowerFence, -5164.5, 1e-9],
                ['upper fence', b.upperFence, 10567.5, 1e-9],
                ['outliers', b.outliers.length, 1, 0],
                ['the outlier', b.outliers[0], 21147, 0],
              ];
            },
          },
        ],
        ['p', 'Drawing a box plot:'],
        [
          'steps',
          [
            'Find the fences.',
            'Draw a number line covering the data. Draw a box from $Q_1$ to $Q_3$ with a line at the median.',
            'Mark the fences (lightly; they are not part of the finished plot).',
            'Whiskers: from $Q_1$ down to the smallest value ABOVE the lower fence, and from $Q_3$ up to the largest value BELOW the upper fence.',
            'Mark each outlier with an asterisk (*).',
          ],
        ],
        [
          'ex',
          {
            n: '1.15',
            q: 'Draw the box plot of the claims.',
            a: ['Box from 735 to 4668, median line at 1805.', 'Left whisker to the minimum, 180 (no outliers on that side). Right whisker to 10034, the largest value below the upper fence 10567.5.', 'An asterisk at 21147.'],
            checks: () => {
              const b = boxPlot(CLAIMS);
              return [
                ['left whisker', b.whiskerLow, 180, 0],
                ['right whisker', b.whiskerHigh, 10034, 0],
              ];
            },
          },
        ],
        ['fix', 'The calculator screens under Example 1.15 in the notes show a different list (19.95, 28.58, 33.23, …), not the 18 claims. Enter the claims to get the box plot of this example.'],
        ['ti', ['STAT ▸ 1:Edit: data in L1.', '2nd Y= ▸ 1:Plot1: On; Type: the box plot WITH separate dots (the first box icon, the modified box plot); Xlist: L1; Freq: 1.', 'ZOOM ▸ 9:ZoomStat. TRACE shows minX, Q1, Med, Q3, maxX and the outliers.']],
        ['p', 'The box plot shows the shape too: in a right-skewed set the right whisker is long and the median sits in the left part of the box; in a left-skewed set, the reverse.'],
        ['key', 'Measures of spread: the range and the standard deviation (and variance) are NOT resistant; the IQR is resistant.'],
      ],
    },
  ],
};
