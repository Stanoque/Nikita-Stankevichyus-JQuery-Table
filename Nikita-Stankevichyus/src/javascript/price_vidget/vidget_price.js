const putSemi = require('./putSemi.js');
const cleanPriceString = require('./cleanPriceString.js');

module.exports.cleanPriceString = cleanPriceString;

module.exports.putSemi = putSemi;

module.exports.priceConverter = (price) => {
  let workPrice = price;
  
  if(typeof price === 'number') {
    return '$'+putSemi(workPrice);
  } else {
    
    return parseFloat(cleanPriceString(workPrice));
  }
};
