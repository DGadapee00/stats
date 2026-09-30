# FLUX·stats — STA 3032

A study app for STA 3032 (Fall 2026; Walpole, Myers, Myers & Ye, *Probability & Statistics for
Engineers & Scientists*). It is the sibling of [FLUX](https://github.com/DGadapee00/flux-phy2049)
for PHY 2049, with the same approach: generated practice problems tied to the course, worked
solutions, spaced review, and interactive labs. It is built for a phone first.

```bash
npm install
npm start          # http://localhost:5175
npm test           # stats-check, tex-check, problems-check, labs-check, notes-check
node scripts/smoke.mjs   # every screen at 380px and 1280px (needs the dev server running)
```

## What is here

- **Practice** — 95 problem generators covering all ten chapters (the midterm's Ch 1–6 and the final's Ch 1–10). Each draws fresh numbers,
  computes the answer, and shows a worked solution that names every table lookup. The first
  attempts go through the worked examples (123 in all: every worked example in the teacher's notes, Ch 1–10,
  and a few from the textbook); after that, every attempt gets new numbers.
  - **Grading:** answers are graded to table precision. A problem accepts both the exact value
    and the value you get from the printed tables (z rounded to 2 places, the t row either
    side of your df).
  - **Feedback:** common slips get named: the complement, one tail instead of two, s instead
    of σ, adding variances that should add but were subtracted.
  - **Review:** spaced review, mixed sets, and a timed 8-problem practice exam.
- **Tables** — Appendix A as a lookup, with the printed value beside the exact one and the full z
  table highlighted.
- **Explore** — ten labs, all 2D, each built to correct one or two intuitions. Every lab has
  Predict-first cards: you commit to what a change will do, then make it, and the lab says what
  happened from its own numbers.
  - *Describing data* (Ch 1): histogram, dot plot, box plot; mean vs median, s vs IQR, bin width.
  - *Conditional probability* (Ch 2): a screening test as an area model and a tree; Bayes' rule.
  - *Distributions* (Ch 3, 5, 6, and t, χ², F): every distribution with an event shaded.
  - *Sampling distributions* (Ch 7): x̄ and p̂ from thousands of samples; the normal
    approximation to the binomial with and without the continuity correction.
  - *CI coverage* (Ch 8): 100 intervals; z, t, and the wrong z-with-s.
  - *Errors and power* (Ch 8): H₀ and H₁ curves, α, β, power.
  - *Normal probability plot* (Ch 8): skew, heavy tails, and how much a normal sample wiggles.
  - *Which test?* (Ch 8–10): a decision tree ending at the formula, assumptions and TI-84 menu.
  - *Paired vs independent* (Ch 9): the same subjects twice, tested both ways.
  - *Regression* (Ch 10): drag points; line, residuals, R², residual plot, leverage.
  Worked solutions link to the lab for their chapter.
- **Notes** — the teacher's notes for Ch 1–10, rewritten: 101 worked examples, each with its
  solution folded until you want it and a link to practice the same numbers; TI-84 steps; each
  section linked to its lab. Where the notes leave an example to be worked in class, the answer is
  computed both from the printed tables and exactly. Slips in the source are marked as corrections
  (and listed in [ERRATA.md](ERRATA.md)).

## How it is checked

- `scripts/stats-check.mjs` pins every distribution function to published values. It also checks
  every entry of the printed t, χ² and F tables against the exact value; 7 known misprints are
  listed, including t₀.₀₀₀₅,₁ = 636.578 where the exact value is 636.619.
- The same script reproduces the teacher's Chapter 1 examples (TI-84 quartiles, fences).
- `scripts/problems-check.mjs` checks every generator:
  - its worked cases reproduce the notes' and textbook's answers,
  - 200 seeded versions each stay valid and render,
  - KaTeX parses every formula,
  - and each probability agrees with a seeded Monte Carlo simulation of the same problem.
- `scripts/notes-check.mjs` recomputes every number the notes state (263 of them) from the
  examples' data, checks each linked practice case cites the same example, and parses all TeX.
- `scripts/labs-check.mjs` runs every lab headless:
  - every default, scenario and prediction state computes and draws,
  - every Predict-first verdict is what the lab's own numbers show (over several seeds),
  - and the pictures are statistically right: the simulated SD of x̄ against σ/√n, long-run
    CI coverage against the confidence level, simulated power and size against the formula.

[ERRATA.md](ERRATA.md) lists where a printed answer is wrong. Quartiles follow the teacher's notes (TI-84: the median of each half). The tables are those of the
textbook's Appendix A (`src/stats/tables-data.js`, extracted by `scripts/extract_tables.py`).
