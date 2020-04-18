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


let shek = new Good('A Good', 'somemail@gmail.com', 1, Infinity, [true, true, true],[true, true, true],[true, true, true]);
shek = JSON.stringify(shek);
let fs = require('fs');
fs.writeFileSync("database.json", shek);