/**
 * Chapter 2, rewritten from the teacher's notes (Ch 2, pp. 26–40). Example numbers are the notes'.
 */
import { choose, perm } from '../stats/dist.js';

export default {
  ch: '2',
  title: 'Probability',
  sections: [
    {
      id: '2.1',
      title: 'Random experiments and sample spaces',
      blocks: [
        ['def', 'Random experiment.', 'A process with several possible outcomes, where which one happens cannot be predicted in advance (flipping a coin).'],
        ['def', 'Sample space $S$.', 'The set of all possible outcomes. Each outcome is a **sample point**. For one coin flip, $S = \\{\\text{Head}, \\text{Tail}\\}$.'],
        [
          'ex',
          {
            n: '2.1',
            q: 'Flip a coin. If it lands heads, flip it again; if tails, roll a die once. List the sample space.',
            a: ['A tree diagram: the first flip branches to H and T. H branches to H and T; T branches to 1, 2, …, 6.', 'Read the sample points off the ends of the branches.'],
            answer: String.raw`$S = \{HH, HT, T1, T2, T3, T4, T5, T6\}$: 8 sample points.`,
          },
        ],
      ],
    },
    {
      id: '2.2',
      title: 'Events',
      lab: 'cond',
      blocks: [
        ['def', 'Event.', 'A subset of the sample space.'],
        ['p', String.raw`Example 2.2: if $S = \{t \mid t \ge 0\}$ is the life in years of a component, the event "it fails before the end of year 5" is $A = \{t \mid 0 \le t < 5\}$.`],
        ['def', 'Null set $\\emptyset$.', 'The event with no outcomes (an impossible event). Example 2.3: $B = \\{x \\mid x \\text{ is an even factor of } 7\\} = \\emptyset$, since 7’s only factors, 1 and 7, are odd.'],
        ['def', "Complement $A'$", String.raw`(also written $A^c$): every outcome of $S$ that is NOT in $A$.`],
        [
          'ex',
          {
            n: '2.4',
            q: String.raw`$S = \{\text{book}, \text{cell phone}, \text{mp3}, \text{paper}, \text{stationery}, \text{laptop}\}$ and $A = \{\text{book}, \text{stationery}, \text{laptop}, \text{paper}\}$. Find $A'$.`,
            a: ['Take the outcomes of $S$ not listed in $A$.'],
            answer: String.raw`$A' = \{\text{cell phone, mp3}\}$.`,
          },
        ],
        ['def', String.raw`Intersection $A \cap B$:`, 'the outcomes in both $A$ and $B$ ("$A$ and $B$ both happen").'],
        ['def', String.raw`Union $A \cup B$:`, 'the outcomes in $A$ or $B$ or both ("$A$ or $B$ happens").'],
        ['def', 'Mutually exclusive (disjoint):', String.raw`$A \cap B = \emptyset$. The two events cannot happen at the same time.`],
        ['p', 'A **Venn diagram** draws $S$ as a rectangle and events as circles inside it, which makes these set operations visible.'],
        [
          'ex',
          {
            n: '2.5',
            q: '100 UNF students were asked whether they like math or physics: 60 like math, 20 like physics but not math, and 20 like both. What percentage like neither?',
            a: [
              'Fill in the Venn diagram from the inside out: both = 20, so math only = 60 − 20 = 40; physics only = 20.',
              'Inside the circles: 40 + 20 + 20 = 80 students. Outside: 100 − 80 = 20.',
            ],
            answer: '20% like neither math nor physics.',
            checks: () => [['neither', 100 - (60 - 20 + 20 + 20), 20, 0]],
          },
        ],
        ['warn', '"60 like math" includes the 20 who like both. Start a Venn diagram from the overlap and subtract outward.'],
      ],
    },
    {
      id: '2.3',
      title: 'Probability of an event',
      problems: ['c2.at-least-one'],
      blocks: [
        ['key', String.raw`When all sample points are equally likely: $P(A) = \dfrac{\text{number of sample points in } A}{\text{number of sample points in } S}$.`],
        [
          'ex',
          {
            n: '2.6',
            q: 'A coin is tossed twice. What is the probability of at least one head?',
            a: [String.raw`$S = \{HH, HT, TH, TT\}$, 4 equally likely points.`, String.raw`At least one head: $A = \{HH, HT, TH\}$, 3 points.`, String.raw`$P(A) = 3/4$.`],
            answer: '$P(A) = 0.75$.',
            problem: 'c2.at-least-one',
            case: 0,
            checks: () => [['P', 3 / 4, 0.75, 0]],
          },
        ],
      ],
    },
    {
      id: '2.4',
      title: 'Counting: multiplication rule, permutations, combinations',
      problems: ['c2.multiplication-rule', 'c2.permutations', 'c2.combinations'],
      blocks: [
        ['key', String.raw`**Multiplication rule.** If one operation can be done in $n_1$ ways and, for each of those, a second in $n_2$ ways, the two together can be done in $n_1 n_2$ ways.`],
        [
          'ex',
          {
            n: '2.7',
            q: 'A developer offers Tudor, rustic, colonial and traditional exteriors, each in ranch, two-story or split-level floor plans. How many different homes can a buyer order?',
            a: ['Step 1, exterior: 4 ways. Step 2, floor plan: 3 ways for each.', '$4 \\times 3 = 12$ (the tree diagram has 12 branch ends).'],
            answer: '12 homes.',
            problem: 'c2.multiplication-rule',
            case: 0,
            checks: () => [['ways', 4 * 3, 12, 0]],
          },
        ],
        ['def', 'Permutation:', 'an arrangement in a specific order. Order matters.'],
        ['key', String.raw`$_nP_r = \dfrac{n!}{(n - r)!}$ arrangements of $r$ objects chosen from $n$ distinct ones, where $n! = n(n-1)\cdots(2)(1)$ and $0! = 1$.`],
        [
          'ex',
          {
            n: '2.8',
            q: 'Three awards (research, teaching, service) go to students in a class of 25; no student gets more than one. How many possible selections are there?',
            a: ['We choose 3 students AND assign them to different awards: the order matters, so this is a permutation.', String.raw`$_{25}P_3 = \dfrac{25!}{22!} = 25 \times 24 \times 23 = 13{,}800$.`],
            answer: '13,800 selections.',
            problem: 'c2.permutations',
            case: 1,
            checks: () => [['25P3', perm(25, 3), 13800, 0]],
          },
        ],
        ['ti', ['Type $n$ (25), then MATH ▸ PROB ▸ 2:nPr, then $r$ (3), ENTER: 13800.']],
        ['def', 'Combination:', 'a selection where the order does not matter; only which objects are in the group.'],
        ['key', String.raw`$_nC_r = \dfrac{n!}{r!\,(n - r)!}$ groups of $r$ chosen from $n$.`],
        ['why', String.raw`Each group of $r$ can be arranged in $r!$ orders, so $_nC_r = {}_nP_r / r!$: the combinations are the permutations with the orderings of each group counted once.`],
        [
          'ex',
          {
            n: '2.9',
            q: 'A boy asks for 5 game cartridges from a collection of 10 arcade and 5 sports games. In how many ways can his mother get 3 arcade and 2 sports games?',
            a: [String.raw`Step 1: choose 3 of the 10 arcade games, $_{10}C_3 = 120$.`, String.raw`Step 2: choose 2 of the 5 sports games, $_5C_2 = 10$.`, 'By the multiplication rule, $120 \\times 10 = 1200$.'],
            answer: '1200 ways.',
            problem: 'c2.combinations',
            checks: () => [
              ['10C3', choose(10, 3), 120, 0],
              ['5C2', choose(5, 2), 10, 0],
              ['ways', choose(10, 3) * choose(5, 2), 1200, 0],
            ],
          },
        ],
        [
          'ex',
          {
            n: '2.10',
            q: 'A poker hand is 5 cards from a 52-card deck. Find the probability of holding 2 aces and 3 jacks.',
            a: [
              String.raw`Sample space: all hands, $_{52}C_5 = 2{,}598{,}960$ (order does not matter).`,
              String.raw`Event: 2 of the 4 aces AND 3 of the 4 jacks, $_4C_2 \times {}_4C_3 = 6 \times 4 = 24$.`,
              String.raw`$P = \dfrac{24}{2{,}598{,}960} = 9.23 \times 10^{-6}$.`,
            ],
            answer: String.raw`$P \approx 0.00000923$: about 9 hands in a million.`,
            checks: () => [
              ['52C5', choose(52, 5), 2598960, 0],
              ['event', choose(4, 2) * choose(4, 3), 24, 0],
              ['P', (choose(4, 2) * choose(4, 3)) / choose(52, 5), 9.23e-6, 5e-9],
            ],
          },
        ],
        ['ti', ['Type $n$, MATH ▸ PROB ▸ 3:nCr, then $r$. For Ex 2.9: 10 nCr 3 = 120, 5 nCr 2 = 10, 120 × 10 = 1200.']],
        ['warn', 'Permutation or combination? Ask whether swapping two of the chosen objects gives a different outcome. Different jobs or ranks: yes, permutation. Just a group: no, combination.'],
      ],
    },
    {
      id: '2.5',
      title: 'The additive and complement rules',
      lab: 'cond',
      problems: ['c2.additive-rule', 'c2.at-least-one'],
      blocks: [
        ['key', String.raw`**Additive rule:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$. If $A$ and $B$ are mutually exclusive, $P(A \cup B) = P(A) + P(B)$.`],
        ['why', 'Adding $P(A)$ and $P(B)$ counts the overlap $A \\cap B$ twice; subtracting it once corrects that.'],
        [
          'ex',
          {
            n: '2.11',
            q: 'John’s chance of an offer from company A is 0.8, from company B 0.6, and from both 0.5. What is the probability he gets at least one offer?',
            a: ['"At least one" is $A \\cup B$ ($A$ or $B$).', String.raw`$P(A \cup B) = P(A) + P(B) - P(A \cap B) = 0.8 + 0.6 - 0.5$.`],
            answer: '0.9.',
            problem: 'c2.additive-rule',
            case: 0,
            checks: () => [['P', 0.8 + 0.6 - 0.5, 0.9, 1e-12]],
          },
        ],
        ['key', String.raw`**Complement rule:** $P(A) + P(A') = 1$, so $P(A) = 1 - P(A')$.`],
        ['why', String.raw`$A$ and $A'$ are mutually exclusive and together make up $S$, and $P(S) = 1$.`],
        [
          'ex',
          {
            n: '2.12',
            q: 'Daily interruptions in a computer network: P(0) = 0.35, P(1) = 0.25, P(2) = 0.20, P(3) = 0.10, P(4) = 0.05, P(5) = 0.05. Find the probability of at least one interruption on a random day.',
            a: [String.raw`$A = \{1, 2, 3, 4, 5\}$, so $A' = \{0\}$.`, String.raw`$P(A) = 1 - P(A') = 1 - 0.35$.`],
            answer: '0.65.',
            checks: () => [
              ['total', 0.35 + 0.25 + 0.2 + 0.1 + 0.05 + 0.05, 1, 1e-12],
              ['P', 1 - 0.35, 0.65, 1e-12],
            ],
          },
        ],
        ['key', '"At least one" almost always means: 1 − P(none).'],
      ],
    },
    {
      id: '2.6',
      title: 'Conditional probability',
      lab: 'cond',
      problems: ['c2.conditional-independence', 'c2.two-way-table'],
      blocks: [
        ['key', String.raw`$P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}$, provided $P(A) > 0$: the probability of $B$ once we know $A$ happened.`],
        ['why', 'Knowing $A$ happened shrinks the sample space to $A$. Of that, the part where $B$ also happens is $A \\cap B$.'],
        [
          'ex',
          {
            n: '2.13',
            q: 'A flight departs on time with probability $P(D) = 0.83$, arrives on time with $P(A) = 0.82$, and both with $P(D \\cap A) = 0.78$. Find the probability it (a) arrives on time given it departed on time; (b) departed on time given it arrived on time.',
            a: [String.raw`(a) $P(A \mid D) = \dfrac{P(A \cap D)}{P(D)} = \dfrac{0.78}{0.83} = 0.94$.`, String.raw`(b) $P(D \mid A) = \dfrac{P(D \cap A)}{P(A)} = \dfrac{0.78}{0.82} = 0.95$.`],
            answer: '(a) 0.94, (b) 0.95. The two conditionals are different numbers: the denominator is whatever is GIVEN.',
            checks: () => [
              ['(a)', 0.78 / 0.83, 0.94, 0.005],
              ['(b)', 0.78 / 0.82, 0.95, 0.005],
            ],
          },
        ],
        [
          'ex',
          {
            n: '2.14',
            q: 'A class survey about smartphones (a two-way or contingency table). Find, with proper notation: (a) P(iPhone); (b) P(female); (c) P(female and iPhone); (d) P(female or iPhone); (e) P(male | iPhone); (f) P(iPhone | male).',
            data: {
              head: ['', 'Neither', 'iPhone', 'Samsung', 'Total'],
              rows: [
                ['Female', 0, 28, 1, 29],
                ['Male', 2, 31, 2, 35],
                ['Total', 2, 59, 3, 64],
              ],
            },
            a: [
              String.raw`(a) $P(I) = 59/64 = 0.922$.`,
              String.raw`(b) $P(F) = 29/64 = 0.453$.`,
              String.raw`(c) $P(F \cap I) = 28/64 = 0.438$.`,
              String.raw`(d) $P(F \cup I) = P(F) + P(I) - P(F \cap I) = \tfrac{29}{64} + \tfrac{59}{64} - \tfrac{28}{64} = \tfrac{60}{64} = 0.938$.`,
              String.raw`(e) $P(M \mid I) = \dfrac{P(M \cap I)}{P(I)} = \dfrac{31/64}{59/64} = \dfrac{31}{59} = 0.525$: within the iPhone column.`,
              String.raw`(f) $P(I \mid M) = \dfrac{31/64}{35/64} = \dfrac{31}{35} = 0.886$: within the male row.`,
            ],
            checks: () => [
              ['(a)', 59 / 64, 0.922, 5e-4],
              ['(b)', 29 / 64, 0.453, 5e-4],
              ['(c)', 28 / 64, 0.438, 5e-4],
              ['(d)', (29 + 59 - 28) / 64, 0.938, 5e-4],
              ['(e)', 31 / 59, 0.525, 5e-4],
              ['(f)', 31 / 35, 0.886, 5e-4],
              ['row total F', 0 + 28 + 1, 29, 0],
              ['row total M', 2 + 31 + 2, 35, 0],
            ],
          },
        ],
        ['key', 'In a two-way table, a conditional probability uses only the row or column of what is given: its total is the denominator.'],
      ],
    },
    {
      id: '2.7',
      title: 'Independent events',
      lab: 'cond',
      problems: ['c2.conditional-independence', 'c2.without-replacement'],
      blocks: [
        ['p', 'Events are **independent** when one happening does not change the probability of the other: two tosses of a coin; a die roll and a coin flip. They are **dependent** when it does: drawing cards without replacement; choosing two different students in turn.'],
        ['key', String.raw`$A$ and $B$ are independent if and only if $P(B \mid A) = P(B)$ (equivalently, $P(A \mid B) = P(A)$).`],
        ['p', 'Drawing WITH replacement makes the draws independent: the deck is the same each time.'],
        [
          'ex',
          {
            n: '2.15',
            q: 'In a survey of college students, 33% are in a relationship, 25% play sports, and 11% do both. What is the probability a student is in a relationship given they play sports? Are the two independent?',
            a: [String.raw`$P(R \mid S) = \dfrac{P(R \cap S)}{P(S)} = \dfrac{0.11}{0.25} = 0.44$.`, String.raw`Compare with $P(R) = 0.33$: $0.44 \ne 0.33$.`],
            answer: 'P(R | S) = 0.44; not independent (knowing a student plays sports raises the chance they are in a relationship).',
            problem: 'c2.conditional-independence',
            case: 0,
            checks: () => [['P(R|S)', 0.11 / 0.25, 0.44, 1e-12]],
          },
        ],
        ['warn', 'Independent is not the same as mutually exclusive. Mutually exclusive events with positive probabilities are always DEPENDENT: if one happens, the other cannot.'],
      ],
    },
    {
      id: '2.8',
      title: 'The product rule',
      lab: 'cond',
      problems: ['c2.product-rule-independent'],
      blocks: [
        ['key', String.raw`**General product rule:** $P(A \cap B) = P(A)\,P(B \mid A) = P(B)\,P(A \mid B)$.`],
        ['key', String.raw`**Independent events:** $P(A \cap B) = P(A)\,P(B)$.`],
        [
          'ex',
          {
            n: '2.16',
            q: 'Three couples are invited to a party. They come independently, with probabilities 1/2, 2/3 and 3/4. Find the probability that (a) no couple comes; (b) at least one comes; (c) exactly one comes.',
            a: [
              String.raw`(a) None: couple 1 does not come AND 2 does not AND 3 does not. By independence, $\left(1 - \tfrac12\right)\left(1 - \tfrac23\right)\left(1 - \tfrac34\right) = \tfrac12 \cdot \tfrac13 \cdot \tfrac14 = \tfrac{1}{24} = 0.042$.`,
              String.raw`(b) At least one is the complement of none: $1 - \tfrac{1}{24} = 0.958$.`,
              String.raw`(c) Only 1, OR only 2, OR only 3: mutually exclusive, so add. $\tfrac12 \cdot \tfrac13 \cdot \tfrac14 + \tfrac12 \cdot \tfrac23 \cdot \tfrac14 + \tfrac12 \cdot \tfrac13 \cdot \tfrac34 = \tfrac{1 + 2 + 3}{24} = \tfrac{6}{24} = 0.25$.`,
            ],
            answer: '(a) 0.042, (b) 0.958, (c) 0.25.',
            problem: 'c2.product-rule-independent',
            case: 0,
            checks: () => [
              ['(a)', (1 / 2) * (1 / 3) * (1 / 4), 0.042, 5e-4],
              ['(b)', 1 - 1 / 24, 0.958, 5e-4],
              ['(c)', (1 / 2) * (1 / 3) * (1 / 4) + (1 / 2) * (2 / 3) * (1 / 4) + (1 / 2) * (1 / 3) * (3 / 4), 0.25, 1e-12],
            ],
          },
        ],
        ['key', '"And" between independent events: multiply. "Or" between mutually exclusive events: add.'],
      ],
    },
  ],
};
