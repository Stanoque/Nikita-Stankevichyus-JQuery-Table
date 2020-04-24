// const cleanPriceString = require('./putSemi.js');

module.exports = function(price){

  let workString = price.toString();
  let tail = '';

  workString = workString.replace(/\,/g, '');

  if(workString.indexOf('.') !== -1){
    tail = workString.slice(workString.indexOf('.'));
    workString = workString.slice(0, workString.indexOf('.'));
  }

  workString = workString.split('');
  workString.reverse();
  
  let counter = 0;
  for(let i = 0; i < workString.length; i++){
    if(counter < 3) {
      counter++;
    } else {
      
      workString.splice(i, 0, ',');
      counter = 0;
    }
    
  }
  
  workString.reverse();
  
  workString = workString.join('').concat(tail);
  
  return workString;
}