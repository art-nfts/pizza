import * as _ from 'lodash';

import dinnerPizzaURL from './images/dinnerpizza2.png';
import dinnerURL from './images/dinner.jpg';
import homesURL from './images/homes.jpg';
import jvilleURL from './images/jacksonsville.jpg';
import floridaURL from './images/florida.jpg';
import pizzaURL from './images/pizza.png';
import earthURL from './images/earth.png';

const dinnerPizza = new Image();
dinnerPizza.src = dinnerPizzaURL;
const dinner = new Image();
dinner.src = dinnerURL;
const homes = new Image();
homes.src = homesURL;
const jville = new Image();
jville.src = jvilleURL;
const florida = new Image();
florida.src = floridaURL;
const spacePizza = new Image();
spacePizza.src = pizzaURL;
const earth = new Image();
earth.src = earthURL;

const API_KEY = 'DDy7uCcyEjyzzqisk9A5';
const API_URL = 'https://www.quandl.com/api/v3/datasets/BCHAIN/MKPRU.json?api_key='+API_KEY;

let context: CanvasRenderingContext2D;
let data: [string, number][];

window.onload = async () => {data = (await (await fetch(API_URL)).json()).dataset.data;
  console.log(data)
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext('2d');
  context.font = '10px Arial';
  canvas.innerHTML = "";
  animateFrom(new Date('2010-07-01'));
}

async function animateFrom(startDate: Date) {
  const today = new Date();
  const currentDate = startDate;
  while (currentDate <= today) {
    if (currentDate < new Date('2010-10-01')) {
      new Scene(dinnerPizza, [0.5, 0.8], dinner, 5).update(currentDate);
    } else if (currentDate < new Date('2011-03-01')) {
      new Scene(dinnerPizza, [0.5, 0.8], homes, 200).update(currentDate);
    } else if (currentDate < new Date('2013-01-01')) {
      new Scene(dinnerPizza, [0.5, 0.2], jville, 4000).update(currentDate);
    } else if (currentDate < new Date('2015-10-01')) {
      new Scene(dinnerPizza, [0.7, 0.2], florida, 500000).update(currentDate);
    } else {
      new Scene(dinnerPizza, [0.668, 0.597], earth, 12742000).update(currentDate);
    }
    currentDate.setDate(currentDate.getDate()+1);
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

class Scene {
  constructor(private pizzaImage: HTMLImageElement,
      private pizzaRelPos: [number, number],
      private bgImage: HTMLImageElement, private bgRefSize: number) {
  }
  
  async update(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    const price = data.filter(d => d[0] == dateString)[0][1];
    const bgPos = (window.innerWidth-window.innerHeight)/2;
    const bgSize = window.innerHeight;
    const pizzaPrice = 10000*price;
    const sizeRatio = pizzaPrice/41*1/this.bgRefSize;//2*50cm pizza
    const pizzaSize = bgSize*sizeRatio;
    const pizzaX = bgPos+(bgSize*this.pizzaRelPos[0])-(pizzaSize/2);
    const pizzaY = (bgSize*this.pizzaRelPos[1])-(pizzaSize/2/2.5);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    console.log(bgPos, bgSize, pizzaSize)
    context.drawImage(this.bgImage, bgPos, 0, bgSize, bgSize);
    context.drawImage(this.pizzaImage, pizzaX, pizzaY, pizzaSize, pizzaSize/2.5);
    context.font = '48px serif';
    context.fillStyle = 'white';
    context.fillText(dateString+', $'+Math.round(pizzaPrice), 20, window.innerHeight-20);
  }
}