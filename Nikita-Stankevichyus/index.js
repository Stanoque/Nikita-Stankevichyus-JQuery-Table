"use strict";

const Good = require('./src/javascript/good_local_object.js');

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

    currentElement.blur(()=>{
      if(currentElement.val() === ''){
        currentElement.val(text);
        currentElement.addClass('placeholder');
      }
    })

    currentElement.on('input',()=>{
      if(currentElement.val().match(currentElement.attr('my_placeholder'))){
        currentElement.val(currentElement.val().replace(currentElement.attr('my_placeholder'), ''));
        currentElement.removeClass('placeholder');
      }
    });

  },
  enumerable : false
});



let addForm = new FormAdd(null, $('#modal_fade'), $('#loading'), 'modal_add', $('#good_add'), $('#modal_edit_template'), $('#edit_cities_template'), LIST);
let searchForm = new FormSearch($('#modal_fade'), $('#loading'),  $('#search_form'));

$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
  LIST.ascedningName = !LIST.ascedningName;

});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
  LIST.ascedningPrice = !LIST.ascedningPrice;
});


$('.sort_name').click(()=>{
  LIST.sortByName();
});

$('.sort_price').click(()=>{
  LIST.sortByPrice();
});


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

LIST.render();

