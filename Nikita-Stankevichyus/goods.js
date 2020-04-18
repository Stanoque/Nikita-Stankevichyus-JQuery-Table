export function Good(name='', email='', count=0, price=0, russia=[], belorus=[], usa=[]) {

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
      if(!city){
        toReturn = false;
      }
    }
    return toReturn;
  };

  this.belorusAllCities = () => {
    let toReturn = true;
    for(let city in this.delivery.belorus){
      if(!city){
        toReturn = false;
      }
    }
    return toReturn;
  };

  this.usaAllCities = () => {
    let toReturn = true;
    for(let city in this.delivery.usa){
      if(!city){
        toReturn = false;
      }
    }
    return toReturn;
  };
}