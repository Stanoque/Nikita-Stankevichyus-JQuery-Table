const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;

module.exports = function Row(template, whereTo, number, good){

  this.good = good;
  this.number = number;

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

  this.modalDescription = {};
  this.modalDelete = {};
  

  this.defineModalDescription = (template, element, close) => {

    $(template({
        descriptionId: element,
        name: good.name,
        description: good.description,
        closeId: close,
        
    })).appendTo('#table_body');

    this.modalDescription.jQueryElement = $('#'+element);
    this.modalDescription.jQueryClose = $('#'+close);


    this.jQueryElement.find('#description_'+number).click(() => {
      $("#modal_fade").addClass("modal_fade_trick");
      this.modalDescription.jQueryElement.css("display", "block");
    });
    
    this.modalDescription.jQueryClose.click(()=>{
      $("#modal_fade").removeClass("modal_fade_trick");
      this.modalDescription.jQueryElement.css("display", "none");
    });

  }

  this.defineModalDelete = (template, element, yes, no) => {

    $(template({
      deleteId: element,
      name: good.name,
      idYes: yes,
      idNo: no,
    })).appendTo('#table_body');

    this.modalDelete.jQueryElement = $('#'+element);
    this.modalDelete.jQueryYes = $('#'+yes);
    this.modalDelete.jQueryNo = $('#'+no);

    $('#delete_'+this.number).click(() => {
      $('#modal_fade').addClass('modal_fade_trick');
      this.modalDelete.jQueryElement.css('display', 'block');
    });

    this.modalDelete.jQueryNo.click(() => {
      $('#modal_fade').removeClass('modal_fade_trick');
      this.modalDelete.jQueryElement.css('display', 'none');
    }); 

  }
  

  

  

  this.hide = () => {
    this.jQueryElement.addClass('hidden');
    this.jQueryElement.children().addClass('hidden');
  }

  this.show = () => {
    this.jQueryElement.removeClass('hidden');
    this.jQueryElement.children().removeClass('hidden');
  }
}
 
