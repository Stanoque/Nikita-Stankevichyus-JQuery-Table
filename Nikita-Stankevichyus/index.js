"use strict";

const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';


function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

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

  // FIXME: These three can be presented by one function
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

const showNotes = (form) => {
  if($(form).hasClass('name')){
    if($(form).val().length < 5){
      $(form).parent().siblings('.invalid_name_short').toggleClass('hidden');
    } else {
      $(form).parent().siblings('.invalid_name_long').toggleClass('hidden');
    }
  } else {
    $(form).parent().siblings('.note').toggleClass('hidden');
  }
}

const putSemi = (price) => {


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

const cleanPriceString = (price) => {
  
  return price.replace(/\,/g, '').replace('$', '');
};

const priceConverter = (price) => {
  let workPrice = price;
  
  if(typeof price === 'number') {
    return '$'+putSemi(workPrice);
  } else {
    
    return parseFloat(cleanPriceString(workPrice));
  }
};

const isNameValid = (name) => {
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

const isEmailValid = (email) => {
  let regExpEmail = /\w+@\w+.[com|ru|org]/g;

  if(email.match(regExpEmail)){
    return true;
  } else {
    return false;
  };

};

const isCountValid = (count) => {

  if(count.length > 0){
    return true;
  } else {
    return false;
  }

};

const isPriceValid = (price) => {

  let workPrice = price;
  // let regExpDollar = /\$/;
  // workPrice = workPrice.replace(regExpDollar, '');

  if(workPrice.length > 0){
    return true;
  } else {
    return false;
  }

};

const clearAdd = (form) => {
  $(form+'.name').val('');
  $(form+'.supplier_email').val('');
  $(form+'.count').val('');
  $(form+'.price').val('$');
  $(form+'.select_all').prop('checked', false);
  $(form+'.city').prop('checked', false);
  $(form+'.note').addClass('hidden');
};

const clearEdit = (form, good) => {
  $(form+'.name').val(good.name);
  $(form+'.supplier_email').val(good.email);
  $(form+'.count').val(good.count);
  $(form+'.price').val(priceConverter(good.price));
  $(form+'russia .select_all').prop('checked', good.russiaAllCities());
  $(form+'belorus .select_all').prop('checked', good.belorusAllCities());
  $(form+'usa .select_all').prop('checked', good.usaAllCities());
  $(form+'.note').addClass('hidden');

  let cities = $(form+'.cities').toArray();
  let delivery = good.deliveryToArray();
  
  cities.forEach((element, index)=>{
    $(element).prop('checked', delivery[index]);
  });

}

const clearInvalid = (form) => {

  let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
  forms.forEach((element)=>{
    element.removeClass('invalid');
  });

}

let appendDelivery = function(whereTo, good) {

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
          attr_1: delivery[0] ? 'checked' : null,
          attr_2: delivery[1] ? 'checked' : null,
          attr_3: delivery[2] ? 'checked' : null,
          attr_4: allChecked ? 'checked' : null,
        })).appendTo($(whereTo + ' .cities'));
      };

      renderCities('russia', ['Moscow', 'Saratov', 'SPb'], good ? good.russiaAllCities() : false);
      renderCities('belorus', ['Minsk', 'Hotlany', 'Bobruysk'], good ? good.belorusAllCities() : false);
      renderCities('usa', ['NY', 'Washington', 'Boston'], good ? good.usaAllCities() : false);

      // FIXME: These three can be presented by one function
      // DONE
      // $(citiesTemp({
      //   country: 'russia',
      //   city_1: 'Moscow',
      //   city_2: 'Saratov',
      //   city_3: 'SPb',
      //   attr_1: good ? good.delivery.russia.moscow ? 'checked' : null : null,
      //   attr_2: good ? good.delivery.russia.saratov ? 'checked' : null : null,
      //   attr_3: good ? good.delivery.russia.spb ? 'checked' : null : null,
      //   attr_4: good ? good.russiaAllCities() ? 'checked' : null : null,
      // })).appendTo($(whereTo + ' .cities'));  

      // $(citiesTemp({
      //   country: 'belorus',
      //   city_1: 'Minsk',
      //   city_2: 'Hotlany',
      //   city_3: 'Bobruysk',
      //   attr_1: good ? good.delivery.belorus.minsk ? 'checked' : null : null,
      //   attr_2: good ? good.delivery.belorus.hotlany ? 'checked' : null : null,
      //   attr_3: good ? good.delivery.belorus.bobruysk ? 'checked' : null : null,
      //   attr_4: good ? good.belorusAllCities() ? 'checked' : null : null,
      // })).appendTo($(whereTo + ' .cities'));  

      // $(citiesTemp({
      //   country: 'usa',
      //   city_1: 'NY',
      //   city_2: 'Washington',
      //   city_3: 'Boston',
      //   attr_1: good ? good.delivery.usa.ny ? 'checked' : null : null,
      //   attr_2: good ? good.delivery.usa.washington ? 'checked' : null : null,
      //   attr_3: good ? good.delivery.usa.boston ? 'checked' : null : null,
      //   attr_4: good ? good.usaAllCities() ? 'checked' : null : null,
      // })).appendTo($(whereTo + ' .cities'));  


      // FIXME: Do something with this hell
      // DONE
      // const russia = $(whereTo + ' .russia');
      // const belorus = $(whereTo + ' .belorus');
      // const usa = $(whereTo + ' .usa');

      let countries = $(whereTo + ' .countries').children();

      countries = countries.toArray();

      const cities = countries.map((country)=>{

        let citiesClass = ' .'+$(country).attr('class')+'_cities';
        return $(whereTo + citiesClass);

      });

      // const russiaCities = $(whereTo + ' .russia_cities');
      // const belorusCities = $(whereTo + ' .belorus_cities');
      // const usaCities = $(whereTo + ' .usa_cities');

      // const cities = [russiaCities, belorusCities, usaCities];

      // const russiaAll = $(whereTo + ' .russia_cities .select_all');
      // const belorusAll = $(whereTo + ' .belorus_cities .select_all');
      // const usaAll = $(whereTo + ' .usa_cities .select_all');

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

      // FIXME: These three can be preseneted by one function 
      // DONE
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

      // FIXME: These three can be preseneted by one function
      // DONE

      const selectAll = (countrySelectAll) => {
        $(countrySelectAll).click(() => {
          $(countrySelectAll).parent().siblings().children('.city').prop('checked', $(countrySelectAll).prop('checked'));
          // $(whereTo + ' .russia_cities .city').prop('checked', $(russiaAll).prop('checked'));
        });
      }

      cities.forEach((country)=>{
       selectAll($(country).find('.select_all')); 
      })
}

const LIST = {
  collection: [],
  ascedningName: true,
  ascedningPrice: true,
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

  sortByName: () => {
    const callback = LIST.ascedningName ? ((x, y) => {return ('' + x.name).localeCompare(y.name);}) 
                               : ((x, y) => {return ('' + y.name).localeCompare(x.name);}); 
    LIST.collection.sort(callback)
    LIST.render();
  },

  sortByPrice: () => {
    const callback = LIST.ascedningPrice ? ((x, y) => {return y.price-x.price;}) : ((x, y) => {return x.price-y.price;}); 
    LIST.collection.sort(callback);
    LIST.render();
  },

  render: () => {
    $('#table_body').empty();

    let rowTemp = _.template($("#row_template").html());

    LIST.forEach((good, number) => {
      $(rowTemp({
        idRow: 'table_row_'+number,
        name: good.name,
        price: priceConverter(good.price),
        count: good.count,
        idName: 'description_'+number,
        idEdit: 'edit_'+number,
        idDelete: 'delete_'+number,
      })).appendTo('#table_body');


      if(good.hidden){
        $('#table_row_'+number).addClass('hidden');
        $('#table_row_'+number+' *').addClass('hidden');
      } else {
        $('#table_row_'+number).removeClass('hidden');
        $('#table_row_'+number+' *').removeClass('hidden');
      }

      let modalTemp = _.template($("#modal_edit_template").html());

      $(modalTemp({
        modalId: 'modal_edit_'+number,
        name: good.name,
        price: priceConverter(good.price),
        count: good.count,
        email: good.email,
        saveId: 'modal_save_'+number,
        cancelId: 'modal_cancel_'+number,
      })).appendTo('#table_body');


      let descriptionTemp = _.template($('#modal_description_template').html());

      $(descriptionTemp({
        descriptionId: 'modal_description_'+number,
        name: good.name,
        description: good.description,
        closeId: 'modal_description_close_'+number,
        
      })).appendTo('#table_body');
      // const cityCleaner = () => {
    
      //   $('#modal_edit_'+number+' .label_city span').each(
      //     (index, element) => {
        
      //       if($(element).html()===''){
      //         $(element).parent().empty();
      //       }
      //     } 
      //   );

      // }

      // cityCleaner();

      $('#edit_'+number).click(() => {
        $(".modal_fade").addClass("modal_fade_trick");
        $("#modal_edit_"+number).css("display", "block");
      });

      $('#description_'+number).click(() => {
        $(".modal_fade").addClass("modal_fade_trick");
        $("#modal_description_"+number).css("display", "block");
      });

      $('#modal_edit_'+number+' form').submit((event) => {
        event.preventDefault();

        const form = '#modal_edit_'+number+' form ';
        let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
        let validation = [isNameValid(forms[0].val()), isEmailValid(forms[1].val()), isCountValid(forms[2].val()), isPriceValid(cleanPriceString(forms[3].val()))];

        if(validation.every((element)=>{return element;})){
          good.name = $(form+'.name').val();
          good.email = $(form+'.supplier_email').val();
          good.count = $(form+'.count').val();
          good.price = priceConverter($(form+'.price').val());
          
          // FIXME: These three can be presented by one function
          good.delivery.russia.moscow = $(form+'.russia_cities .city_1').prop('checked') ? true : false; 
          good.delivery.russia.saratov = $(form+'.russia_cities .city_2').prop('checked') ? true : false; 
          good.delivery.russia.spb = $(form+'.russia_cities .city_3').prop('checked') ? true : false;

          good.delivery.belorus.minsk = $(form+'.belorus_cities .city_1').prop('checked') ? true : false;
          good.delivery.belorus.hotlany = $(form+'.belorus_cities .city_2').prop('checked') ? true : false;
          good.delivery.belorus.bobruysk = $(form+'.belorus_cities .city_3').prop('checked') ? true : false;

          good.delivery.usa.ny = $(form+'.usa_cities .city_1').prop('checked') ? true : false; 
          good.delivery.usa.washington = $(form+'.usa_cities .city_2').prop('checked') ? true : false; 
          good.delivery.usa.boston = $(form+'.usa_cities .city_3').prop('checked') ? true : false; 

          $(".modal_fade").removeClass("modal_fade_trick");
          $("#modal_edit_"+number).css("display", "none");
        
          clearInvalid(form);
          clearEdit(form, good);

          LIST.render();
        } else {
            clearInvalid(form);
            validation.forEach((element, index)=>{
            if(!element){
              forms[index].addClass('invalid');
              showNotes(forms[index]);
            }
          });
      
          forms[validation.indexOf(false)].focus();
          
        }
      });

      $('#modal_cancel_'+number).click(() => {
        $('.modal_fade').removeClass('modal_fade_trick');
        $('#modal_edit_'+number).css('display', 'none');
        clearEdit('#modal_edit_'+number+' form ', good);
        clearInvalid('#modal_edit_'+number+' form ');
      });

      $("#modal_description_close_"+number).click(() => {
        $(".modal_fade").removeClass("modal_fade_trick");
        $("#modal_description_"+number).css("display", "none");
      });

      const thisCities = $('#modal_edit_'+number+' .cities');

      appendDelivery('#modal_edit_'+number, good);

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

    $('.count').on('input', (function(){
      const nonDigitRegExp = /\D/;
     

      $(this).val($(this).val().replace(nonDigitRegExp,''));
      

    }));

    $('.price').on('input', (function(){
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
    
    $('.price').focus(function(){
      let regExpDollar = /\$/;

      $(this).val($(this).val().replace(/\,/g, ''));
      $(this).val($(this).val().replace(regExpDollar, ''));
    });

    $('.price').blur(function(){
      let regExpDollar = /\$/;

      $(this).val(putSemi($(this).val()));

      if(!$(this).val().match(regExpDollar)){
        $(this).val('$'.concat($(this).val()));
      }

      const strayDotRegExp = /\.(?!\d)/g;

      $(this).val($(this).val().replace(strayDotRegExp,''));
      
      if($(this).val().charAt(0) === '.'){
        $(this).val($(this).val().slice(1));
      }
    });
    

  },
};

// NOTE: Need to think about generating those
LIST.push(new Good('Lorem ipsum', 'someemail@gmail.com', 3, 100, [true, true, true],[true, true, true],[true, true, true]));
LIST.push(new Good('Dolor sit amet', 'someeail@gmail.com', 4, 1000, [true, true, true],[false, false, true],[true, true, true]));
LIST.push(new Good('Ipsum amet', 'smeemail@gmail.com',11, 10, [true, true, true],[false, true, true],[true, true, true]));
LIST.push(new Good('Lorem sit', 'somemail@gmail.com', 1, 1, [true, true, true],[true, true, true],[true, true, true]));

let buttonDelete = $(".button_delete");
let buttonClose = $(".modal_close");
let modalTemp = _.template($("#modal_edit_template").html());

$(modalTemp({
  modalId: 'modal_add',
  email: '',
  name: '',
  count: '',
  price: '$',
  saveId: 'save_add',
  cancelId: 'cancel_add',
})).appendTo('.main');

$("#triangle_name").click(() => {
  $("#triangle_name").toggleClass('flip');
  LIST.ascedningName = !LIST.ascedningName;
});

$("#triangle_price").click(() => {
  $("#triangle_price").toggleClass('flip');
  LIST.ascedningPrice = !LIST.ascedningPrice;
});

appendDelivery('#modal_add', null);

$("#good_add").click(() => {
  $(".modal_fade").addClass("modal_fade_trick");
  $("#modal_add").css("display", "block");

  const form = '#modal_add form ';
  $(form+'.name').focus();

});

$("#cancel_add").click(() => {
  $(".modal_fade").removeClass("modal_fade_trick");
  $("#modal_add").css("display", "none");
  clearAdd('#modal_add form ');
  clearInvalid('#modal_add form ');
});

// const isNameValid = (name) => {
//   let workString = name;
//   let regExpOnlySpaces = /\S/;
  
//   if(!workString.match(regExpOnlySpaces)){
//     return false;
//   }
//   if(workString.length > 15 || workString.length < 5){
//     return false;
//   }

//   return true;

// };

// const isEmailValid = (email) => {
//   let regExpEmail = /\w+@\w+.[com|ru|org]/g;

//   if(email.match(regExpEmail)){
//     return true;
//   } else {
//     return false;
//   };

// };

// const isCountValid = (count) => {

//   if(count.length > 0){
//     return true;
//   } else {
//     return false;
//   }

// };

// const isPriceValid = (price) => {

//   if(price.length > 0){
//     return true;
//   } else {
//     return false;
//   }

// };

// const clearAdd = (form) => {
//   $(form+'.name').val('');
//   $(form+'.supplier_email').val('');
//   $(form+'.count').val('');
//   $(form+'.price').val('');
//   $(form+'.select_all').prop('checked', false);
//   $(form+'.russia_cities .city_1').prop('checked', false);
//   $(form+'.russia_cities .city_2').prop('checked', false);
//   $(form+'.russia_cities .city_3').prop('checked', false);
//   $(form+'.belorus_cities .city_1').prop('checked', false);
//   $(form+'.belorus_cities .city_2').prop('checked', false);
//   $(form+'.belorus_cities .city_3').prop('checked', false);
//   $(form+'.usa_cities .city_1').prop('checked', false);
//   $(form+'.usa_cities .city_2').prop('checked', false);
//   $(form+'.usa_cities .city_3').prop('checked', false);
// };


$('#modal_add form').submit((event) => {
  event.preventDefault();

  const form = '#modal_add form ';
  let forms = [$(form+'.name'), $(form+'.supplier_email'), $(form+'.count'), $(form+'.price')];
  
  let validation = [isNameValid(forms[0].val()), isEmailValid(forms[1].val()), isCountValid(forms[2].val()), isPriceValid(cleanPriceString(forms[3].val()))];

  
  if(validation.every((element)=>{return element;})){
    let cities = $(form+'.city').toArray();
    let delivery = [];

    cities.forEach((city)=>{
      delivery.push($(city).prop('checked') ? true : false);
    });

    

  // FIXME: Do something about this hell
  // DONE
    LIST.add(new Good(
      $(form+'.name').val(),
      $(form+'.supplier_email').val(),
      $(form+'.count').val(),
      priceConverter($(form+'.price').val()), 
      delivery.slice(0, 3), 
      delivery.slice(3, 5), 
      delivery.slice(5, 9), 
    ));


    clearAdd(form);

    $(".modal_fade").removeClass("modal_fade_trick");  
    $('#modal_add').css('display', 'none');

    clearInvalid(form);

    LIST.render();

  } else {
    clearInvalid(form);
    validation.forEach((element, index)=>{
      if(!element){
        forms[index].addClass('invalid');
        showNotes(forms[index]);
      }
    });

    forms[validation.indexOf(false)].focus();
  }
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

LIST.render();

