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