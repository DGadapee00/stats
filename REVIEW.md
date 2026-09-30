# FLUX·stats review (30 Sep 2026)

Reviewed at `main` 7976cff. No app code was changed. Evidence scripts and screenshots are in
`scripts/output/review/`, which is gitignored: they exist in this checkout only.

## 1. Summary

The app's statistics are right. I found no wrong answer in the practice problems or the notes, and
I'm highly confident in its accuracy:

- **Practice:** I recomputed 1,033 instances across all 78 numeric generators with scipy (worked
  cases plus 12 fresh seeds each). There were 0 mismatches with the app's exact answers.
- **Notes:** all 61 inferential numbers I recomputed from Ch 5–10 match.
- **Grader:** it accepts every exact answer and every 4-decimal rounding. It accepts 613 of 625
  printed-table answers; the 12 rejections are all relative frequencies typed to 2 decimals.

The problems are in presentation and in the learning loop, not in the math:

- **Predict-first can contradict itself.** If the student moves a slider before committing, the
  verdict is computed from the moved state. The lab then marks the right prediction wrong and
  states a false result.
- **Worked solutions are clipped on a phone.** In 43 of the 95 problems (25 of the 60 midterm
  ones), a display equation is wider than the 380px column. The hidden part is usually the result.
- **Two templates render "le"/"ge" instead of ≤/≥.** This affects the event in the Ch 7 normal
  approximation and p̂ problems.
- **Two conceptual answer keys contradict the reasoning they ask for.**
- **Spaced review is easy to fool.** Solving one problem 3 times in 3 minutes marks it "mastered".
  Solving it 5 times schedules it after the midterm.

Coverage of Ch 1–9 is strong. Ch 10 is thin. Interpretation (conclusions in context, what an
interval means) is shown in every solution but never practised.

I could not check fidelity to the teacher's notes: the source isn't in the repo. Everything below
is checked against standard statistics, the course conventions and ERRATA.md.

### How it was checked

| Check | Result |
|---|---|
| `npm test`, `vite build` | All pass. |
| `node scripts/smoke.mjs --all` | All pass, at 380 and 1280 px. |
| Independent recomputation of practice answers (scipy, `review/recompute.py`) | 1,033 instances, 0 mismatches. 17 conceptual templates checked by reading. |
| The app's grader on my answers (`review/grade.mjs`) | Exact answers: 2,223/2,223 accepted. 4-decimal answers: 2,223/2,223. Table-route answers: 613/625. Deliberately wrong answers: 17 of 318 accepted, all indistinguishable at graded precision except a doubled tiny p-value (finding m8). |
| Notes numbers (scipy) | 61/61 match (Ex 5.2 through Ex 10.4). |
| Printed tables vs exact | Only the known t₀.₀₀₀₅,₁ misprint (636.578 printed, 636.619 exact). |
| Lab quotes in every Predict-first "why" (29 predictions) | All match except one R² (m1). |
| Link crawl from every top-level screen (`review/crawl.mjs`) | 275 pages, 0 broken, 0 page errors. |
| Hidden overflow at 380 px, solutions revealed (`review/overflow.mjs`) | 43 of 95 problems, 155 equations. |

## 2. Findings, most severe first

### C1. Predict-first verdicts are computed from whatever the student left on screen
- **Severity:** critical (a wrong result shown as the lab's finding). **Area:** accuracy, learning.
- **Where:** `#/final/explore/ci`, and every lab with predictions. `src/ui/lab.js:339-341`.
- **Observed:**
  - "Try it" loads the set-up, but the controls stay live.
  - `before` is computed from the current state and `after` from the current state plus the
    change.
  - Reproduction in the CI lab ("90% → 99%, the intervals get…"):
    1. Press Try it.
    2. Move the confidence slider to 0.99.
    3. Pick "wider" and press Make the change.
  - The card then says "Not what you predicted. It no different in width." It marks "wider" red
    and "no different" green, directly above a "why" explaining that intervals get 57% wider.
  - In other labs, moving an unrelated slider leaves the quoted numbers in the "why" wrong (power
    lab: β "0.36 to 0.63" no longer matches).
  - The live controls also let a student read the answer off the screen before committing, which
    defeats "predict first".
  - Evidence: `review/shots/fiddle-ci.png`, `review/predict-fiddle.mjs`.
- **Fix:**
  - Compute `before = compute({...defaults(), ...p.setup, seed})` and
    `after = compute({...before-state, ...p.change})`, independent of the live state.
  - Disable the controls (or overlay the plot) between Try it and the verdict.
  - In `labs-check`, add a case that perturbs the state before "change".

### M1. Worked-solution equations are cut off on a phone; the result is usually the hidden part
- **Severity:** major. **Area:** visual, UX.
- **Where:**
  - `.disp { overflow-x: auto }` at `src/styles/main.css:621`.
  - Long single-line chains in the step builders, e.g. `bank/ch10.js:60`, `bank/ch2.js:164`,
    `bank/ch4.js` (every `E(X) = …` sum).
- **Observed:**
  - At 380 px, 43/95 problems have a solution equation wider than its box, by up to 414 px:
    - Ch 1: 1. Ch 2: 5. Ch 3: 5. Ch 4: 7. Ch 5: 3. Ch 6: 4 (25 of the 60 midterm problems).
    - Ch 7: 2. Ch 8: 3. Ch 9: 11. Ch 10: 2.
  - Nothing signals the sideways scroll.
  - Examples:
    - c10.fit hides "a = …" and "ŷ(10) = …" (`review/shots/p-fit-sol.png`).
    - c2.product-rule-independent hides the whole "exactly one" result
      (`review/shots/p-product-sol.png`).
    - c9.welch-t-test hides "ν = 15.87" (`review/shots/p-welch-bottom.png`).
  - The smoke test cannot see this: the page itself does not overflow.
- **Fix:**
  - Break chains at "=" with `\begin{aligned}…\end{aligned}` (one step per line), or put the
    result on its own line.
  - For long sums, show two or three terms, then "⋯ =".
  - Add a visible fade/arrow when a `.disp` scrolls.
  - Add an `overflow.mjs`-style assertion to smoke: no `.disp` wider than its box at 380 px.

### M2. "P(X le 90)" and "P(p̂ ge 0.44)": lost backslashes in two Ch 7 templates
- **Severity:** major. **Area:** visual, accuracy of the displayed event.
- **Where:** `src/problems/bank/ch7.js:162, 174, 195, 203`.
- **Observed:**
  - The ≤/≥ come from plain string literals (`'\le'`, `'\ge'`) inside the `${…}` of a
    `String.raw` template. JavaScript drops the backslash, so KaTeX typesets the letters "le" and
    "ge".
  - It shows in the part label and in the worked solution's continuity-correction line.
  - It affects every c7.phat version (including Ex 7.8) and the "at most/at least" half of
    c7.normal-approx-binomial. The problem that teaches ≤ versus < for the continuity correction
    shows neither symbol.
  - `tex-check` does not catch literals nested inside `${}`.
  - Evidence: `review/shots/p-approx-le.png`.
- **Fix:**
  - Use `String.raw\`\le\``, or `'\\le'`, in those four places.
  - Extend tex-check to flag `'\` + letter inside any template's `${}`.

### M3. The steam association item's answer key contradicts the reasoning it asks for
- **Severity:** major. **Area:** accuracy (answer key), learning.
- **Where:** `#/final?p=c10.association&s=0`. `src/problems/bank/ch10.js:146` (case at :159).
- **Observed:**
  - "Monthly steam usage and average temperature at a plant that heats a process with steam. Are
    these positively or negatively associated?" The key is *positive*.
  - A student who reasons as the item asks (heating needs more steam when it is cold) answers
    *negative*. The same item set marks "Outdoor temperature and a home's heating bill" negative
    (:149).
  - "Positive" is only knowable from the Ex 10.1 data, which the item doesn't show.
  - This is the first version every student sees (seed 0).
- **Fix:**
  - Drop "that heats a process with steam" and say the data show usage rising with temperature.
  - Or replace the stem with the data's own description.
  - Or show the scatter plot as the figure.

### M4. "Mean or median?" marks "roughly symmetric" wrong when mean ≈ median
- **Severity:** major. **Area:** accuracy (answer key), learning.
- **Where:** `#/mid?p=c1.which-center`. `src/problems/bank/ch1.js:158-167`.
- **Observed:**
  - The generator makes median = mean − gap/10 and requires only a gap of at least 1 minute.
  - In 25.6% of 2,000 versions, mean and median are within 5% of each other: e.g. mean 43.50,
    median 42.50, or mean 56.25, median 57.25.
  - The key still demands "skewed right/left". Picking "roughly symmetric" gets "In a symmetric
    data set the mean and the median are about equal. These are not."
  - The notes' own key box says "Symmetric: mean ≈ median" (`src/notes/ch1.js:210`).
- **Fix:**
  - Require the gap to be a large share of the mean (e.g. median ≤ 0.8 × mean).
  - Or give s or the IQR so the size of the gap can be judged.
  - Or make "roughly symmetric" the key when the gap is small.

### M5. Spaced review: massed repeats count as mastery, and per-part checking never counts as clean
- **Severity:** major. **Area:** learning.
- **Where:** `src/problems/progress.js:71-74` and `src/ui/practice.js:313`.
- **Observed:**
  - Every clean solve moves up a box whether or not the problem was due:
    - Three clean solves of c6.normal-prob in 3 minutes give "Mastered", next due in 7 days.
    - Five give box 5, next due in 35 days: after the Oct 12 midterm, so it never comes back
      before the exam.
  - The first Check fixes `firstRight`. A student who checks part (a) before answering (b) and (c)
    gets "Solved. Because it took more than one check, it comes back sooner" even with every part
    right. Such a student stays in box ≤ 1 forever.
  - Verified in the browser (`review/partial-check.mjs`) and with the progress module directly.
- **Fix:**
  - Promote a box only when the problem was due, or at most once per calendar day.
  - Cap `due` at the next exam's date minus a day.
  - Judge "clean" per part: right on that part's first check.

### M6. Interpretation and test choice are shown but never practised
- **Severity:** major. **Area:** learning, coverage.
- **Where:** all Ch 8–10 test and interval generators. `self` parts are 0 in the bank; `c8.hypotheses`,
  `c9.which-test`.
- **Observed:**
  - Every test solution ends with the notes' four steps and a conclusion sentence. The student is
    only ever asked for the statistic, the p-value and a Reject/Fail button. They never:
    - write or pick the conclusion in context;
    - say what an interval or a p-value means;
    - state H₀/H₁ inside a test.
  - The kit's `self()` rubric part is unused, and `tBracket`/`chi2Bracket` are unused.
  - "Which procedure?" has 9 fixed stems whose wording gives the answer away ("variances assumed
    equal", "an F-test shows the variances differ"). It has no interval-versus-test and no
    regression stems, so it can be memorized in one pass.
- **Fix:**
  - Add an H₁ choice part (≠ / < / >) and a conclusion choice part (four sentences: right, reversed,
    "accepts H₀", "proves") to each test generator.
  - Add a CI-interpretation choice part ("95% of intervals…" versus "95% probability μ is in this
    interval").
  - Make which-test a generator: random context × design × known/unknown σ, with the cues phrased
    as data, not labels.

### Minor

**m1. Regression lab quotes R² = 0.54; the lab computes 0.53.**
- **Severity:** minor. **Area:** accuracy.
- **Where:** `src/labs/reg.js:172`.
- **Observed:** the outlier preset's own fit gives R² = 0.5345, and scipy agrees. The "why" says
  "from 0.94 to 0.54".
- **Fix:** 0.53.

**m2. The c10.fit solution says "R²: 100.0% of the variation" for R² = 0.99987.**
- **Severity:** minor. **Area:** accuracy (wording).
- **Where:** `src/problems/bank/ch10.js:63` (`fx(r2 * 100, 1)`).
- **Observed:** the notes say 99.99%.
- **Fix:** use 2 decimals when R² > 0.999, or never print 100.0%.

**m3. Welch t problems: 42% of versions show visibly non-normal data under "The populations are
normal".**
- **Severity:** minor. **Area:** learning, realism.
- **Where:** `src/problems/bank/ch9.js:303, 331` (`Math.max(1, x)`).
- **Observed:** the rural mean can be near 0 with SD 20, so negatives are clamped to 1. Example:
  "1, 1, 6, 1, 24, 30, 4, 1, 1, 1, 1". 42.4% (test) and 43.8% (interval) of 1,000 versions have 3
  or more 1's.
- **Fix:** keep m₂ ≥ 2·s₂ (e.g. a log-normal for the rural group, with the text saying so), or
  resample instead of clamping.

**m4. Small inconsistencies between notes and practice.**
- **Severity:** minor. **Area:** learning, UX.
- **Observed:**
  - Steam usage is in "pounds" in the notes (`notes/ch10.js:30`: "85.75 pounds") but "1000 lb"
    in practice (`bank/ch10.js:16`, c10.interpret).
  - Ex 5.1(f) locks the account after 3 tries (`notes/ch5.js:30`); c5.is-binomial says 4
    (`bank/ch5.js:215`).
  - c6.normal-plot cites "Notes §6.2.2" (source numbering; the app's notes call it §6.3).
  - §3.2 (discrete) links c3.cdf, an exponential-CDF problem (`notes/ch3.js:55`).
  - 5 of 84 "Work it in Practice" links open a case that cites a different example:
    - Ex 2.8 (₂₅P₃ awards) opens Walpole's 8-runner race.
    - Ex 8.12 and Ex 8.17 (a proportion interval) open the candy z-interval of Ex 8.7.
    - Ex 10.3 opens Ex 10.4.
    - Ex 2.9 opens a Walpole case, but with the same numbers (harmless).
  - The c9.which-test "4 of 200 defective" stem (Ex 8.14) says "check np₀(1 − p₀) ≥ 10". It is 9.5.
- **Fix:**
  - Pick one unit for steam and one number for the password item.
  - Cite the app's section numbers.
  - Move c3.cdf to §3.3.
  - Add cases for Ex 2.8 and Ex 10.3.
  - Mention the 9.5 in the which-test solution.

**m5. The normal-probability-plot lab is filed under Ch 8 and "After the midterm"; it is midterm
material.**
- **Severity:** minor. **Area:** UX, coverage.
- **Where:** `src/labs/npp.js:39` (`ch: ['8']`), `src/data/catalog.js:31`,
  `src/labs/index.js:24`.
- **Observed:** Notes §6.3 and c6.normal-scores/c6.normal-plot are Ch 6. The midterm Explore list
  puts the lab under "After the midterm" (`review/shots/explore-list-phone.png`). Ch 6 problems
  link Distributions and CLT, not this lab.
- **Fix:** tag it `['6', '8']`, add it to the midterm's `labs`, and map `6: ['dist', 'npp']`.

**m6. Tap targets under 44 px on a phone.**
- **Severity:** minor. **Area:** UX.
- **Where:** header and lab controls (`review/taps.mjs`).
- **Observed:**
  - Mode tabs 86×34.
  - Exam picker 174×31.
  - "← All problems"/"← Explore" about 20 px tall.
  - Lab segmented buttons 36 px.
  - Try it / Another 34 px.
  - Slider track 28 px.
  - The notes' section footer links ("Practice: …", "Lab: …") as small as 15 px.
- **Fix:** 44 px minimum height on these; give the footer links block padding.

**m7. Predict-first verdict sentences are ungrammatical for 27 of the 87 options.**
- **Severity:** minor. **Area:** UX.
- **Where:** `src/ui/lab.js:314` (`It ${label}.`).
- **Observed:** "It wider.", "It the two-sample test's.", "It a quarter as big.", "It high (above
  0.9).", "It s grows, the IQR stays the same."
- **Fix:** "Result: <label>", or write each option as a full clause.

**m8. Feedback and tolerance edge cases.**
- **Severity:** minor. **Area:** learning.
- **Where:** `src/problems/engine.js:271-272`, `src/problems/kit.js:45`,
  `src/problems/bank/ch1.js:356`.
- **Observed:**
  - The generic "square / square root: was the variance asked for?" message fires on
    probabilities. For a t-test p of 0.00477, typing 0.00043 says "That is the square of the
    answer. Was the standard deviation asked for…". c6.z-area gets the square-root version.
  - Probability parts use ±0.001 absolute, so on a p-value of 0.00055 a doubled (two-tailed)
    0.0011 is accepted.
  - Relative frequency typed to 2 decimals is rejected (0.38 for 0.375).
  - No named feedback for:
    - interpolated quartiles (another book's rule), 0/13;
    - z-with-s in a t interval, 0/13;
    - normal instead of t for a t-test p-value, 0/11;
    - the i/(n+1) plotting position, 0/13.
- **Fix:**
  - Skip the square/sqrt diagnosis for `prob` parts.
  - Use `max(0.001, 0.15·p)` for p-values under 0.01.
  - Accept ±0.005 on relative frequencies.
  - Add traps for those four slips.

**m9. Statistical claims that need a qualifier.**
- **Severity:** minor. **Area:** accuracy (wording).
- **Where:** `src/notes/ch7.js:21`, `src/notes/ch8.js:432`, `src/labs/tests.js:110`.
- **Observed:**
  - §7.1's key says "if X₁, …, Xₙ are normal, so is Y" without *independent* (or jointly normal),
    and "only normal random variables have this property" (not true of, e.g., the Cauchy).
  - Ex 8.17 applies the interval–test duality to a proportion, where the test uses p₀ and the
    interval p̂. The two can disagree near the boundary, and the §8.3 key presents the duality as
    exact.
  - The Which test? lab offers a χ² test for σ², which is in neither the notes nor the practice.
- **Fix:**
  - Add "independent".
  - Drop or soften "only normal…".
  - Add one sentence to Ex 8.17.
  - Mark χ² "(not in this course's notes)", or remove it.

**m10. The paired lab's default state does not show what its blurb promises.**
- **Severity:** minor. **Area:** learning.
- **Where:** `src/labs/paired.js:29`.
- **Observed:** "see why pairing can find an effect the other test misses", but the default
  (n 10, δ 2, spread 8) gives paired p = 0.068, which is not significant either
  (`review/shots/lab-paired-phone.png`).
- **Fix:** default n = 12 or δ = 3 (paired p < 0.05, two-sample p ≈ 0.4).

**m11. On a phone, the full z table scrolls its row labels out of view.**
- **Severity:** minor. **Area:** UX.
- **Where:** `src/ui/tables.js:113`.
- **Observed:** the grid auto-scrolls to the highlighted cell, so the z column (1.9) is off-screen
  and only ".03 … .08" shows (`review/shots/tables-zgrid.png`). Reading the table is what the page
  says it practises.
- **Fix:** make the first column `position: sticky; left: 0`.

**m12. The practice exam says "Use your printed tables", but t, F and paired p-values need the
TI-84.**
- **Severity:** minor. **Area:** UX.
- **Where:** `src/ui/exam.js:56`.
- **Observed:** t-test p-value parts accept only the exact (tcdf) value. The printed tables can't
  give it.
- **Fix:** "Use your TI-84 and printed tables".

**m13. The home screen gives a first-time user no next step.**
- **Severity:** minor. **Area:** UX, learning.
- **Where:** `#/mid` (`review/shots/home-phone.png`).
- **Observed:**
  - A stressed student sees "in 12 days", three buttons and a 60-item list about 4,000 px long.
    Every chapter is expanded.
  - Nothing points to the notes, says which chapters are weakest, or suggests when to take a
    practice exam.
  - The legend has five statuses, and "Review due" is a disabled button with no explanation.
- **Fix:**
  - Add a "Today" card: due reviews, then the weakest chapter's next problem, then "read §x.y
    first" when a chapter is untouched.
  - Suggest a practice-exam date.
  - Collapse chapters that are mastered or untouched.

### Polish

**p1. Plot-kit label collisions.**
- **Where:** `src/plot/plot.js:137`, `src/labs/cond.js`.
- **Observed:**
  - The x-axis label is drawn at the bottom-right, on top of the last tick label, in every lab:
    "160/points", "100/x̄", "1.5/x̄ (in σ)", "12/x".
  - "μ" labels sit on their dashed lines (Distributions, CLT). In the CI lab the blue line
    through "μ = 50" reads like "μ ≠ 50".
  - The Conditional probability tree's "A"/"A′" node labels overlap the edges.
- **Fix:** move the x-label below the ticks (or left of the last tick); offset the line labels.

**p2. The colour meanings hold in Power, CI and the CLT histograms but drift elsewhere.**
- **Observed:**
  - CLT's theoretical N(μ, σ²/n) curve is gold (a statistic); it should be teal.
  - The Distributions lab's density is teal, although it is a population, not a sampling
    distribution.
  - Conditional probability's false positives are pink (H₁), not red.
  - Paired and Regression use red/green for direction and residuals.
  - In the power lab, β (purple 0.55) and power (pink 0.38) are close to indistinguishable on the
    dark background.

**p3. Generated wording.**
- **Observed:**
  - "exactly 1 are defective"; "IQ scores is normally distributed"; "Of 200 of them";
    "average temperature (°F) (x)".
  - $c\,x^{1}$, $\dfrac{3x^2}{1}$, "E(1X + 0)"; "1260 adults" next to "1,961".
  - "The mean height of NFL players is supposed to be 69.5 inches" (69.5 is American men's mean,
    as in Ex 8.10).
  - "Hailey's and Jack's results" for bolt diameters; "one value is below x" (reads as "exactly
    one").
  - Real organizations quoted with arbitrary rates ("According to the American Red Cross, 70% …
    have blood type O-negative"; "In a production run, 70% of the items are defective").

**p4. Interval steps print "∓" where "±" is meant.**
- **Where:** `bank/ch8.js:242`, `bank/ch9.js:294, 348`.

**p5. Fonts and small text.**
- **Where:** `index.html:10`.
- **Observed:** fonts load only from Google Fonts, so offline the app falls back to system fonts.
  11 px meta text (tags, legend, "0/10 mastered") is small on a phone.

## 3. Coverage matrix

Counts are from the code. "Cases" are worked examples that practice starts with.

| Ch | Practice | Notes | Labs | Thin or missing |
|---|---|---|---|---|
| 1 Data analysis | 10 templates (5 conceptual), 11 cases. Strong. | 7 sections, 14 examples | Describing data (3 predictions) | Stem-and-leaf and histogram reading are in Ex 1.5 but not practised. c1.which-center key (M4). |
| 2 Probability | 9 templates, 8 cases. Good. | 8 sections, 14 examples | Conditional probability (3) | **Total probability / Bayes' rule: only in the lab**, not in the notes or practice. Venn "neither" (Ex 2.5) and "mutually exclusive ≠ independent" are not practised. |
| 3 Random variables | 7 templates, 5 cases. Adequate. | 3 sections, 6 examples | Distributions (shared) | Reading a piecewise discrete CDF. |
| 4 Expectation | 9 templates, 8 cases. Good. | 3 sections, 8 examples | **None** (links Distributions) | The planned Var(X − Y) lab wasn't built. Covariance and Chebyshev are absent (also absent from the notes). |
| 5 Discrete | 10 templates, 22 cases. Strong. | 3 sections, 8 examples | Distributions (4 relevant predictions) | Hypergeometric (not in the notes). |
| 6 Continuous | 11 templates, 18 cases. Strong. | 3 sections, 6 examples | Distributions; NPP (filed under Ch 8, m5) | Exponential appears only as a CDF in c3.cdf. |
| 7 Sampling | 7 templates, 8 cases | 4 sections, 8 examples | CLT (4) | "le/ge" rendering (M2). The t/χ²/F sampling distributions are placed in Ch 8–9 (course choice). |
| 8 One sample | 13 templates, 18 cases | 5 sections, 16 examples | CI coverage (3), Errors & power (3), Which test?, NPP (3) | Conclusions and interpretation (M6). β/power computation. p-value brackets from Table A.4. Sample size, if taught (not in the notes). |
| 9 Two samples | 15 templates, 20 cases. Strong. | 6 sections, 17 examples | Paired vs independent (2), Which test? | "Which procedure?" is 9 fixed stems (M6). Welch data realism (m3). |
| 10 Regression | **4 templates**, 2 of them fixed-text conceptual. Thin. | 3 sections, 4 examples | Regression (3), Which test? | Interpretation is locked to the steam line (4 variants). No residual computation. Steam key (M3). |

Every problem opens at seeds 0 and 5 (`smoke --all`), and 0, 5 and 17 with the solution
revealed (the overflow scan). `problems-check` covers 200 seeds each. Every notes, practice
and lab link resolves.

### Questions for you (these need the syllabus or the teacher's notes)
1. Is Bayes' rule / total probability on the midterm? If yes, it is the biggest Ch 1–6 gap.
2. Are the χ² test for σ², sample-size formulas and β/power computation examined? The app is
   consistent with the notes (none are there), but the Which test? lab shows a χ² test.
3. Attach the teacher's notes if you want the rewrite checked line by line for fidelity.

## 4. Top 5 changes before Oct 12

1. **Make worked solutions readable on a phone (M1).** 25 of the 60 midterm problems hide their
   result off-screen. Break chains with `aligned` and add a smoke assertion. This affects every
   studying session on a phone.
2. **Make spaced review honest and exam-aware (M5).**
   - Promote a box only when the problem is due.
   - Never schedule past Oct 11.
   - Judge "clean" per part.

   Otherwise "Mastered" and "Review due" mislead the student in the last 12 days.
3. **Fix the midterm answer keys and feedback that teach the wrong thing:**
   - c1.which-center (M4);
   - the variance/SD message on probabilities (m8);
   - the Predict-first verdict and its sentences (C1, m7) in the three midterm labs (Describing
     data, Conditional probability, Distributions).

   The two one-line fixes for the final (M2, M3) belong in the same pass.
4. **Give the home screen a "Today" plan (m13):** due reviews, then the weakest chapter's next
   problem with a link to its notes section, then a suggested practice exam around Oct 8 and 11.
5. **Add interpretation parts to the tests (M6).** Choose H₁, choose the conclusion sentence, say
   what the interval means. Add a Bayes/total-probability generator if question 1 is yes. These
   are the points students lose on an exam when the arithmetic is right.
