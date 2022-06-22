import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const MILLISECONDS_IN_MINUTE = 60000;

const getYear = (dateTime) => dayjs(dateTime).format('YYYY');
const getFormatedDate = (dateTime) => dayjs(dateTime).format('D MMMM YYYY');
const getHumanisedDate = (dateTime) => {
  const difference = dayjs(dateTime).diff(dayjs())/MILLISECONDS_IN_MINUTE;
  const integerDifference = Math.floor(difference);
  const humanisedDifference = dayjs.duration(integerDifference, 'minutes').humanize();
  return `${ humanisedDifference } ago`;
};
const getCommentDate = (dateTime) => dayjs(dateTime).format('YYYY/M/D HH:mm');
const convertDuration = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes/60);
  const minutes = timeInMinutes % 60;
  return dayjs.duration({hours, minutes }).format('H[h] mm[m]');
};

export {
  getYear,
  getFormatedDate,
  getHumanisedDate,
  getCommentDate,
  convertDuration
};
