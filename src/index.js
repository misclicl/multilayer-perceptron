import './style.css';

import NeuralNetwork from './neuralNetwork/NeuralNetwork.js';
import Canvas from './Canvas.js';
import { drawRectangle } from './utils.js';

const RESOLUTION = 5;
const WIDTH = 300;
const HEIGHT = 300;

const state = {
  isPlaying: false,
  min: 0,
  max: 0,
};

const rectangle = drawRectangle(RESOLUTION);
const canvas = new Canvas(WIDTH, HEIGHT, 'body');
const context = canvas.canvasObject.getContext('2d');

const nn = new NeuralNetwork({
  inputSize: 2,
  hiddenLayers: [3],
  outputSize: 1,
  learningRate: .01,
  activation: 'tanh',
});

const abs = Math.abs;

const counterContainer = document.createElement('div');
counterContainer.textContent = 'Epoch:';

const counter = document.createElement('span');
counterContainer.appendChild(counter);
counter.innerHTML = '000000';

const btn = document.createElement('button');
btn.textContent = 'Toggle Training';
btn.addEventListener('click', () => {
  state.isPlaying = !state.isPlaying;
});

document.body.appendChild(counterContainer);
document.body.appendChild(btn);

const draw = () => {
  const { max, min } = state;
  for (let i = 0; i < WIDTH; i += RESOLUTION) {
    for (let j = 0; j < HEIGHT; j += RESOLUTION) {
      const x = i / WIDTH;
      const y = j / HEIGHT;

      const result = nn.run([x, y]);
       if (result < min) {
        state.min = result;
      }

      if (result > max) {
        state.max = result;
      }

      let color = '';
      const mappedResult = result * 255;
      color = `rgb(${mappedResult}, ${mappedResult}, ${mappedResult})`;

      // if (mappedResult < 100) {
      //   color = `#804cb9`;
      // } else if (mappedResult < 117) {
      //   color = `#c364af`; // false
      // } else if (mappedResult < 134) {
      //   color = '#f19282';
      // } else if (mappedResult < 155) {
      //   color = '#ffd368';
      // } else {
      //   color = '#ffeb5a';
      // }
      rectangle(context, i, j, color);
    }
  }
};

draw();

const fn = (a, b) => {
  if ((a <= .5 && b <= .5) || (a > .5 && b > .5)) {
    return 1;
  } else {
    return 0;
  }
};

const xor = (a, b) => {
  return a ^ b;
};

const update = () => {
  if (state.isPlaying) {
    counter.innerHTML = nn.epoch.toString().padStart(6, 0);
    for (let index = 0; index < 1000; index++) {
      const a = Math.random();
      const b = Math.random();

      nn.train([a, b], [fn(a, b)]);
    }
    draw();
  }
  window.requestAnimationFrame(update);
};

window.nn = nn;

window.requestAnimationFrame(update);
