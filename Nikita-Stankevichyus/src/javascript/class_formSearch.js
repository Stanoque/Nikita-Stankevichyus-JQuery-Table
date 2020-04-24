const Form = require('./abstract_class_form/abstract_class_form.js');


module.exports = class formSearch extends Form {
  constructor(jQueryElement, modalFade=null, modalAwait=null){
    super(jQueryElement, modalFade, modalAwait);
  }
}