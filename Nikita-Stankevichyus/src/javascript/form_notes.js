module.exports.hidNotes = (form) => {
  $(form).parent().siblings('.note').addClass('hidden');
}

module.exports.showNotes = (form) => {
  if($(form).hasClass('name')){
    $(form).parent().siblings('.note').addClass('hidden');
    if($(form).val().length < 5){
      $(form).parent().siblings('.invalid_name_short').removeClass('hidden');
    } else {
      $(form).parent().siblings('.invalid_name_long').removeClass('hidden');
    }
  } else {
    $(form).parent().siblings('.note').removeClass('hidden');
  }
}