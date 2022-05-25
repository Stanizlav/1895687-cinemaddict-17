import { generateInteger } from './common-utils.js';

const getAnElement = (array) => array[generateInteger(0,array.length-1)];

const generateArrayFrom = (count, donor) => {
  const takenIndexes = [];
  const result = [];
  for(let i=0; i<count; i++){
    let index = generateInteger(0, donor.length-1);
    while(takenIndexes.includes(index)){
      index = generateInteger(0, donor.length-1);
    }
    takenIndexes.push(index);
    result.push(donor[index]);
  }
  takenIndexes.splice(0, takenIndexes.length);
  return result;
};

export {
  getAnElement,
  generateArrayFrom
};

