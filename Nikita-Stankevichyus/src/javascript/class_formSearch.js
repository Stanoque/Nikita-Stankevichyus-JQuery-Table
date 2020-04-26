const Form = require('./abstract_class_form/abstract_class_form.js');
const LIST = require('./list_local_object.js').LIST;

module.exports = class formSearch extends Form {
  constructor(jQueryModalFade=null, jQueryModalAwait=null, jQueryElement=null){

    super(jQueryModalFade, jQueryModalAwait, jQueryElement);

    this.initPlaceholders();
    
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit();
    })

    this.jQueryElement.find('input').click(()=>{
      if(this.jQueryElement.find('input').val() === this.jQueryElement.find('input').attr('my_placeholder')){
        this.jQueryElement.find('input').val('');
        this.jQueryElement.find('input').removeClass('placeholder');
      }
    })
  }

  submit(){
    this.checkPlaceholders();
    const regExpToFilter = new RegExp(this.jQueryElement.find('input').val(), 'i');

    LIST.forEach((good)=>{
      if(!good.name.match(regExpToFilter)){
        good.hidden = true; 
      } else {
        good.hidden = false;
      }
    });

    LIST.render();
    
    this.initPlaceholders();
  }
  
}