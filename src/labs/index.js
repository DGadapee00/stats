/** Every lab, in the order the Explore list shows them. */
import dist from './dist.js';

export const LABS = [dist];

export const labById = (id) => LABS.find((l) => l.id === id) || null;
