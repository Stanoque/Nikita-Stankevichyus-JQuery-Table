const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;

module.exports = function Row(template, whereTo, number, good){

  this.good = good;

  $(template({
    idRow: 'table_row_'+number,
    name: this.good.name,
    price: priceConverter(this.good.price),
    count: this.good.count,
    idName: 'description_'+number,
    idEdit: 'edit_'+number,
    idDelete: 'delete_'+number,
  })).appendTo(whereTo);

  this.jQueryElement = $('#table_row_'+number);

  this.hide = () => {
    this.jQueryElement.addClass('hidden');
    this.jQueryElement.children().addClass('hidden');
  }

  this.show = () => {
    this.jQueryElement.removeClass('hidden');
    this.jQueryElement.children().removeClass('hidden');
  }
}
 
