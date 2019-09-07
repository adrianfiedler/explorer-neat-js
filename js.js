/* eslint-disable object-curly-spacing */
import { Player } from './js/player.js';

/* eslint-disable require-jsdoc */
/* eslint-disable semi */
const Neat = neataptic.Neat;
const boxesX = 20;
const boxesY = boxesX;
const canvas = document.getElementById('myCanvas');
const boxSize = canvas.width / boxesX;
console.log(`boxSize: ${boxSize}`);
const ctx = canvas.getContext('2d');

const obstacleProb = 10;
const diamondProb = 1;
const INIT_SCORE = 0;
const DIAMOND_VALUE = 500;
let level = [];
let distance = 0;
const POPULATION = 60;
const MUTATION_RATE = 0.5
const MUTATION_AMOUNT = 3
const neat = new Neat(5, 4, null, {
  popsize: POPULATION,
  elitism: Math.round(0.2 * POPULATION),
  mutationRate: MUTATION_RATE,
  mutationAmount: MUTATION_AMOUNT
}
);
let players = [];
let roundsPlayed = 0;
const START_DIST = 1000;
const NOT_MOVED_LIMIT = 10;
let TIME_MAX_LIMIT = 1000;

const playerImg = new Image();
playerImg.onload = function () {
  ctx.drawImage(playerImg, 0, 0, boxSize, boxSize);
}
playerImg.src = 'assets/player.png';

const bgImg = new Image();
bgImg.src = 'assets/bg.png';

const treasureImg = new Image();
treasureImg.src = 'assets/treasure.png';

const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.png';

const exitImg = new Image();
exitImg.src = 'assets/exit.png';

let leeMatrix = [];

document.getElementById("time-limit").value = TIME_MAX_LIMIT;
document.getElementById('time-limit-slider').addEventListener('input', (slider) => {
  TIME_MAX_LIMIT = slider.target.value;
  document.getElementById("time-limit").value = TIME_MAX_LIMIT;
});

function initLevel() {
  level = [];
  for (let x = 0; x < boxesX; x++) {
    level.push([]);
    for (let y = 0; y < boxesY; y++) {
      let box = '';
      // check game breaking obstacles for start and end areas
      if ((x < 3 && y < 3)) {
        box = '';
      } else if ((x > boxesX - 4 && y > boxesY - 4)) {
        if (x === boxesX - 1 && y === boxesY - 1) {
          box = 'E';
        } else {
          box = '';
        }
      } else {
        if (Math.random() * 100 <= obstacleProb) {
          box = 'O'
        } else if (Math.random() * 100 <= diamondProb) {
          box = 'D';
        }
      }
      level[x][y] = box;
    }
  }
  // console.table(level);

  players = [];
  for (let i = 0; i < POPULATION; i++) {
    players.push(new Player(neat.population[i], level, START_DIST,
      NOT_MOVED_LIMIT, TIME_MAX_LIMIT));
  }
  leeMatrix = convertToLeeMatrix(level);
}

function calculateLee() {
  for (const player of players) {
    const distMatrix = lee.pathfinder(cloneArray(leeMatrix), player.posX, player.posY, boxesX - 1, boxesY - 1);
    distance = distMatrix[1];
    player.distance = distance;

    if (player.minDist === START_DIST) {
      player.minDist = distance;
    }
    if (distance < player.minDist) {
      player.brain.score += 10;
      player.minDist = distance;
    }
    document.getElementById('dist').value = distance;
    document.getElementById('score').value = player.brain.score;
  }
}

function drawBoard() {
  ctx.beginPath();
  for (let x = 0; x < boxesX; x++) {
    for (let y = 0; y < boxesY; y++) {
      const levelBlock = level[x][y];
      ctx.lineWidth = 1;
      ctx.strokeRect(x * boxSize, y * boxSize, boxSize, boxSize);
      switch (levelBlock) {
        case '': ctx.drawImage(bgImg, x * boxSize, y * boxSize); break;
        case 'O': ctx.drawImage(obstacleImg, x * boxSize, y * boxSize); break;
        case 'D': ctx.drawImage(treasureImg, x * boxSize, y * boxSize); break;
        case 'E': ctx.drawImage(exitImg, x * boxSize, y * boxSize); break;
      }
    }
  }
  ctx.closePath();
}

function drawPlayer() {
  for (const player of players) {
    ctx.drawImage(playerImg, player.posX * boxSize, player.posY * boxSize, boxSize, boxSize);
  }
}

function draw() {
  clearBoard();
  drawBoard();
  calculateLee();
  movePlayers();
  drawPlayer();
  checkGeneration();
}

function movePlayers() {
  for (const player of players) {
    if (!player.ended) {
      player.move();
    }
  }
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// eslint-disable-next-line no-unused-vars
function resetGame() {
  console.log('Reset game');
  roundsPlayed++;
  evolveGeneration();
  initLevel();
}

function evolveGeneration() {
  console.log('Evolving...');
  neat.sort();

  console.log(`Best fitness: ${neat.getFittest().score}`);
  console.log(`Average fitness: ${neat.getAverage()}`);
  console.log(`Worst fitness: ${neat.population[neat.popsize - 1].score}`);
  console.log(`### Next generation: ${neat.generation} ###`);

  drawChart();

  const newGeneration = [];
  for (let i = 0; i < neat.elitism; i++) {
    newGeneration.push(neat.population[i]);
  }
  for (let i = 0; i < neat.popsize - neat.elitism; i++) {
    newGeneration.push(neat.getOffspring())
  }

  neat.population = newGeneration;
  neat.mutate();
  neat.generation++;
}

function drawChart() {
  chartData.labels.push(neat.generation.toString())
  chartData.datasets[0].values.push(neat.getFittest().score)
  chartData.datasets[1].values.push(neat.getAverage())
  chartData.datasets[2].values.push(neat.population[neat.popsize - 1].score)

  if (chartData.labels.length > 35) {
    chartData.labels.shift()
    chartData.datasets.forEach((d) => d.values.shift())
  }

  chart.update(chartData)
}

function checkGeneration() {
  let ended = 0;
  for (const player of players) {
    if (player.ended) {
      ended++;
    }
  }
  if (ended === neat.population.length) {
    resetGame();
  }
}

initLevel();

setInterval(draw, 10);


