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

  initPlaceholders(){
    this.jQueryElement.find('input').toArray().forEach((element)=>{
      if($(element).attr('type') !== 'checkbox' && $(element).attr('type') !== 'button' && $(element).attr('type') !== 'submit'){
        $(element).addPlaceholder('Enter '+$(element).attr('name')+'...');
      }
    });
  } 

  checkPlaceholders(){
    this.jQueryElement.find('input').toArray().forEach((element)=>{
      if($(element).attr('type') !== 'checkbox' && $(element).attr('type') !== 'button' && $(element).attr('type') !== 'submit'){
        if($(element).val() === $(element).attr('my_placeholder')){
          $(element).val('');
        }
      }
    });
  }
  
}