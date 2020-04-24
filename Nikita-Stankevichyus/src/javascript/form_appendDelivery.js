module.exports = function(whereTo, good) {

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
          class_1: cityNames[0].toLowerCase(),
          class_2: cityNames[1].toLowerCase(),
          class_3: cityNames[2].toLowerCase(),
          attr_1: delivery[0] ? 'checked' : null,
          attr_2: delivery[1] ? 'checked' : null,
          attr_3: delivery[2] ? 'checked' : null,
          attr_4: allChecked ? 'checked' : null,
        })).appendTo($(whereTo + ' .cities'));
      };

      renderCities('russia', ['Moscow', 'Saratov', 'SPb'], good ? good.allCities('russia') : false);
      renderCities('belorus', ['Minsk', 'Hotlany', 'Bobruysk'], good ? good.allCities('belorus') : false);
      renderCities('usa', ['NY', 'Washington', 'Boston'], good ? good.allCities('usa') : false);

      let countries = $(whereTo + ' .countries').children();

      countries = countries.toArray();

      const cities = countries.map((country)=>{

        let citiesClass = ' .'+$(country).attr('class')+'_cities';
        return $(whereTo + citiesClass);

      });

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

      

      const selectAll = (countrySelectAll) => {
        $(countrySelectAll).click(() => {
          $(countrySelectAll).parent().siblings().children('.city').prop('checked', $(countrySelectAll).prop('checked'));
        });
      }

      cities.forEach((country)=>{
       selectAll($(country).find('.select_all')); 
      })
}