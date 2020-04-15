"use strict";

const list = {};

function Good(name='', email='', count=0, price=0, places={}) {

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;

  this.delivery = places;
}

let kek = new Good('kek', 'shek', 'cheburek', 0, {
  russia: ['moscow', 'spb'],
  belarus: ['hotlany'],
});

let triangle = $("#triangle");
let buttonEdit = $(".button_edit");
let buttonClose = $(".modal_close");

triangle.click(() => {
  triangle.toggleClass('flip');
});


buttonEdit.click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $(".my_modal").css("display", "block");
});

buttonClose.click(() => {
  $(".modal_fade").removeClass("modal_fade_trick");
  $(".my_modal").css("display", "none");
});
