import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const PERIOD = 7;

const generateInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getAnElement = (array) => array[generateInteger(0,array.length-1)];

const generateArrayFrom = (count, donor) => {
  const takenIndexes = [];
  const array = [];
  for(let i=0; i<count; i++){
    let index = generateInteger(0, donor.length-1);
    while(takenIndexes.includes(index)){
      index = generateInteger(0, donor.length-1);
    }
    takenIndexes.push(index);
    array.push(donor[index]);
  }
  takenIndexes.splice(0,takenIndexes.length);
  return array;
};

const limit = (value, min, max) =>{
  if(value < min) {
    return min;
  }
  if(value > max){
    return value % max;
  }
  return value;
};


const getYear = (dateTime) => dayjs(dateTime).format('YYYY');
const getHumanisedDate = (dateTime) => dayjs(dateTime).format('D MMMM YYYY');
const getCommentDate = (dateTime) => dayjs(dateTime).format('YYYY/M/D HH:mm');
const generateDate = () => dayjs().add(generateInteger(-3*PERIOD, -PERIOD), 'day');
const convertDuration = (timeInMinutes) => {
  const hours = Math.floor(timeInMinutes/60);
  const minutes = timeInMinutes % 60;
  return dayjs.duration({hours, minutes }).format('H[h] mm[m]');
};
export {
  generateInteger,
  getAnElement,
  generateArrayFrom,
  limit,
  getYear,
  getHumanisedDate,
  getCommentDate,
  generateDate,
  convertDuration
};
