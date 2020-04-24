const Form = require('./abstract_class_form/abstract_class_form.js');

class formGood extends Form {
  constructor(jQueryElement, modalFade=null, modalAwait=null, modalWindow=null){
    super(jQueryElement, modalFade, modalAwait);

    this.modal.modalWindow = modalWindow;

    this.jQueryName = jQueryElement.find('input.name');
    this.jQueryEmail = jQueryElement.find('input.supplier_email');
    this.jQueryCount = jQueryElement.find('input.count');
    this.jQueryPrice = jQueryElement.find('input.price');

    this.jQueryCancel = jQueryElement.find('.modal_cancel');

  }
}

module.exports = class formAdd extends formGood {

  constructor(jQueryElement, modalFade=null, modalAwait=null, modalWindow=null){
    super(jQueryElement, modalFade, modalAwait, modalWindow);


  }

}

module.exports = class formEdit extends formGood {
  
  constructor(jQueryElement, modalFade=null, modalAwait=null, modalWindow=null, name, email, count, price){
    super(jQueryElement, modalFade, modalAwait, modalWindow);

    this.name = name;
    this.email = email;
    this.count = count;
    this.price = price;
  }

}