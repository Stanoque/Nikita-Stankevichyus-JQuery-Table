"use strict";

const LIST = [];

function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;

  this.delivery = {
    russia: russia,
    belorus: belorus,
    usa: usa,
  }
}


LIST.push(new Good('Just Good', 'someemail@gmail.com', 3, 222, [true], [], [true,,true]));
LIST.push(new Good('G Good', 'someeail@gmail.com', 4, 22, [true], [], [true,,true]));
LIST.push(new Good('B Good', 'smeemail@gmail.com', 5, 222, [], [], [true,,true]));
LIST.push(new Good('A Good', 'somemail@gmail.com', 1, 222, [true], [], [,,true]));

let buttonDelete = $(".button_delete");
let buttonClose = $(".modal_close");

$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
});



$("#delete_1").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $(".my_modal_delete").css("display", "block");
});

$("#edit_1").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $(".my_modal_edit").css("display", "block");
});


$(".modal_close").click(() => {
  $(".modal_fade").removeClass("modal_fade_trick");
  $(".my_modal_delete").css("display", "none");
});

$(".modal_cancel").click(() => {
  $(".modal_fade").removeClass("modal_fade_trick");
  $(".my_modal_edit").css("display", "none");
});


let rowTemp = _.template($("#row_template").html());




$("#delete_4").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $(".my_modal_delete").css("display", "block");
});

$("#edit_4").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $(".my_modal_edit").css("display", "block");
});

LIST.forEach((good, number) => {
  $(rowTemp({
    name: good.name,
    price: good.price,
    count: good.count,
    idEdit: 'edit_'+number,
    idDelete: 'delete_'+number,
  })).appendTo('#table_body');

  let modalTemp = _.template($("#modal_edit_template").html());



  $(modalTemp({
    modalId: 'modal_edit_'+number,
    name: good.name,
    price: good.price,
    count: good.count,
    email: good.email,
    city_1: 'FIXME',
    city_2: 'FIXME',
    city_3: 'FIXME',
    saveId: 'modal_save_'+number,
    cancelId: 'modal_cancel_'+number,
  })).appendTo('.main');

  $('#edit_'+number).click(() => {
    $(".modal_fade").addClass("modal_fade_trick");
    $("#modal_edit_"+number).css("display", "block");
  });

  $("#modal_save_"+number).click(() => {
    $(".modal_fade").removeClass("modal_fade_trick");
    $("#modal_edit_"+number).css("display", "none");
  });

  $("#modal_cancel_"+number).click(() => {
    $(".modal_fade").removeClass("modal_fade_trick");
    $("#modal_edit_"+number).css("display", "none");
  });



  // $('#delete_'+number).click(() => {
  //   $('.modal_fade').addClass('modal_fade_trick');
  //   $('#modal_'+number).css('display', 'block');
  // });
  

  
});
