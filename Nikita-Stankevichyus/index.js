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

let buttonDelete = $(".button_delete");
let buttonClose = $(".modal_close");

$("#triangle").click(() => {
  $("#triangle").toggleClass('flip');
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
