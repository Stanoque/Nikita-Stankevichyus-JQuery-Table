(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const putSemi = require('./src/javascript/price_vidget/vidget_price.js').putSemi;
const priceConverter = require('./src/javascript/price_vidget/vidget_price.js').priceConverter;

const isNameValid = require('./src/javascript/form_validation.js').isNameValid;
const isEmailValid = require('./src/javascript/form_validation.js').isEmailValid;
const isCountValid = require('./src/javascript/form_validation.js').isCountValid;
const isPriceValid = require('./src/javascript/form_validation.js').isPriceValid;

const clearAdd = require('./src/javascript/form_cleaners.js').clearAdd;
const clearEdit = require('./src/javascript/form_cleaners.js').clearEdit;
const clearInvalid = require('./src/javascript/form_cleaners.js').clearInvalid;

const appendDelivery = require('./src/javascript/form_appendDelivery.js');

const showNotes = require('./src/javascript/form_notes.js').showNotes;
const hidNotes = require('./src/javascript/form_notes.js').hidNotes;

const Good = require('./src/javascript/good_local_object.js');

const GoodsList = require('./src/javascript/list_local_object.js');

const FormAdd = require('./src/javascript/list_local_object.js').FormAdd;
const FormSearch = require('./src/javascript/class_formSearch.js');

const serverResponseTime = require('./src/javascript/const_serverResponseTime.js');
const LIST = require('./src/javascript/list_local_object.js').LIST;

const initialDatabase = [
  new Good('Lorem ipsum', 'someemail@gmail.com', 3, 100, [true, true, true],[true, true, true],[true, true, true]),
  new Good('Dolor sit amet', 'someeail@gmail.com', 4, 1000, [true, true, true],[false, false, true],[true, true, true]),
  new Good('Ipsum amet', 'smeemail@gmail.com',11, 10, [true, true, true],[false, true, true],[true, true, true]),
  new Good('Lorem sit', 'somemail@gmail.com', 1, 1, [true, true, true],[true, true, true],[true, true, true])
]


Object.defineProperty(Object.prototype, 'addPlaceholder',{
  value : function(text) {

    const currentElement = this;

    currentElement.val(text);
    currentElement.addClass('placeholder');
    currentElement.attr('my_placeholder', text);

    currentElement.focus(()=>{
      currentElement.removeClass('placeholder');
      if(currentElement.val() === text){
        currentElement.val('');
      }
    }); 

  },
  enumerable : false
});

Object.defineProperty(String.prototype, 'cleanPriceString', {
  value: function(){
    return this.replace(/\,/g, '').replace('$', '');
  },
  enumerable: false,
});

const initPlaceholders = (form) => {
  $(form+' input').toArray().forEach((element)=>{
    if($(element).attr('type') !== 'checkbox' && $(element).attr('type') !== 'button' && $(element).attr('type') !== 'submit'){
      $(element).addPlaceholder('Enter '+$(element).attr('name')+'...');
    }
  });
} 



// const LIST = new GoodsList();


$('#modal_fade').addClass('modal_fade_trick');
$('#loading').css('display', 'block');
const initialGet = new Promise((resolve, reject) => {
  
    setTimeout( () => {
      initialDatabase.forEach((good)=>{
        LIST.push(good);
        resolve('Initialization successfull');
      })} , serverResponseTime);
    }
);

initialGet.then( (resolved) => {
    LIST.render();
    $('.loading').css('display', 'none');
    $(".modal_fade").removeClass("modal_fade_trick");
  }
);

let addForm = new FormAdd(null, $('#modal_fade'), $('#loading'), 'modal_add', $('#good_add'), $('#modal_edit_template'), $('#edit_cities_template'), LIST);


$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
  LIST.ascedningName = !LIST.ascedningName;

});



$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
  LIST.ascedningPrice = !LIST.ascedningPrice;
});



let searchForm = new FormSearch($('#modal_fade'), $('#loading'),  $('#search_form'));
// $('#search_form').submit((event)=>{
//   event.preventDefault();
//   const form = '#search_form ';
//   const input = $(form+'input');

//   const toSearch = input.val();
//   const regExpToFilter = new RegExp(toSearch, 'i');

//   LIST.forEach((good)=>{
//     if(!good.name.match(regExpToFilter)){
//       good.hidden = true; 
//     } else {
//       good.hidden = false;
//     }
//   });

//   LIST.render();
// })

$('.sort_name').click(()=>{
  LIST.sortByName();
});

$('.sort_price').click(()=>{
  LIST.sortByPrice();
});

// $('#search_form'+' input').addPlaceholder('Enter name...');

// initPlaceholders('#modal_add');

LIST.render();


},{"./src/javascript/class_formSearch.js":3,"./src/javascript/const_serverResponseTime.js":4,"./src/javascript/form_appendDelivery.js":5,"./src/javascript/form_cleaners.js":6,"./src/javascript/form_notes.js":7,"./src/javascript/form_validation.js":8,"./src/javascript/good_local_object.js":9,"./src/javascript/list_local_object.js":10,"./src/javascript/price_vidget/vidget_price.js":13}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./abstract_class_form/abstract_class_form.js":2,"./list_local_object.js":10}],4:[function(require,module,exports){
module.exports = 2000;
},{}],5:[function(require,module,exports){
module.exports = function(whereTo, good) {

  let citiesTemp = _.template($('#edit_cities_template').html());
  
      const renderCities = (country, cityNames=[], allChecked) => {
        
        let delivery = [];

        if(good){
          for(let city in good.delivery[country]){
            delivery.push(good.delivery[country][city]);
          }
        }

        $(citiesTemp({
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
        })).appendTo($(whereTo + ' .cities'));
      };

      renderCities('russia', ['Moscow', 'Saratov', 'SPb'], good ? good.allCities('russia') : false);
      renderCities('belorus', ['Minsk', 'Hotlany', 'Bobruysk'], good ? good.allCities('belorus') : false);
      renderCities('usa', ['NY', 'Washington', 'Boston'], good ? good.allCities('usa') : false);

      let countries = $(whereTo + ' .countries').children();

      countries = countries.toArray();

      const cities = countries.map((country)=>{

        let citiesClass = ' .'+$(country).attr('class')+'_cities';
        return $(whereTo + citiesClass);

      });

      $(cities[0]).removeClass('hidden');


      const migrate = (toCountry) => {

        $(toCountry).click(() => {

          cities.forEach((country)=>{
            $(country).addClass('hidden');
          });

          const citiesClass = ' .'+$(toCountry).attr('class')+'_cities';
          $(whereTo + citiesClass).removeClass('hidden');
  
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
},{}],6:[function(require,module,exports){
const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;

module.exports.clearAdd = (form) => {
  $(form+'.name').val('');
  $(form+'.supplier_email').val('');
  $(form+'.count').val('');
  $(form+'.price').val('$');
  $(form+'.select_all').prop('checked', false);
  $(form+'.city').prop('checked', false);
  $(form+'.note').addClass('hidden');

  // initPlaceholders(form);

};

module.exports.clearEdit = (form, good) => {
  $(form+'.name').val(good.name);
  $(form+'.supplier_email').val(good.email);
  $(form+'.count').val(good.count);
  $(form+'.price').val(priceConverter(good.price));
  $(form+'russia .select_all').prop('checked', good.allCities('russia'));
  $(form+'belorus .select_all').prop('checked', good.allCities('belorus'));
  $(form+'usa .select_all').prop('checked', good.allCities('usa'));
  $(form+'.note').addClass('hidden');

  let cities = $(form+'.cities').toArray();
  let delivery = good.deliveryToArray();
  
  cities.forEach((element, index)=>{
    $(element).prop('checked', delivery[index]);
  });

};

module.exports.clearInvalid = (form) => {

  let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
  forms.forEach((element)=>{
    element.removeClass('invalid');
  });

};
},{"./price_vidget/vidget_price.js":13}],7:[function(require,module,exports){
module.exports.hidNotes = (form) => {
  $(form).parent().siblings('.note').addClass('hidden');
}

module.exports.showNotes = (form) => {
  if($(form).hasClass('name')){
    $(form).parent().siblings('.note').addClass('hidden');
    if($(form).val().length < 5){
      $(form).parent().siblings('.invalid_name_short').removeClass('hidden');
    } else {
      $(form).parent().siblings('.invalid_name_long').removeClass('hidden');
    }
  } else {
    $(form).parent().siblings('.note').removeClass('hidden');
  }
}
},{}],8:[function(require,module,exports){


module.exports.isNameValid = (name) => {
  let workString = name;
  let regExpOnlySpaces = /\S/;
  
  if(!workString.match(regExpOnlySpaces)){
    return false;
  }
  if(workString.length > 15 || workString.length < 5){
    return false;
  }

  return true;

};

module.exports.isEmailValid = (email) => {
  // let regExpEmail = /\w+@\w+.[com|ru|org]/g;
  // let regExpEmail = /(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/;
  let regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(email.match(regExpEmail)){
    return true;
  } else {
    return false;
  };

};

module.exports.isCountValid = (count) => {

  if(isNaN(parseInt(count))){
    return false;
  }

  if(count.length > 0){
    return true;
  } else {
    return false;
  }

};

module.exports.isPriceValid = (price) => {

  
  // let regExpDollar = /\$/;
  // workPrice = workPrice.replace(regExpDollar, '');

  if(isNaN(parseFloat(price))){
    return false;
  }

  if(price.length > 0){
    return true;
  } else {
    return false;
  }

};

},{}],9:[function(require,module,exports){
const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';

module.exports = function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;
  this.hidden = false;
    
  this.description = loremIpsum;
  

  // NOTE: Maybe there is a better way of dealing with delivery data storage
  this.delivery = {
    russia: {
      moscow: russia ? russia[0] ? true : false : false,
      saratov: russia ? russia[1] ? true : false : false,
      spb: russia ? russia[2] ? true : false : false,
    },
    belorus: {
      minsk: belorus ? belorus[0] ? true : false : false,
      hotlany: belorus ? belorus[1] ? true : false : false,
      bobruysk: belorus ? belorus[2] ? true : false : false,
    },
    usa: {
      ny: usa ? usa[0] ? true : false : false,
      washington: usa ? usa[1] ? true : false : false,
      boston: usa ? usa[2] ? true : false : false,
    },
  };

  this.deliveryToArray = () => {
    let resultArray = [];
    for(let country in this.delivery){
      for(let city in this.delivery[country]){
        resultArray.push(this.delivery[country][city]);
      }
    }
    return resultArray;
  }

  this.allCities = (country) => {
    let toReturn = true;
    for(let city in this.delivery[country]){
      if(!this.delivery.russia[city]){
        toReturn = false;
      }
    }
    return toReturn;
  };
}
},{}],10:[function(require,module,exports){
const serverResponseTime = require('./const_serverResponseTime.js');
// const appendDelivery = require('./form_appendDelivery.js');

// const isNameValid = require('./form_validation.js').isNameValid;
// const isEmailValid = require('./form_validation.js').isEmailValid;
// const isCountValid = require('./form_validation.js').isCountValid;
// const isPriceValid = require('./form_validation.js').isPriceValid;

const Good = require('./good_local_object.js');

const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;
const putSemi = require('./price_vidget/vidget_price.js').putSemi;
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

const Row = require('./row_local_object.js');

// const showNotes = require('./form_notes.js').showNotes;
// const hidNotes = require('./form_notes.js').hidNotes;

// const clearEdit = require('./form_cleaners.js').clearEdit;
// const clearInvalid = require('./form_cleaners.js').clearInvalid;

const Form = require('./abstract_class_form/abstract_class_form.js');

class FormGood extends Form {
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp){
    super(jQueryModalFade, jQueryModalAwait);

    this.good = good;
    this.jQueryTemplate = jQueryTemplate;

    this.name = good ? this.good.name : '';
    this.email = good ? this.good.email : '';
    this.count = good ? this.good.count : '';
    this.price = good ? this.good.price : '';

    this._render(modalWindow);
    
    // this.that = '#' + modalWindow;
    
    // this.modal.jQueryModalWindow = $('#'+ modalWindow);
    // this.jQueryElement = this.modal.jQueryModalWindow.find('form');
    // // this._render(modalWindow, citiesTemp);
    // this.appendDelivery(citiesTemp);

    // this.jQueryName = this.jQueryElement.find('input.name');
    // this.jQueryEmail = this.jQueryElement.find('input.supplier_email');
    // this.jQueryCount = this.jQueryElement.find('input.count');
    // this.jQueryPrice = this.jQueryElement.find('input.price');

    // this.jQueryInputs = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    // this.jQueryNotes = this.jQueryElement.find('.note');

    // this.jQueryCities = {};

    // this.jQueryCities.selectAll = this.jQueryElement.find('input.select_all');
    // this.jQueryCities.cities = this.jQueryElement.find('input.city');

    // this.jQueryTrigger = jQueryTrigger;
    // this.jQueryTrigger.click(()=>{this.open()});

    

    // this.jQueryElement.submit((event)=>{
    //   event.preventDefault();
    //   this.submit()
    // });

    // this.jQueryCancel = this.jQueryElement.find('.cancel');
    // this.jQueryCancel.click(()=>{this.cancel()});

  }


  _render(id, citiesTemp) {
    
    $(_.template(this.jQueryTemplate.html())({
      modalId: id,
      email: '',
      name: '',
      count: '',
      price: '$',
      saveId: 'save_add',
      cancelId: 'cancel_add',
    })).appendTo('.main');
    // this.appendDelivery(citiesTemp);
  }

  _defineNotes() {
    this.jQueryNotes = {};
    this.jQueryNotes.nameShort = this.jQueryElement.find('.invalid_name_short'); 
    this.jQueryNotes.nameLong = this.jQueryElement.find('.invalid_name_long'); 
    this.jQueryNotes.email = this.jQueryElement.find('.invalid_email'); 
    this.jQueryNotes.count = this.jQueryElement.find('.invalid_count');
    this.jQueryNotes.price = this.jQueryElement.find('.invalid_price');
  }

  inputsFormat() {
    this.jQueryCount.on('input', (function(){
      const nonDigitRegExp = /\D/;
     

      $(this).val($(this).val().replace(nonDigitRegExp,''));
      

    }));

    this.jQueryPrice.on('input', (function(){
      const nonDigitRegExp = /[^0-9.]/;
      const strayDotRegExp = /\.(?!\d)/g;

      
      $(this).val($(this).val().replace(nonDigitRegExp,''));
      // $(this).val($(this).val().replace(strayDotRegExp,''));
      
      // if($(this).val().charAt(0) === '.'){
      //   $(this).val($(this).val().slice(1));
      // }

      // NOTE: Think how to rewrite this to deal with 'past' and 'present' dot
      if($(this).val().match(/\./g)){
          
          if($(this).val().match(/\./g).length > 1){
          
            const valArray = $(this).val().split('');
            valArray[valArray.indexOf('.')] = '';
            $(this).val(valArray.join(''));
          }
      }
    
    }));
    
    this.jQueryPrice.focus(function(){
      let regExpDollar = /\$/;

      $(this).val($(this).val().replace(/\,/g, ''));
      $(this).val($(this).val().replace(regExpDollar, ''));
    });

    this.jQueryPrice.blur(function(){
      let regExpDollar = /\$/;

      if(!isNaN(parseFloat($(this).val()))){
        $(this).val(putSemi($(this).val()));

        if(!$(this).val().match(regExpDollar)){
          $(this).val('$'.concat($(this).val()));
        }
      }

      const strayDotRegExp = /\.(?!\d)/g;

      $(this).val($(this).val().replace(strayDotRegExp,''));
      
      if($(this).val().charAt(0) === '.'){
        $(this).val($(this).val().slice(1));
      }
    });
    
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
    this.clearInvalid();
    this.hideNotes();
    if(!this.good){
      this.initPlaceholders();
    }
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
    // debugger;
    if(input.hasClass('name')){
      // debugger;
      this.jQueryNotes.nameShort.addClass('hidden');
      this.jQueryNotes.nameLong.addClass('hidden');
      if(input.val().length < 5){
        this.jQueryNotes.nameShort.removeClass('hidden');
      } else {
        his.jQueryNotes.nameLong.removeClass('hidden');
      }
    } else {
      if(input.hasClass('supplier_email')){
        this.jQueryNotes.email.removeClass('hidden');
      } else {
        if(input.hasClass('count')){
          this.jQueryNotes.count.removeClass('hidden');
        }
        else {
          this.jQueryNotes.price.removeClass('hidden');
        }
      }
    }

  }

  hideNote(input) {
    let name = input.attr('name');

    if(name === 'name'){
      this.jQueryNotes.nameShort.addClass('hidden');
      this.jQueryNotes.nameLong.addClass('hidden');
    } else {
      this.jQueryNotes[name].addClass('hidden');
    }

  }

  hideNotes() {
    for(let note in this.jQueryNotes){
      this.jQueryNotes[note].addClass('hidden');
    }
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
    this.checkPlaceholders();
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
        this.initPlaceholders();
      }  
      );
  
     
  
  
    } else {
      this.clearInvalid();
      validation.forEach((element, index)=>{
        if(!element){
          forms[index].addClass('invalid');
          this.showNotes(forms[index]);
        } else {
          this.hideNote(forms[index]);
        }
      });
  
      forms[validation.indexOf(false)].focus();
    }
  }
 

  appendDelivery(citiesTemp) {
    const renderCities = (country, cityNames=[], allChecked) => {
          
    let delivery = [];
  
    if(this.good){
      for(let city in this.good.delivery[country]){
        delivery.push(this.good.delivery[country][city]);
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
    
    // this.modal.jQueryModalWindow.find('.cities')
    
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

    this.that = '#' + modalWindow;
    
    this.modal.jQueryModalWindow = $('#'+ modalWindow);
    this.jQueryElement = this.modal.jQueryModalWindow.find('form');
    // this._render(modalWindow, citiesTemp);
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

    this.inputsFormat();
    this._defineNotes();
    this.initPlaceholders();

    this.jQueryTrigger = jQueryTrigger;
    this.jQueryTrigger.click(()=>{this.open()});

    
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit()
    });

    this.jQueryCancel = this.jQueryElement.find('.cancel');
    this.jQueryCancel.click(()=>{this.cancel()});
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

class FormEdit extends FormGood {
  
  constructor(good=null, jQueryModalFade=null, jQueryModalAwait=null, modalWindow=null, jQueryTrigger, jQueryTemplate, citiesTemp, renderObject){
    super(good, jQueryModalFade, jQueryModalAwait, modalWindow, jQueryTrigger, jQueryTemplate, citiesTemp);

    this.name = this.good.name;
    this.email = this.good.email;
    this.count = this.good.count;
    this.price = this.good.price;
    this.that = '#'+'modal_edit_'+modalWindow;
    this.modal.jQueryModalWindow = $('#'+'modal_edit_'+modalWindow);
    this.citiesChecboxes = good.deliveryToArray()

    

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

    this.inputsFormat();
    this._defineNotes();
    
    this.jQueryElement.submit((event)=>{
      event.preventDefault();
      this.submit()
    });

    this.jQueryCancel = this.jQueryElement.find('.cancel');
    this.jQueryCancel.click(()=>{this.cancel()});
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

  clear() {
    this.jQueryName.val(this.good.name);
    this.jQueryEmail.val(this.good.email);
    this.jQueryCount.val(this.good.count);
    this.jQueryPrice.val(priceConverter(this.good.price));
    this.jQueryCities.selectAll.find('.russia_all').prop('checked', this.good.allCities('russia'));
    this.jQueryCities.selectAll.find('.belorus_all').prop('checked', this.good.allCities('belorus'));
    this.jQueryCities.selectAll.find('.usa_all').prop('checked', this.good.allCities('usa'));
    this.hideNotes();

    let cities = this.jQueryCities.cities.toArray();
    let delivery = this.good.deliveryToArray();
  
    cities.forEach((element, index)=>{
      $(element).prop('checked', delivery[index]);
    });
  }

  submit() {
    this.checkPlaceholders();
    let forms = [this.jQueryName, this.jQueryEmail, this.jQueryCount, this.jQueryPrice];
    
    let validation = [this.isNameValid(forms[0].val()), this.isEmailValid(forms[1].val()), this.isCountValid(forms[2].val()), this.isPriceValid(cleanPriceString(forms[3].val()))];
  
    
    if(validation.every((element)=>{return element;})){

      const editPromise = new Promise((resolve, reject) => {

        setTimeout(()=>{
          this.good.name = this.jQueryName.val();
          this.good.email = this.jQueryEmail.val();
          this.good.count = this.jQueryCount.val();
          this.good.price = priceConverter(this.jQueryPrice.val());
      
          const editCities = () => {
            const countries = [];
            
            for(let country in this.good.delivery) {
              countries.push(country);
            }
  
            countries.forEach( (country)=>{

                for(let city in this.good.delivery[country]){
                  this.good.delivery[country][city] = this.jQueryElement.find('.'+city).prop('checked') ? true : false;
                  console.log(this.good.delivery[country][city]);
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
        this.clearInvalid();
        LIST.render();
      })
  
    } else {
      this.clearInvalid();
      validation.forEach((element, index)=>{
        if(!element){
          forms[index].addClass('invalid');
          this.showNotes(forms[index]);
        } else {
          this.hideNote(forms[index]);
        }
      });
  
      forms[validation.indexOf(false)].focus();
    }
  }
 

}


function GoodsList() {
  this.collection = [];
  this.ascedningName = true;
  this.ascedningPrice = true;


  this.push = (good) => {
    this.collection.push(good);
  };

  this.delete = (good) => {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        this.collection.splice(this.collection.indexOf(good), 1);
        resolve('Good deleted')
      }
    , serverResponseTime);

    }
    
  )};

  this.add = (good) => {

    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        this.push(good);
        resolve('Good deleted')
      }
    , serverResponseTime);

    }

  )};

  this.forEach = (callback) => {
    this.collection.forEach(callback);
  };

  // this.clearEdit = (form, good) => {
  //   $(form+'.name').val(good.name);
  //   $(form+'.supplier_email').val(good.email);
  //   $(form+'.count').val(good.count);
  //   $(form+'.price').val(priceConverter(good.price));
  //   $(form+'russia .select_all').prop('checked', good.allCities('russia'));
  //   $(form+'belorus .select_all').prop('checked', good.allCities('belorus'));
  //   $(form+'usa .select_all').prop('checked', good.allCities('usa'));
  //   $(form+'.note').addClass('hidden');
  
  //   let cities = $(form+'.cities').toArray();
  //   let delivery = good.deliveryToArray();
    
  //   cities.forEach((element, index)=>{
  //     $(element).prop('checked', delivery[index]);
  //   });
  
  // }

  this.sortByName = () => {
    const callback = this.ascedningName ? ((x, y) => {return ('' + x.name).localeCompare(y.name);}) 
                               : ((x, y) => {return ('' + y.name).localeCompare(x.name);}); 
    this.collection.sort(callback)
    this.render();
  };

  this.sortByPrice = () => {
    const callback = this.ascedningPrice ? ((x, y) => {return y.price-x.price;}) : ((x, y) => {return x.price-y.price;}); 
    this.collection.sort(callback);
    this.render();
  };

  this.render = () => {
    $('#table_body').empty();

    // let rowTemp = _.template($("#row_template").html());

    this.forEach((good, number) => {

      good.row = new Row(_.template($("#row_template").html()), '#table_body', number, good);

      if(good.hidden){
        good.row.hide();
      } else {
        good.row.show();
      }
      // $(rowTemp({
      //   idRow: 'table_row_'+number,
      //   name: good.name,
      //   price: priceConverter(good.price),
      //   count: good.count,
      //   idName: 'description_'+number,
      //   idEdit: 'edit_'+number,
      //   idDelete: 'delete_'+number,
      // })).appendTo('#table_body');



    

      // if(good.hidden){
      //   $('#table_row_'+number).addClass('hidden');
      //   $('#table_row_'+number+' *').addClass('hidden');
      // } else {
      //   $('#table_row_'+number).removeClass('hidden');
      //   $('#table_row_'+number+' *').removeClass('hidden');
      // }

      
      good.formEdit = new FormEdit(good, $('#modal_fade'), $('#loading'), number, $('#edit_'+number), $("#modal_edit_template"), '#edit_cities_template');

      // let modalTemp = _.template($("#modal_edit_template").html());

      // $(modalTemp({
      //   modalId: 'modal_edit_'+number,
      //   name: good.name,
      //   price: priceConverter(good.price),
      //   count: good.count,
      //   email: good.email,
      //   saveId: 'modal_save_'+number,
      //   cancelId: 'modal_cancel_'+number,
      // })).appendTo('#table_body');

      // $('#edit_'+number).click(() => {
      //   $(".modal_fade").addClass("modal_fade_trick");
      //   $("#modal_edit_"+number).css("display", "block");
      // });

      // $('#modal_edit_'+number+' form').submit((event) => {
      //   event.preventDefault();

      //   const form = '#modal_edit_'+number+' form ';
      //   let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
      //   let validation = [isNameValid(forms[0].val()), isEmailValid(forms[1].val()), isCountValid(forms[2].val()), isPriceValid(cleanPriceString(forms[3].val()))];

      //   if(validation.every((element)=>{return element;})){

      //     const editPromise = new Promise((resolve, reject) => {

      //       setTimeout(()=>{
      //         good.name = $(form+'.name').val();
      //         good.email = $(form+'.supplier_email').val();
      //         good.count = $(form+'.count').val();
      //         good.price = priceConverter($(form+'.price').val());
          
      //         const editCities = () => {
      //           const countries = [];
                
      //           for(let country in good.delivery) {
      //             countries.push(country);
      //           }
      
      //           countries.forEach( (country)=>{

      //               for(let city in good.delivery[country]){
      //                 good.delivery[country][city] = $(form+'.'+city).prop('checked') ? true : false;
      //               }
      //           }
      //           )
      //         }

      //         editCities();
              
      //         resolve('Edit successful');
      //       }, serverResponseTime);
          
      //     });

      //     $('.loading').css('display', 'block');
      //     editPromise.then((resolved) => {
      //       $(".modal_fade").removeClass("modal_fade_trick");
      //       $('.loading').css('display', 'none');
      //       clearInvalid(form);
      //       clearEdit(form, good);
      //       this.render();
      //     })
      //     // $(".modal_fade").removeClass("modal_fade_trick");
      //     $("#modal_edit_"+number).css("display", "none");
        
      //     // clearInvalid(form);
      //     // clearEdit(form, good);

      //     // LIST.render();
      //   } else {
      //       clearInvalid(form);
      //       validation.forEach((element, index)=>{
      //       if(!element){
      //         forms[index].addClass('invalid');
      //         showNotes(forms[index]);
      //       } else {
      //         hidNotes(forms[index]);
      //       }
      //     });
      
      //     forms[validation.indexOf(false)].focus();
          
      //   }
      // });

      // $('#modal_cancel_'+number).click(() => {
      //   $('.modal_fade').removeClass('modal_fade_trick');
      //   $('#modal_edit_'+number).css('display', 'none');
      //   clearEdit('#modal_edit_'+number+' form ', good);
      //   clearInvalid('#modal_edit_'+number+' form ');
      // });

      // appendDelivery('#modal_edit_'+number, good);

      good.row.defineModalDescription(_.template($('#modal_description_template').html()), 'modal_description_'+number, 'modal_description_close_'+number);

      // DESCRIPTION
      // let descriptionTemp = _.template($('#modal_description_template').html());

      // $(descriptionTemp({
      //   descriptionId: 'modal_description_'+number,
      //   name: good.name,
      //   description: good.description,
      //   closeId: 'modal_description_close_'+number,
        
      // })).appendTo('#table_body');

      // $('#description_'+number).click(() => {
      //   $(".modal_fade").addClass("modal_fade_trick");
      //   $("#modal_description_"+number).css("display", "block");
      // });

      // $("#modal_description_close_"+number).click(() => {
      //   $(".modal_fade").removeClass("modal_fade_trick");
      //   $("#modal_description_"+number).css("display", "none");
      // });

      // $('#modal_edit_'+number+' form').submit((event) => {
      //   event.preventDefault();

      //   const form = '#modal_edit_'+number+' form ';
      //   let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
      //   let validation = [isNameValid(forms[0].val()), isEmailValid(forms[1].val()), isCountValid(forms[2].val()), isPriceValid(cleanPriceString(forms[3].val()))];

      //   if(validation.every((element)=>{return element;})){

      //     const editPromise = new Promise((resolve, reject) => {

      //       setTimeout(()=>{
      //         good.name = $(form+'.name').val();
      //         good.email = $(form+'.supplier_email').val();
      //         good.count = $(form+'.count').val();
      //         good.price = priceConverter($(form+'.price').val());
          
      //         const editCities = () => {
      //           const countries = [];
                
      //           for(let country in good.delivery) {
      //             countries.push(country);
      //           }
      
      //           countries.forEach( (country)=>{

      //               for(let city in good.delivery[country]){
      //                 good.delivery[country][city] = $(form+'.'+city).prop('checked') ? true : false;
      //               }
      //           }
      //           )
      //         }

      //         editCities();
              
      //         resolve('Edit successful');
      //       }, serverResponseTime);
          
      //     });

      //     $('.loading').css('display', 'block');
      //     editPromise.then((resolved) => {
      //       $(".modal_fade").removeClass("modal_fade_trick");
      //       $('.loading').css('display', 'none');
      //       clearInvalid(form);
      //       clearEdit(form, good);
      //       this.render();
      //     })
      //     // $(".modal_fade").removeClass("modal_fade_trick");
      //     $("#modal_edit_"+number).css("display", "none");
        
      //     // clearInvalid(form);
      //     // clearEdit(form, good);

      //     // LIST.render();
      //   } else {
      //       clearInvalid(form);
      //       validation.forEach((element, index)=>{
      //       if(!element){
      //         forms[index].addClass('invalid');
      //         showNotes(forms[index]);
      //       } else {
      //         hidNotes(forms[index]);
      //       }
      //     });
      
      //     forms[validation.indexOf(false)].focus();
          
      //   }
      // });

      // $('#modal_cancel_'+number).click(() => {
      //   $('.modal_fade').removeClass('modal_fade_trick');
      //   $('#modal_edit_'+number).css('display', 'none');
      //   clearEdit('#modal_edit_'+number+' form ', good);
      //   clearInvalid('#modal_edit_'+number+' form ');
      // });

      // $("#modal_description_close_"+number).click(() => {
      //   $(".modal_fade").removeClass("modal_fade_trick");
      //   $("#modal_description_"+number).css("display", "none");
      // });

      const thisCities = $('#modal_edit_'+number+' .cities');

      // appendDelivery('#modal_edit_'+number, good);

      // DELETE
      // let deleteTemp = _.template($('#modal_delete_template').html());

      // $(deleteTemp({
      //   deleteId: 'modal_delete_'+number,
      //   name: good.name,
      //   idYes: 'yes_'+number,
      //   idNo: 'no_'+number,
      // })).appendTo('#table_body');

      // $('#delete_'+number).click(() => {
      //   $('.modal_fade').addClass('modal_fade_trick');
      //   $('#modal_delete_'+number).css('display', 'block');
      // });
      good.row.defineModalDelete(_.template($('#modal_delete_template').html()), 'modal_delete_'+number, 'yes_'+number, 'no_'+number);
  
      good.row.modalDelete.jQueryYes.click(() => {
        const deletePromise = this.delete(good);
        deletePromise.then((resolved)=>{
          this.render();
          $('#modal_fade').removeClass('modal_fade_trick');
          $('#loading').css('display', 'none');
        });
        $('#loading').css('display', 'block');
        // $('.modal_fade').removeClass('modal_fade_trick');
        good.row.modalDelete.jQueryElement.css('display', 'none');
      }); 

      // $('#no_'+number).click(() => {
      //   $('.modal_fade').removeClass('modal_fade_trick');
      //   $('#modal_delete_'+number).css('display', 'none');
      // }); 
  
    });

    // $('.count').on('input', (function(){
    //   const nonDigitRegExp = /\D/;
     

    //   $(this).val($(this).val().replace(nonDigitRegExp,''));
      

    // }));

    // $('.price').on('input', (function(){
    //   const nonDigitRegExp = /[^0-9.]/;
    //   const strayDotRegExp = /\.(?!\d)/g;

      
    //   $(this).val($(this).val().replace(nonDigitRegExp,''));
    //   // $(this).val($(this).val().replace(strayDotRegExp,''));
      
    //   // if($(this).val().charAt(0) === '.'){
    //   //   $(this).val($(this).val().slice(1));
    //   // }

    //   // NOTE: Think how to rewrite this to deal with 'past' and 'present' dot
    //   if($(this).val().match(/\./g)){
          
    //       if($(this).val().match(/\./g).length > 1){
          
    //         const valArray = $(this).val().split('');
    //         valArray[valArray.indexOf('.')] = '';
    //         $(this).val(valArray.join(''));
    //       }
    //   }
    
    // }));
    
    // $('.price').focus(function(){
    //   let regExpDollar = /\$/;

    //   $(this).val($(this).val().replace(/\,/g, ''));
    //   $(this).val($(this).val().replace(regExpDollar, ''));
    // });

    // $('.price').blur(function(){
    //   let regExpDollar = /\$/;

    //   if(!isNaN(parseFloat($(this).val()))){
    //     $(this).val(putSemi($(this).val()));

    //     if(!$(this).val().match(regExpDollar)){
    //       $(this).val('$'.concat($(this).val()));
    //     }
    //   }

    //   const strayDotRegExp = /\.(?!\d)/g;

    //   $(this).val($(this).val().replace(strayDotRegExp,''));
      
    //   if($(this).val().charAt(0) === '.'){
    //     $(this).val($(this).val().slice(1));
    //   }
    // });
    

  };
};

const LIST = new GoodsList();

module.exports.LIST = LIST;
},{"./abstract_class_form/abstract_class_form.js":2,"./const_serverResponseTime.js":4,"./good_local_object.js":9,"./price_vidget/vidget_price.js":13,"./row_local_object.js":14}],11:[function(require,module,exports){
module.exports = function(price){
  return price.replace(/\,/g, '').replace('$', '');
};
},{}],12:[function(require,module,exports){
// const cleanPriceString = require('./putSemi.js');

module.exports = function(price){

  let workString = price.toString();
  let tail = '';

  workString = workString.replace(/\,/g, '');

  if(workString.indexOf('.') !== -1){
    tail = workString.slice(workString.indexOf('.'));
    workString = workString.slice(0, workString.indexOf('.'));
  }

  workString = workString.split('');
  workString.reverse();
  
  let counter = 0;
  for(let i = 0; i < workString.length; i++){
    if(counter < 3) {
      counter++;
    } else {
      
      workString.splice(i, 0, ',');
      counter = 0;
    }
    
  }
  
  workString.reverse();
  
  workString = workString.join('').concat(tail);
  
  return workString;
}
},{}],13:[function(require,module,exports){
const putSemi = require('./putSemi.js');
const cleanPriceString = require('./cleanPriceString.js');

module.exports.cleanPriceString = cleanPriceString;

module.exports.putSemi = putSemi;

module.exports.priceConverter = (price) => {
  let workPrice = price;
  
  if(typeof price === 'number') {
    return '$'+putSemi(workPrice);
  } else {
    
    return parseFloat(cleanPriceString(workPrice));
  }
};

},{"./cleanPriceString.js":11,"./putSemi.js":12}],14:[function(require,module,exports){
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
 

},{"./price_vidget/vidget_price.js":13}]},{},[1]);
