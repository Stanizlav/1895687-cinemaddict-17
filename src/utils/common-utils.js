const generateInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const cutWithPeriod = (value, min, max) =>{
  const minimum = Math.min(min, max);
  const maximum = Math.max(min, max);
  const period = maximum - minimum + 1;
  if(value < minimum) {
    return maximum - (maximum - value) % period;
  }
  if(value > maximum){
    return (value - minimum) % period + minimum;
  }
  return value;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item)=>item.id===update.id);
  if(index === -1){
    return items;
  }
  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index+1)
  ];
};

export{
  generateInteger,
  cutWithPeriod,
  updateItem
};
