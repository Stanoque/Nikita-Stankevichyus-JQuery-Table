const serverResponseTime = require('./const_serverResponseTime.js');
const appendDelivery = require('./form_appendDelivery.js');

const isNameValid = require('./form_validation.js').isNameValid;
const isEmailValid = require('./form_validation.js').isEmailValid;
const isCountValid = require('./form_validation.js').isCountValid;
const isPriceValid = require('./form_validation.js').isPriceValid;

const priceConverter = require('./price_vidget/vidget_price.js').priceConverter;
const putSemi = require('./price_vidget/vidget_price.js').putSemi;
const cleanPriceString = require('./price_vidget/vidget_price.js').cleanPriceString;

const showNotes = require('./form_notes.js').showNotes;
const hidNotes = require('./form_notes.js').hidNotes;

const clearEdit = require('./form_cleaners.js').clearEdit;
const clearInvalid = require('./form_cleaners.js').clearInvalid;

module.exports = function GoodsList() {
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

  this.clearEdit = (form, good) => {
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
  
  }

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

    let rowTemp = _.template($("#row_template").html());

    this.forEach((good, number) => {


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

          const editPromise = new Promise((resolve, reject) => {

            setTimeout(()=>{
              good.name = $(form+'.name').val();
              good.email = $(form+'.supplier_email').val();
              good.count = $(form+'.count').val();
              good.price = priceConverter($(form+'.price').val());
          
              const editCities = () => {
                const countries = [];
                
                for(let country in good.delivery) {
                  countries.push(country);
                }
      
                countries.forEach( (country)=>{

                    for(let city in good.delivery[country]){
                      good.delivery[country][city] = $(form+'.'+city).prop('checked') ? true : false;
                    }
                }
                )
              }

              editCities();
              
              resolve('Edit successful');
            }, serverResponseTime);
          
          });

          $('.loading').css('display', 'block');
          editPromise.then((resolved) => {
            $(".modal_fade").removeClass("modal_fade_trick");
            $('.loading').css('display', 'none');
            clearInvalid(form);
            clearEdit(form, good);
            this.render();
          })
          // $(".modal_fade").removeClass("modal_fade_trick");
          $("#modal_edit_"+number).css("display", "none");
        
          // clearInvalid(form);
          // clearEdit(form, good);

          // LIST.render();
        } else {
            clearInvalid(form);
            validation.forEach((element, index)=>{
            if(!element){
              forms[index].addClass('invalid');
              showNotes(forms[index]);
            } else {
              hidNotes(forms[index]);
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
        name: good.name,
        idYes: 'yes_'+number,
        idNo: 'no_'+number,
      })).appendTo('#table_body');

      $('#delete_'+number).click(() => {
        $('.modal_fade').addClass('modal_fade_trick');
        $('#modal_delete_'+number).css('display', 'block');
      });
  
      $('#yes_'+number).click(() => {
        const deletePromise = this.delete(good);
        deletePromise.then((resolved)=>{
          this.render();
          $('.modal_fade').removeClass('modal_fade_trick');
          $('.loading').css('display', 'none');
        });
        $('.loading').css('display', 'block');
        // $('.modal_fade').removeClass('modal_fade_trick');
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
    

  };
};

