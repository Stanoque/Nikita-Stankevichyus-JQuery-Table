const FormGood = require('./classes_formGood').FormGood;

const Good = require('./good_local_object.js');

const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;
const putSemi = require('./price_vidget/vidget_price.js').putSemi;
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

module.exports.FormEdit = class FormEdit extends FormGood {
  
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    this.name = name;
    this.email = email;
    this.count = count;
    this.price = price;
    this.modal.jQueryModalWindow = $('#'+'modal_edit_'+modalWindow);
    this.citiesChecboxes = good.deliveryToArray()
  }

  _render(number) {
    $(_.template(this.jQueryTemplate.html())({
      modalId: 'modal_edit_'+number,
      email: this.good.email,
      name: this.good.name,
      count: this.good.count,
      price: priceConverter(this.good.price),
      saveId: 'modal_save_'+number,
      cancelId: 'modal_cancel_'+number,
    })).appendTo('#table_body');

  }

  submit() {
  
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    
    if(validation.every((element)=>{return element;})){

      const editPromise = new Promise((resolve, reject) => {

        setTimeout(()=>{
          good.name = this.jQueryName.val();
          good.email = this.jQueryEmail.val();
          good.count = this.jQueryCount.val();
          good.price = priceConverter(this.jQueryPrice.val());
      
          const editCities = () => {
            const countries = [];
            
            for(let country in good.delivery) {
              countries.push(country);
            }
  
            countries.forEach( (country)=>{

                for(let city in good.delivery[country]){
                  good.delivery[country][city] = this.jQueryCities.prop('checked') ? true : false;
                }
            }
            )
          }

          editCities();
          
          resolve('Edit successful');
        }, serverResponseTime);
      
      });

      this.loading();
      editPromise.then((resolved) => {
        this.endLoading()
        this.clear();
        LIST.render();
      })
  
    } else {
      this.clearInvalid();
      validation.forEach((element, index)=>{
        if(!element){
          forms[index].addClass('invalid');
          this.showNotes(forms[index]);
        } else {
          this.hideNotes(forms[index]);
        }
      });
  
      forms[validation.indexOf(false)].focus();
    }
  }
 

}