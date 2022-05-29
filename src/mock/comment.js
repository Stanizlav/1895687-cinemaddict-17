import { getAnElement } from '../utils/array-utils.js';
import { generateDate } from '../utils/date-utils.js';

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const AUTHORS = [
  'Ilya O\'Reilly',
  'Alyosha',
  'Johny Guardo',
  'Jane Doe'
];
const COMMENTS = [
  'A film that changed my life',
  'A true masterpiece',
  'Post-credit scene was just amazing omg.',
  'Booooooooooring'
];

export const generateComment = (element, id) => ({
  id: ++id,
  author: getAnElement(AUTHORS),
  comment: getAnElement(COMMENTS),
  date: generateDate(),
  emotion: getAnElement(EMOTIONS)
});
