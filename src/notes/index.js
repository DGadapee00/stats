/**
 * The class notes, rewritten from the teacher's notes (the only notes this course has), one file
 * per chapter. A chapter is data:
 *
 *   { ch, title, sections: [{ id: '1.5', title, lab?, problems?: [ids], blocks: [...] }] }
 *
 * Blocks, all in the panel markup (prose with $…$ and $$…$$):
 *   ['p', text]                      a paragraph
 *   ['def', term, text]              a definition, boxed
 *   ['key', text]                    a rule or formula to remember, boxed in yellow
 *   ['list', [items]]                bullet points
 *   ['steps', [items]]               numbered steps
 *   ['table', { head: [...], rows: [[...]], note? }]
 *   ['ex', { n, q, data?, a: [steps], answer?, problem?, case?, checks? }]
 *        a worked example from the notes (n is its number there). `problem` and `case` open the
 *        practice version with the same numbers. `checks` is a function returning
 *        [[label, recomputed, stated, tolerance], …]: notes-check recomputes every stated number.
 *   ['ti', [steps]]                  TI-84 keystrokes
 *   ['why', text]                    the intuition behind a rule
 *   ['fix', text]                    where the source notes slip, and the correct version
 *   ['warn', text]                   a common mistake
 */
import ch1 from './ch1.js';
import ch2 from './ch2.js';
import ch3 from './ch3.js';
import ch4 from './ch4.js';
import ch5 from './ch5.js';
import ch6 from './ch6.js';

export const NOTES = [ch1, ch2, ch3, ch4, ch5, ch6];

export const notesFor = (ch) => NOTES.find((n) => n.ch === String(ch)) || null;
