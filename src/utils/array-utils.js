import { generateInteger } from './common-utils.js';

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

export {
  getAnElement,
  generateArrayFrom
};

