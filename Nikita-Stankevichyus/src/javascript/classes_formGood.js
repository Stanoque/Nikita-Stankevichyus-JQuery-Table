const Form = require('./abstract_class_form/abstract_class_form.js');

const LIST = require('./LIST.js');

const Good = require('./good_local_object.js');

const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;
const putSemi = require('./price_vidget/vidget_price.js').putSemi;
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

class FormGood extends Form {
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp, renderObject){
    super(jQueryModalFade, jQueryModalAwait);

    this.renderObject = renderObject;

    this.jQueryTemplate = jQueryTemplate;
    this._render(modalWindow);

    this.modal.jQueryModalWindow = $('#'+ modalWindow);
    this.jQueryElement = this.modal.jQueryModalWindow.find('form');

    this.appendDelivery(citiesTemp);

    this.jQueryName = this.jQueryElement.find('input.name');
    this.jQueryEmail = this.jQueryElement.find('input.supplier_email');
    this.jQueryCount = this.jQueryElement.find('input.count');
    this.jQueryPrice = this.jQueryElement.find('input.price');

    this.jQueryInputs = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    this.jQueryNotes = this.jQueryElement.find('.note');

    this.jQueryCities = {};

    this.jQueryCities.selectAll = this.jQueryElement.find('input.select_all');
    this.jQueryCities.cities = this.jQueryElement.find('input.city');

    this.jQueryTrigger = jQueryTrigger;
    this.jQueryTrigger.click(()=>{this.open()});

    

    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit()
    });

    this.jQueryCancel = this.jQueryElement.find('.cancel');
    this.jQueryCancel.click(()=>{this.cancel()});

    this.good = good;
  }


  _render(id) {
    $(_.template(this.jQueryTemplate.html())({
      modalId: id,
      email: '',
      name: '',
      count: '',
      price: '$',
      saveId: 'save_add',
      cancelId: 'cancel_add',
    })).appendTo('.main');

  }

  open() {
    this.modal.jQueryModalFade.addClass('modal_fade_trick');
    this.modal.jQueryModalWindow.css('display', 'block');
    this.jQueryName.focus();
  }

  cancel() {
    this.modal.jQueryModalFade.removeClass('modal_fade_trick');
    this.modal.jQueryModalWindow.css('display', 'none');
    this.clear();
  }

  loading() {
    this.modal.jQueryModalFade.addClass('modal_fade_trick');
    this.modal.jQueryModalAwait.css('display', 'block');
    this.modal.jQueryModalWindow.css('display', 'none');
  }

  endLoading() {
    this.modal.jQueryModalFade.removeClass('modal_fade_trick');
    this.modal.jQueryModalAwait.css('display', 'none');
  }

  clear() {
    this.jQueryName.val('');
    this.jQueryEmail.val('');
    this.jQueryCount.val('');
    this.jQueryPrice.val('$');

    this.jQueryCities.selectAll.prop('checked', false);
    this.jQueryCities.cities.prop('checked', false);

    this.clearInvalid();
    this.hideNotes();
  }

  clearInvalid() {

    this.jQueryInputs.forEach((element)=>{
      element.removeClass('invalid');
    });
  
  }

  showNotes(input) {
    if(input.hasClass('name')){
      input.parent().siblings('.note').addClass('hidden');
      if(input.val().length < 5){
        input.parent().siblings('.invalid_name_short').removeClass('hidden');
      } else {
        input.parent().siblings('.invalid_name_long').removeClass('hidden');
      }
    } else {
      input.parent().siblings('.note').removeClass('hidden');
    }

  }

  hideNotes() {
    this.jQueryNotes.addClass('hidden');
  }

  isNameValid(name) {
    let workString = name;
    let regExpOnlySpaces = /\S/;
    
    if(!workString.match(regExpOnlySpaces)){
      return false;
    }
    if(workString.length > 15 || workString.length < 5){
      return false;
    }
  
    return true;
  
  }

  isEmailValid(email){
   
    let regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if(email.match(regExpEmail)){
      return true;
    } else {
      return false;
    };
  
  }

  isCountValid(count) {

    if(isNaN(parseInt(count))){
      return false;
    }
  
    if(count.length > 0){
      return true;
    } else {
      return false;
    }

  }

  isPriceValid(price){

    if(isNaN(parseFloat(price))){
      return false;
    }
  
    if(price.length > 0){
      return true;
    } else {
      return false;
    }
  };
  

  submit() {
  
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    
    if(validation.every((element)=>{return element;})){
      let cities = this.jQueryElement.find('.city').toArray();
      let delivery = [];
  
      cities.forEach((city)=>{
        delivery.push($(city).prop('checked') ? true : false);
      });
      

      const addPromise = LIST.add(new Good(
                this.jQueryName.val(),
                this.jQueryEmail.val(),
                this.jQueryCount.val(),
                priceConverter(this.jQueryPrice.val()), 
                delivery.slice(0, 3), 
                delivery.slice(3, 5), 
                delivery.slice(5, 9), 
      ))
            
      this.loading();
  
      addPromise.then((resolved) => {
        LIST.render();
        this.endLoading();
        this.clear();
        this.clearInvalid();
      }  
      );
  
     
  
  
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
 

  appendDelivery(citiesTemp) {
    
    const renderCities = (country, cityNames=[], allChecked) => {
          
    let delivery = [];
  
    if(this.good){
      for(let city in good.delivery[country]){
        delivery.push(good.delivery[country][city]);
      }
    }
  
    $(_.template($(citiesTemp).html())({
      country: country,
      city_1: cityNames[0],
      city_2: cityNames[1],
      city_3: cityNames[2],
      class_1: cityNames[0].toLowerCase(),
      class_2: cityNames[1].toLowerCase(),
      class_3: cityNames[2].toLowerCase(),
      attr_1: delivery[0] ? 'checked' : null,
      attr_2: delivery[1] ? 'checked' : null,
      attr_3: delivery[2] ? 'checked' : null,
      attr_4: allChecked ? 'checked' : null,
    })).appendTo(this.jQueryElement.find('.cities'));
    };
  
    renderCities('russia', ['Moscow', 'Saratov', 'SPb'], this.good ? this.good.allCities('russia') : false);
    renderCities('belorus', ['Minsk', 'Hotlany', 'Bobruysk'], this.good ? this.good.allCities('belorus') : false);
    renderCities('usa', ['NY', 'Washington', 'Boston'], this.good ? this.good.allCities('usa') : false);
  
    let countries = this.jQueryElement.find('.countries').children();
  
    countries = countries.toArray();
  
    const cities = countries.map((country)=>{
  
      let citiesClass = ' .'+$(country).attr('class')+'_cities';
      return this.jQueryElement.find(citiesClass);
  
    });
  
    $(cities[0]).removeClass('hidden');
  
  
    const migrate = (toCountry) => {
  
      $(toCountry).click(() => {
  
        cities.forEach((country)=>{
          $(country).addClass('hidden');
        });
  
        const citiesClass = '.'+$(toCountry).attr('class')+'_cities';
        this.jQueryElement.find(citiesClass).removeClass('hidden');
    
      });
    }
  
    countries.forEach((country)=>{
      migrate(country);
    });
  
        
  
    const selectAll = (countrySelectAll) => {
      $(countrySelectAll).click(() => {
        $(countrySelectAll).parent().siblings().children('.city').prop('checked', $(countrySelectAll).prop('checked'));
      });
    }
  
    cities.forEach((country)=>{
      selectAll($(country).find('.select_all')); 
    })
  }

}

module.exports.FormAdd = class FormAdd extends FormGood {

  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp, LIST){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    
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

module.exports.FormEdit = class FormEdit extends FormGood {
  
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp, renderObject){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    this.name = name;
    this.email = email;
    this.count = count;
    this.price = price;
    this.citiesChecboxes = good.deliveryToArray()
  }

  submit() {
  
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    
    if(validation.every((element)=>{return element;})){
      let cities = this.jQueryElement.find('.city').toArray();
      let delivery = [];
  
      cities.forEach((city)=>{
        delivery.push($(city).prop('checked') ? true : false);
      });
      

      const addPromise = LIST.add(new Good(
                this.jQueryName.val(),
                this.jQueryEmail.val(),
                this.jQueryCount.val(),
                priceConverter(this.jQueryPrice.val()), 
                delivery.slice(0, 3), 
                delivery.slice(3, 5), 
                delivery.slice(5, 9), 
      ))
            
      this.loading();
  
      addPromise.then((resolved) => {
        LIST.render();
        this.endLoading();
        this.clear();
        this.clearInvalid();
      }  
      );
  
     
  
  
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