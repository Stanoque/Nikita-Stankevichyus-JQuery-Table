module.exports = function(price){
  return price.replace(/\,/g, '').replace('$', '');
};