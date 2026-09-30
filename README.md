# FLUX·stats — STA 3032

A study app for STA 3032 (Fall 2026; Walpole, Myers, Myers & Ye, *Probability & Statistics for
Engineers & Scientists*). It is the sibling of [FLUX](https://github.com/DGadapee00/flux-phy2049)
for PHY 2049, with the same approach: generated practice problems tied to the course, worked
solutions, spaced review, and (coming) interactive labs. It is built for a phone first.

```bash
npm install
npm start          # http://localhost:5175
npm test           # stats-check, tex-check, problems-check
node scripts/smoke.mjs   # every screen at 380px and 1280px (needs the dev server running)
```

## What is here

- **Practice** — 44 problem generators for the midterm (Ch 1–6). Each draws fresh numbers,
  computes the answer, and shows a worked solution that names every table lookup. The first
  attempt uses the numbers from the teacher's notes or the textbook. After that, every attempt
  gets new numbers.
  - **Grading:** answers are graded to table precision. A problem accepts both the exact value
    and the value you get from the printed tables (z rounded to 2 places, the t row either
    side of your df).
  - **Feedback:** common slips get named: the complement, one tail instead of two, s instead
    of σ, adding variances that should add but were subtracted.
  - **Review:** spaced review, mixed sets, and a timed 8-problem practice exam.
- **Tables** — Appendix A as a lookup, with the printed value beside the exact one and the full z
  table highlighted.
- **Notes, Explore** — coming. See [PLAN.md](PLAN.md) for the order.

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

Quartiles follow the teacher's notes (TI-84: the median of each half). The tables are those of the
textbook's Appendix A (`src/stats/tables-data.js`, extracted by `scripts/extract_tables.py`).
