
const LIST = require('./LIST.js');

const FormGood = require('./classes_formGood.js').FormGood;

const Good = require('./good_local_object.js');

const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;
const putSemi = require('./price_vidget/vidget_price.js').putSemi;
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

module.exports.FormAdd = class FormAdd extends FormGood {

  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);
    this.LIST = LIST;
    
    // this.jQueryTemplate = jQueryTemplate;
    // this._render(modalWindow);

    // this.modal.jQueryModalWindow = $('#'+ modalWindow);
    // this.jQueryElement = this.modal.jQueryModalWindow.find('form');

    // this.appendDelivery();
  }

//   _render(id) {
//     $(_.template(jQueryTemplate.html())({
//       modalId: id,
//       email: '',
//       name: '',
//       count: '',
//       price: '$',
//       saveId: 'save_add',
//       cancelId: 'cancel_add',
//     })).appendTo('.main');

//   }
}