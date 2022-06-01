import { generateInteger } from './common-utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const PERIOD = 365;

const getYear = (dateTime) => dayjs(dateTime).format('YYYY');
const getHumanisedDate = (dateTime) => dayjs(dateTime).format('D MMMM YYYY');
const getCommentDate = (dateTime) => dayjs(dateTime).format('YYYY/M/D HH:mm');
const generateDate = () => dayjs().add(generateInteger(-3*PERIOD, 0), 'day');
const convertDuration = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes/60);
  const minutes = timeInMinutes % 60;
  return dayjs.duration({hours, minutes }).format('H[h] mm[m]');
};

export {
  getYear,
  getHumanisedDate,
  getCommentDate,
  generateDate,
  convertDuration
};
