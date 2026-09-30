/** Every lab, in the order the Explore list shows them. */
import dist from './dist.js';
import clt from './clt.js';
import ci from './ci.js';
import power from './power.js';
import tests from './tests.js';
import reg from './reg.js';

export const LABS = [dist, clt, ci, power, tests, reg];

export const labById = (id) => LABS.find((l) => l.id === id) || null;
