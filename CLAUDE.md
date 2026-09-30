# FLUX·stats: notes for Claude

Vite + vanilla JS + KaTeX study app for STA 3032. Sibling of FLUX (DGadapee00/flux-phy2049), whose
engine and conventions were copied and adapted here; FLUX itself is not to be modified. PLAN.md
holds the plan and the course decisions (tables, quartile rule, exam dates, build order).

## Checks

- `npm test` (stats-check, tex-check, problems-check) must pass. `npx vite build` must succeed.
- `node scripts/smoke.mjs` needs the dev server on 5175 (`npx vite --port 5175 --strictPort`, in the
  background). It fails on page errors and on any page wider than a 380px phone. Look at the
  screenshots in `scripts/output/smoke/` after UI changes.

## Conventions

- Distribution functions live in `src/stats/dist.js` and must be pinned in stats-check before a
  generator uses them.
- Printed tables are data (`src/stats/tables-data.js`), read through `src/stats/tables.js`. A worked
  solution quotes the printed value; grading accepts exact and table routes (`alt` in kit.js).
- The class works on the TI-84: p-values are exact (tcdf, normalcdf, 2-SampFTest…), and Welch's df is
  the calculator's fractional value (rounded down is also accepted, for the table).
- Quartiles: TI-84 rule (median of halves, median excluded when n is odd). s uses n − 1.
- Normal approximation (binomial, p̂, proportion tests): np(1 − p) ≥ 10, with continuity
  correction for counts.
- Normal probability plot: theoretical quantiles z_i = Φ⁻¹((i − 0.5)/n) on the x-axis, sorted data
  on the y-axis (the notes' convention).
- Regression is written ŷ = a + bx (a intercept, b slope), as in the notes.
- Table A.6 prints only α = 0.05 and 0.01, so F intervals from the table are 90% or 98%.
- A worked case from the notes may break a condition generated versions must meet (Ex 8.14);
  put such conditions in `sampleValid`, not `valid`.
- TeX in JS goes in String.raw templates (tex-check enforces it). Prose uses `$…$` and `$$…$$`;
  never a bare `$` for money (write "dollars").
- Cite sources by section (Walpole §5.2) or by the notes' example number (Notes Ex 1.13). Do not
  invent textbook example numbers.
- Mobile first: 380px portrait is the design width; no horizontal scroll.
