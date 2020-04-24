module.exports = class Form {
  constructor(jQueryElement, modalFade=null, modalAwait=null){
    this.jQueryElement = jQueryElement;
    this.jQuerySubmit = jQueryElement.find('[type="submit"]');
    this.modal = {
      modalFade = modalFade,
      modalAwait = modalAwait,
    }
  }
}