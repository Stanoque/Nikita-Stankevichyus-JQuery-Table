"use strict";

const LIST = [];

function Good(name='', email='', count=0, price=0, delivery={}) {

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;

  this.delivery = delivery;
}

LIST.push(new Good('Just Good', 'someemail@gmail.com', 3, 222, {
  russia: ['Москва', 'Саратов', 'Санкт-Петербург'],
  belorus: ['Минск', 'Хотляны', 'Бобруйск'],
  usa: ['Нью-Йорк', 'Вашингтон', 'Бостон']
}));
LIST.push(new Good('G Good', 'someeail@gmail.com', 4, 22, {
  russia: ['Москва', 'Санкт-Петербург'],
  belorus: ['Минск'],
}));
LIST.push(new Good('B Good', 'smeemail@gmail.com',11, 100500, {
}));
LIST.push(new Good('A Good', 'somemail@gmail.com', 1, Infinity, {
  belorus: ['Хотляны'],
}));

let buttonDelete = $(".button_delete");
let buttonClose = $(".modal_close");

$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
});




let rowTemp = _.template($("#row_template").html());


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
    saveId: 'modal_save_'+number,
    cancelId: 'modal_cancel_'+number,
  })).appendTo('.main');

  const cityCleaner = () => {
    
    $('#modal_edit_'+number+' .label_city span').each(
      (index, element) => {
        
        if($(element).html()===''){
          $(element).parent().empty();
        }
      } 
    );

  }

  cityCleaner();

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


  const thisCities = $('#modal_edit_'+number+' .cities');

  let citiesTemp = _.template($('#edit_cities_template').html());
  
  $(citiesTemp({
    country: 'russia',
    city_1: good.delivery.russia ? good.delivery.russia[0] ? good.delivery.russia[0] : '' : '',
    city_2: good.delivery.russia ? good.delivery.russia[1] ? good.delivery.russia[1] : '' : '',
    city_3: good.delivery.russia ? good.delivery.russia[2] ? good.delivery.russia[2] : '' : '',
  })).appendTo($('#modal_edit_'+number+' .cities'));  

  $(citiesTemp({
    country: 'belorus',
    city_1: good.delivery.belorus ? good.delivery.belorus[0] ? good.delivery.belorus[0] : '' : '',
    city_2: good.delivery.belorus ? good.delivery.belorus[1] ? good.delivery.belorus[1] : '' : '',
    city_3: good.delivery.belorus ? good.delivery.belorus[2] ? good.delivery.belorus[2] : '' : '',
  })).appendTo($('#modal_edit_'+number+' .cities'));

  $(citiesTemp({
    country: 'usa',
    city_1: good.delivery.usa ? good.delivery.usa[0] ? good.delivery.usa[0] : '' : '',
    city_2: good.delivery.usa ? good.delivery.usa[1] ? good.delivery.usa[1] : '' : '',
    city_3: good.delivery.usa ? good.delivery.usa[2] ? good.delivery.usa[2] : '' : '',
  })).appendTo($('#modal_edit_'+number+' .cities')); 
  
  const russia = $('#modal_edit_'+number+' .russia');
  const belorus = $('#modal_edit_'+number+' .belorus');
  const usa = $('#modal_edit_'+number+' .usa');

  const russiaCities = $('#modal_edit_'+number+' .russia_cities');
  const belorusCities = $('#modal_edit_'+number+' .belorus_cities');
  const usaCities = $('#modal_edit_'+number+' .usa_cities');

  const russiaAll = $('#modal_edit_'+number+' .russia_cities .select_all');
  const belorusAll = $('#modal_edit_'+number+' .belorus_cities .select_all');
  const usaAll = $('#modal_edit_'+number+' .usa_cities .select_all');

  $(russiaCities).removeClass('hidden');

  $(russia).click(() => {

    $(belorusCities).addClass('hidden');
    $(usaCities).addClass('hidden');
    $(russiaCities).removeClass('hidden');

  });

  $(belorus).click(() => {

    $(russiaCities).addClass('hidden');
    $(usaCities).addClass('hidden');
    $(belorusCities).removeClass('hidden');

  });

  $(usa).click(() => {

    $(russiaCities).addClass('hidden');
    $(belorusCities).addClass('hidden');
    $(usaCities).removeClass('hidden');

  });

  $(russiaAll).click(() => {

    if($('#modal_edit_'+number+' .russia_cities .city').attr('checked')){
      $('#modal_edit_'+number+' .russia_cities .city').attr('checked', false);
    } else {
      $('#modal_edit_'+number+' .russia_cities .city').attr('checked', true);
    }

  });

  $(belorusAll).click(() => {

    if($('#modal_edit_'+number+' .belorus_cities .city').attr('checked')){
      $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', false);
    } else {
      $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', true);
    }

  });

  $(usaAll).click(() => {

    if($('#modal_edit_'+number+' .usa_cities .city').attr('checked')){
      $('#modal_edit_'+number+' .usa_cities .city').attr('checked', false);
    } else {
      $('#modal_edit_'+number+' .usa_cities .city').attr('checked', true);
    }

  });

  // $('#modal_edit_'+number+' .russia').click(() => {

  //   $('#modal_edit_'+number+' .cities').empty();

  //   let citiesTemp = _.template($('#edit_cities_template').html());

  //   $('#modal_edit_'+number+' .cities').html(
  //     citiesTemp({
  //       city_1: good.delivery.russia ? good.delivery.russia[0] ? good.delivery.russia[0] : '' : '',
  //       city_2: good.delivery.russia ? good.delivery.russia[1] ? good.delivery.russia[1] : '' : '',
  //       city_3: good.delivery.russia ? good.delivery.russia[2] ? good.delivery.russia[2] : '' : '',
  //     })
  //   );

  //   cityCleaner();

  // }); 


  // $('#modal_edit_'+number+' .belorus').click(() => {

  //   $('#modal_edit_'+number+' .cities').empty();

  //   let citiesTemp = _.template($('#edit_cities_template').html());

  //   $('#modal_edit_'+number+' .cities').html(
  //     citiesTemp({
  //       city_1: good.delivery.belorus ? good.delivery.belorus[0] ? good.delivery.belorus[0] : '' : '',
  //       city_2: good.delivery.belorus ? good.delivery.belorus[1] ? good.delivery.belorus[1] : '' : '',
  //       city_3: good.delivery.belorus ? good.delivery.belorus[2] ? good.delivery.belorus[2] : '' : '',
  //     })
  //   );

  //   cityCleaner();

  // });

  
  // $('#modal_edit_'+number+' .usa').click(() => {

  //   $('#modal_edit_'+number+' .cities').empty();

  //   let citiesTemp = _.template($('#edit_cities_template').html());

  //   $('#modal_edit_'+number+' .cities').html(
  //     citiesTemp({
  //       city_1: good.delivery.usa ? good.delivery.usa[0] ? good.delivery.usa[0] : '' : '',
  //       city_2: good.delivery.usa ? good.delivery.usa[1] ? good.delivery.usa[1] : '' : '',
  //       city_3: good.delivery.usa ? good.delivery.usa[2] ? good.delivery.usa[2] : '' : '',
  //     })
  //   );

  //   cityCleaner();

  // });

  let deleteTemp = _.template($('#modal_delete_template').html());

  $(deleteTemp({
    deleteId: 'modal_delete_'+number,
    idYes: 'yes_'+number,
    idNo: 'no_'+number,
  })).appendTo('.main');

  $('#delete_'+number).click(() => {
    $('.modal_fade').addClass('modal_fade_trick');
    $('#modal_delete_'+number).css('display', 'block');
  });
  
  $('#yes_'+number).click(() => {
    $('.modal_fade').removeClass('modal_fade_trick');
    $('#modal_delete_'+number).css('display', 'none');
  }); 

  $('#no_'+number).click(() => {
    $('.modal_fade').removeClass('modal_fade_trick');
    $('#modal_delete_'+number).css('display', 'none');
  }); 
  
});
