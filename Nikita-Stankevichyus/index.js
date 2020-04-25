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

const FormAdd = require('./src/javascript/classes_formGood.js').FormAdd;

const serverResponseTime = require('./src/javascript/const_serverResponseTime.js');
const LIST = require('./src/javascript/LIST.js');

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

    currentElement.focus(()=>{
      if(currentElement.val() === text){
        currentElement.val('');
        currentElement.removeClass('placeholder');
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


$('.modal_fade').addClass('modal_fade_trick');
$('.loading').css('display', 'block');
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

let addForm = new FormAdd(null, $('#modal_fade'), $('#loading'), 'modal_add', $('#good_add'), $('#modal_edit_template'), $('#edit_cities_template'), LIST.collection);


$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
  LIST.ascedningName = !LIST.ascedningName;

});



$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
  LIST.ascedningPrice = !LIST.ascedningPrice;
});





$('#search_form').submit((event)=>{
  event.preventDefault();
  const form = '#search_form ';
  const input = $(form+'input');

  const toSearch = input.val();
  const regExpToFilter = new RegExp(toSearch, 'i');

  LIST.forEach((good)=>{
    if(!good.name.match(regExpToFilter)){
      good.hidden = true; 
    } else {
      good.hidden = false;
    }
  });

  LIST.render();
})

$('.sort_name').click(()=>{
  LIST.sortByName();
});

$('.sort_price').click(()=>{
  LIST.sortByPrice();
});

$('#search_form'+' input').addPlaceholder('Enter name...');

initPlaceholders('#modal_add');

LIST.render();

