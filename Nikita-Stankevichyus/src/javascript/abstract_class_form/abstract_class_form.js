module.exports = class Form {
  constructor(jQueryModalFade=null, jQueryModalAwait=null, jQueryElement=null){

    this.jQueryElement = jQueryElement;

    if(jQueryElement){
      this.jQuerySubmit = jQueryElement.find('[type="submit"]');
    }

    this.modal = {
      jQueryModalFade: jQueryModalFade,
      jQueryModalAwait: jQueryModalAwait,
    }
  }
}