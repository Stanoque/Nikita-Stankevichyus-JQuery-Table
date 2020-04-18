"use strict";

function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

  this.name = name;
  this.email = email;
  this.count = count;
  this.price = price;

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

  this.russiaAllCities = () => {
    let toReturn = true;
    for(let city in this.delivery.russia){
      if(!this.delivery.russia[city]){
        toReturn = false;
      }
    }
    return toReturn;
  };

  this.belorusAllCities = () => {
    let toReturn = true;
    for(let city in this.delivery.belorus){
      if(!this.delivery.belorus[city]){
        toReturn = false;
      }
    }
    return toReturn;
  };

  this.usaAllCities = () => {
    let toReturn = true;
    for(let city in this.delivery.usa){
      if(!this.delivery.usa[city]){
        toReturn = false;
      }
    }
    return toReturn;
  };
}

let appendDelivery = function(whereTo, good) {

  let citiesTemp = _.template($('#edit_cities_template').html());
  
      $(citiesTemp({
        country: 'russia',
        city_1: 'Moscow',
        city_2: 'Saratov',
        city_3: 'SPb',
        attr_1: good ? good.delivery.russia.moscow ? 'checked' : null : null,
        attr_2: good ? good.delivery.russia.saratov ? 'checked' : null : null,
        attr_3: good ? good.delivery.russia.spb ? 'checked' : null : null,
        attr_4: good ? good.russiaAllCities() ? 'checked' : null : null,
      })).appendTo($(whereTo + ' .cities'));  

      $(citiesTemp({
        country: 'belorus',
        city_1: 'Minsk',
        city_2: 'Hotlany',
        city_3: 'Bobruysk',
        attr_1: good ? good.delivery.belorus.minsk ? 'checked' : null : null,
        attr_2: good ? good.delivery.belorus.hotlany ? 'checked' : null : null,
        attr_3: good ? good.delivery.belorus.bobruysk ? 'checked' : null : null,
        attr_4: good ? good.belorusAllCities() ? 'checked' : null : null,
      })).appendTo($(whereTo + ' .cities'));  

      $(citiesTemp({
        country: 'usa',
        city_1: 'NY',
        city_2: 'Washington',
        city_3: 'Boston',
        attr_1: good ? good.delivery.usa.ny ? 'checked' : null : null,
        attr_2: good ? good.delivery.usa.washington ? 'checked' : null : null,
        attr_3: good ? good.delivery.usa.boston ? 'checked' : null : null,
        attr_4: good ? good.usaAllCities() ? 'checked' : null : null,
      })).appendTo($(whereTo + ' .cities'));  
  
      const russia = $(whereTo + ' .russia');
      const belorus = $(whereTo + ' .belorus');
      const usa = $(whereTo + ' .usa');

      const russiaCities = $(whereTo + ' .russia_cities');
      const belorusCities = $(whereTo + ' .belorus_cities');
      const usaCities = $(whereTo + ' .usa_cities');

      const russiaAll = $(whereTo + ' .russia_cities .select_all');
      const belorusAll = $(whereTo + ' .belorus_cities .select_all');
      const usaAll = $(whereTo + ' .usa_cities .select_all');

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

        if($(whereTo + ' .russia_cities .city').attr('checked')){
          $(whereTo + ' .russia_cities .city').attr('checked', false);
        } else {
         $(whereTo + ' .russia_cities .city').attr('checked', true);
        }

      });

      $(belorusAll).click(() => {

        if($(whereTo + ' .belorus_cities .city').attr('checked')){
          $(whereTo + ' .belorus_cities .city').attr('checked', false);
        } else {
          $(whereTo + ' .belorus_cities .city').attr('checked', true);
        }

        });

      $(usaAll).click(() => {

        if($(whereTo + ' .usa_cities .city').attr('checked')){
          $(whereTo + ' .usa_cities .city').attr('checked', false);
        } else {
         $(whereTo + ' .usa_cities .city').attr('checked', true);
        }

      });
}

const LIST = {
  collection: [],
  push: (good) => {
    LIST.collection.push(good);
  },
  
  delete: (good) => {
    LIST.collection.splice(LIST.collection.indexOf(good), 1);
    LIST.render();
  },

  add: (good) => {
    LIST.push(good);
    LIST.render();
  },

  forEach: (callback) => {
    LIST.collection.forEach(callback);
  },

  render: () => {
    $('#table_body').empty();

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
      })).appendTo('#table_body');

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

      appendDelivery('#modal_edit_'+number, good);
      // let citiesTemp = _.template($('#edit_cities_template').html());
  
      // $(citiesTemp({
      //   country: 'russia',
      //   city_1: 'Moscow',
      //   city_2: 'Saratov',
      //   city_3: 'SPb',
      //   attr_1: good.delivery.russia.moscow ? 'checked' : null,
      //   attr_2: good.delivery.russia.saratov ? 'checked' : null,
      //   attr_3: good.delivery.russia.spb ? 'checked' : null,
      //   attr_4: good.russiaAllCities() ? 'checked' : null,
      // })).appendTo($('#modal_edit_'+number+' .cities'));  

      // $(citiesTemp({
      //   country: 'belorus',
      //   city_1: 'Minsk',
      //   city_2: 'Hotlany',
      //   city_3: 'Bobruysk',
      //   attr_1: good.delivery.belorus.minsk ? 'checked' : null,
      //   attr_2: good.delivery.belorus.hotlany ? 'checked' : null,
      //   attr_3: good.delivery.belorus.bobruysk ? 'checked' : null,
      //   attr_4: good.belorusAllCities() ? 'checked' : null,
      // })).appendTo($('#modal_edit_'+number+' .cities'));

      // $(citiesTemp({
      //   country: 'usa',
      //   city_1: 'NY',
      //   city_2: 'Washington',
      //   city_3: 'Boston',
      //   attr_1: good.delivery.usa.ny ? 'checked' : null,
      //   attr_2: good.delivery.usa.washington ? 'checked' : null,
      //   attr_3: good.delivery.usa.boston ? 'checked' : null,
      //   attr_4: good.usaAllCities() ? 'checked' : null,
      // })).appendTo($('#modal_edit_'+number+' .cities')); 
  
      // const russia = $('#modal_edit_'+number+' .russia');
      // const belorus = $('#modal_edit_'+number+' .belorus');
      // const usa = $('#modal_edit_'+number+' .usa');

      // const russiaCities = $('#modal_edit_'+number+' .russia_cities');
      // const belorusCities = $('#modal_edit_'+number+' .belorus_cities');
      // const usaCities = $('#modal_edit_'+number+' .usa_cities');

      // const russiaAll = $('#modal_edit_'+number+' .russia_cities .select_all');
      // const belorusAll = $('#modal_edit_'+number+' .belorus_cities .select_all');
      // const usaAll = $('#modal_edit_'+number+' .usa_cities .select_all');

      // $(russiaCities).removeClass('hidden');

      // $(russia).click(() => {

      //   $(belorusCities).addClass('hidden');
      //   $(usaCities).addClass('hidden');
      //   $(russiaCities).removeClass('hidden');

      // });

      // $(belorus).click(() => {

      //   $(russiaCities).addClass('hidden');
      //   $(usaCities).addClass('hidden');
      //   $(belorusCities).removeClass('hidden');

      // });

      // $(usa).click(() => {

      //   $(russiaCities).addClass('hidden');
      //   $(belorusCities).addClass('hidden');
      //   $(usaCities).removeClass('hidden');

      // });

      // $(russiaAll).click(() => {

      //   if($('#modal_edit_'+number+' .russia_cities .city').attr('checked')){
      //     $('#modal_edit_'+number+' .russia_cities .city').attr('checked', false);
      //   } else {
      //    $('#modal_edit_'+number+' .russia_cities .city').attr('checked', true);
      //   }

      // });

      // $(belorusAll).click(() => {

      //   if($('#modal_edit_'+number+' .belorus_cities .city').attr('checked')){
      //     $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', false);
      //   } else {
      //     $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', true);
      //   }

      //   });

      // $(usaAll).click(() => {

      //   if($('#modal_edit_'+number+' .usa_cities .city').attr('checked')){
      //     $('#modal_edit_'+number+' .usa_cities .city').attr('checked', false);
      //   } else {
      //    $('#modal_edit_'+number+' .usa_cities .city').attr('checked', true);
      //   }

      // });

      let deleteTemp = _.template($('#modal_delete_template').html());

      $(deleteTemp({
        deleteId: 'modal_delete_'+number,
        idYes: 'yes_'+number,
        idNo: 'no_'+number,
      })).appendTo('#table_body');

      $('#delete_'+number).click(() => {
        $('.modal_fade').addClass('modal_fade_trick');
        $('#modal_delete_'+number).css('display', 'block');
      });
  
      $('#yes_'+number).click(() => {
        LIST.delete(good);
        $('.modal_fade').removeClass('modal_fade_trick');
        $('#modal_delete_'+number).css('display', 'none');
      }); 

      $('#no_'+number).click(() => {
        $('.modal_fade').removeClass('modal_fade_trick');
        $('#modal_delete_'+number).css('display', 'none');
      }); 
  
    });



  },
};


LIST.push(new Good('Just Good', 'someemail@gmail.com', 3, 222, [true, true, true],[true, true, true],[true, true, true]));
LIST.push(new Good('G Good', 'someeail@gmail.com', 4, 22, [true, true, true],[false, false, true],[true, true, true]));
LIST.push(new Good('B Good', 'smeemail@gmail.com',11, 100500, [true, true, true],[false, true, true],[true, true, true]));
LIST.push(new Good('A Good', 'somemail@gmail.com', 1, Infinity, [true, true, true],[true, true, true],[true, true, true]));

let buttonDelete = $(".button_delete");
let buttonClose = $(".modal_close");
let modalTemp = _.template($("#modal_edit_template").html());

$(modalTemp({
  modalId: 'modal_add',
  email: 'Enter email',
  name: 'Add new product',
  count: 'Enter stocks amount',
  price: 'Enter price',
  saveId: 'save_add',
  cancelId: 'cancel_add',
})).appendTo('.main');

$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
});

appendDelivery('#modal_add', null);

$("#good_add").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $("#modal_add").css("display", "block");
});

$('#modal_add form').submit((event) => {
  event.preventDefault();
  const form = '#modal_add form ';
  LIST.add(new Good(
    $(form+'.name').val(),
    $(form+'.supplier_email').val(),
    $(form+'.count').val(),
    $(form+'.price').val(), 
    [$(form+'.russia_cities .city_1').attr('check') ? true : false, 
     $(form+'.russia_cities .city_2').attr('check') ? true : false,
     $(form+'.russia_cities .city_3').attr('check') ? true : false], 
    [$(form+'.belorus_cities .city_1').attr('check') ? true : false, 
     $(form+'.belorus_cities .city_2').attr('check') ? true : false,
     $(form+'.belorus_cities .city_3').attr('check') ? true : false], 
    [$(form+'.usa_cities .city_1').attr('check') ? true : false, 
     $(form+'.usa_cities .city_2').attr('check') ? true : false,
     $(form+'.usa_cities .city_3').attr('check') ? true : false], 
  ));
  $(".modal_fade").removeClass("modal_fade_trick");  
  $('#modal_add').css('display', 'none');
  LIST.render();
});

LIST.render();



// let rowTemp = _.template($("#row_template").html());

// LIST.forEach((good, number) => {
//   $(rowTemp({
//     name: good.name,
//     price: good.price,
//     count: good.count,
//     idEdit: 'edit_'+number,
//     idDelete: 'delete_'+number,
//   })).appendTo('#table_body');

//   let modalTemp = _.template($("#modal_edit_template").html());

//   $(modalTemp({
//     modalId: 'modal_edit_'+number,
//     name: good.name,
//     price: good.price,
//     count: good.count,
//     email: good.email,
//     saveId: 'modal_save_'+number,
//     cancelId: 'modal_cancel_'+number,
//   })).appendTo('.main');

//   const cityCleaner = () => {
    
//     $('#modal_edit_'+number+' .label_city span').each(
//       (index, element) => {
        
//         if($(element).html()===''){
//           $(element).parent().empty();
//         }
//       } 
//     );

//   }

//   cityCleaner();

//   $('#edit_'+number).click(() => {
//     $(".modal_fade").addClass("modal_fade_trick");
//     $("#modal_edit_"+number).css("display", "block");
//   });

//   $("#modal_save_"+number).click(() => {
//     $(".modal_fade").removeClass("modal_fade_trick");
//     $("#modal_edit_"+number).css("display", "none");
//   });

//   $("#modal_cancel_"+number).click(() => {
//     $(".modal_fade").removeClass("modal_fade_trick");
//     $("#modal_edit_"+number).css("display", "none");
//   });


//   const thisCities = $('#modal_edit_'+number+' .cities');

//   let citiesTemp = _.template($('#edit_cities_template').html());
  
//   $(citiesTemp({
//     country: 'russia',
//     city_1: 'Moscow',
//     city_2: 'Saratov',
//     city_3: 'SPb',
//     attr_1: good.delivery.russia.moscow ? 'checked' : null,
//     attr_2: good.delivery.russia.saratov ? 'checked' : null,
//     attr_3: good.delivery.russia.spb ? 'checked' : null,
//     attr_4: good.russiaAllCities() ? 'checked' : null,
//   })).appendTo($('#modal_edit_'+number+' .cities'));  

//   $(citiesTemp({
//     country: 'belorus',
//     city_1: 'Minsk',
//     city_2: 'Hotlany',
//     city_3: 'Bobruysk',
//     attr_1: good.delivery.belorus.minsk ? 'checked' : null,
//     attr_2: good.delivery.belorus.hotlany ? 'checked' : null,
//     attr_3: good.delivery.belorus.bobruysk ? 'checked' : null,
//     attr_4: good.belorusAllCities() ? 'checked' : null,
//   })).appendTo($('#modal_edit_'+number+' .cities'));

//   $(citiesTemp({
//     country: 'usa',
//     city_1: 'NY',
//     city_2: 'Washington',
//     city_3: 'Boston',
//     attr_1: good.delivery.usa.ny ? 'checked' : null,
//     attr_2: good.delivery.usa.washington ? 'checked' : null,
//     attr_3: good.delivery.usa.boston ? 'checked' : null,
//     attr_4: good.usaAllCities() ? 'checked' : null,
//   })).appendTo($('#modal_edit_'+number+' .cities')); 
  
//   const russia = $('#modal_edit_'+number+' .russia');
//   const belorus = $('#modal_edit_'+number+' .belorus');
//   const usa = $('#modal_edit_'+number+' .usa');

//   const russiaCities = $('#modal_edit_'+number+' .russia_cities');
//   const belorusCities = $('#modal_edit_'+number+' .belorus_cities');
//   const usaCities = $('#modal_edit_'+number+' .usa_cities');

//   const russiaAll = $('#modal_edit_'+number+' .russia_cities .select_all');
//   const belorusAll = $('#modal_edit_'+number+' .belorus_cities .select_all');
//   const usaAll = $('#modal_edit_'+number+' .usa_cities .select_all');

//   $(russiaCities).removeClass('hidden');

//   $(russia).click(() => {

//     $(belorusCities).addClass('hidden');
//     $(usaCities).addClass('hidden');
//     $(russiaCities).removeClass('hidden');

//   });

//   $(belorus).click(() => {

//     $(russiaCities).addClass('hidden');
//     $(usaCities).addClass('hidden');
//     $(belorusCities).removeClass('hidden');

//   });

//   $(usa).click(() => {

//     $(russiaCities).addClass('hidden');
//     $(belorusCities).addClass('hidden');
//     $(usaCities).removeClass('hidden');

//   });

//   $(russiaAll).click(() => {

//     if($('#modal_edit_'+number+' .russia_cities .city').attr('checked')){
//       $('#modal_edit_'+number+' .russia_cities .city').attr('checked', false);
//     } else {
//       $('#modal_edit_'+number+' .russia_cities .city').attr('checked', true);
//     }

//   });

//   $(belorusAll).click(() => {

//     if($('#modal_edit_'+number+' .belorus_cities .city').attr('checked')){
//       $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', false);
//     } else {
//       $('#modal_edit_'+number+' .belorus_cities .city').attr('checked', true);
//     }

//   });

//   $(usaAll).click(() => {

//     if($('#modal_edit_'+number+' .usa_cities .city').attr('checked')){
//       $('#modal_edit_'+number+' .usa_cities .city').attr('checked', false);
//     } else {
//       $('#modal_edit_'+number+' .usa_cities .city').attr('checked', true);
//     }

//   });

//   let deleteTemp = _.template($('#modal_delete_template').html());

//   $(deleteTemp({
//     deleteId: 'modal_delete_'+number,
//     idYes: 'yes_'+number,
//     idNo: 'no_'+number,
//   })).appendTo('.main');

//   $('#delete_'+number).click(() => {
//     $('.modal_fade').addClass('modal_fade_trick');
//     $('#modal_delete_'+number).css('display', 'block');
//   });
  
//   $('#yes_'+number).click(() => {
//     $('.modal_fade').removeClass('modal_fade_trick');
//     $('#modal_delete_'+number).css('display', 'none');
//   }); 

//   $('#no_'+number).click(() => {
//     $('.modal_fade').removeClass('modal_fade_trick');
//     $('#modal_delete_'+number).css('display', 'none');
//   }); 
  
// });
