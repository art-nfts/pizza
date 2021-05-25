import * as _ from 'lodash';

import pizzaURL from './images/pizza.png';
import earthURL from './images/earth.png';

const API_KEY = 'DDy7uCcyEjyzzqisk9A5';
const API_URL = 'https://www.quandl.com/api/v3/datasets/BCHAIN/MKPRU.json?api_key='+API_KEY;

let context: CanvasRenderingContext2D;
let data: [string, number][];

const pizza = new Image();
pizza.src = pizzaURL;
const earth = new Image();
earth.src = earthURL;

window.onload = async () => {
  data = (await (await fetch(API_URL)).json()).dataset.data;
  console.log(data)
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext('2d');
  context.font = '10px Arial';
  canvas.innerHTML = "";
  animateFrom(new Date('2016-01-01'));
}

async function animateFrom(startDate: Date) {
  const today = new Date();
  const currentDate = startDate;
  while (currentDate <= today) {
    update(currentDate);
    currentDate.setDate(currentDate.getDate()+1);
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}

async function update(date: Date) {
  const dateString = date.toISOString().split('T')[0];
  const price = data.filter(d => d[0] == dateString)[0][1];
  const earthPos = (window.innerWidth-window.innerHeight)/2;
  const earthSize = window.innerHeight;
  const priceRatio = 10000*price/41;
  const sizeRatio = priceRatio*0.5/12742000;//50cm pizza
  const pizzaSize = earthSize*sizeRatio;//earthSize/20;
  const pizzaX = earthPos+(earthSize*0.68)-(pizzaSize/2);
  const pizzaY = (earthSize*0.64)-(pizzaSize/2);
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.drawImage(earth, earthPos, 0, earthSize, earthSize);
  context.drawImage(pizza, pizzaX, pizzaY, pizzaSize, pizzaSize);
  context.font = '48px serif';
  context.fillStyle = 'white';
  context.fillText(dateString+', $'+Math.round(price), 20, window.innerHeight-20);
}