/* eslint-disable object-curly-spacing */
import { Player } from './js/player';

/* eslint-disable require-jsdoc */
/* eslint-disable semi */
const Neat = neataptic.Neat;
const boxesX = 20;
const boxesY = boxesX;
const canvas = document.getElementById('myCanvas');
const boxSize = canvas.width / boxesX;
console.log(`boxSize: ${boxSize}`);
const ctx = canvas.getContext('2d');

let startTime = new Date();
let timeMalus = 0;
const obstacleProb = 10;
const diamondProb = 1;
const INIT_SCORE = 0;
const DIAMOND_VALUE = 500;
let score = INIT_SCORE;
const level = [];
let ended = false;
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
const players = [];
let roundsPlayed = 0;
const START_DIST = 1000;
const NOT_MOVED_LIMIT = 10;
const TIME_ABORT = 5000;
let minDist = START_DIST;
let notMovedCycles = 0;

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

function initLevel() {
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

  for (let i = 0; i < POPULATION; i++) {
    players.push(new Player(neat.population[i], level));
  }
  calculateLee();
}

function calculateLee() {
  const tmpMatrix = convertToLeeMatrix(level);
  // console.table(tmpMatrix);
  leeMatrix = lee.pathfinder(tmpMatrix, posX, posY, boxesX - 1, boxesY - 1);
  distance = leeMatrix[1];
  // distance = Math.sqrt(Math.pow((boxesX - 1) - posX, 2) + Math.pow((boxesY - 1) - posY, 2));
  if (minDist === START_DIST) {
    minDist = distance;
  }
  if (distance < minDist) {
    score += 10;
    minDist = distance;
  }
  // console.log("FINAL MATRIX : \n", leeMatrix);
  // const bestPath = await lee.backtrace(leeMatrix, 0, 0, boxesX - 1, boxesY - 1);
  // console.log("BEST PATH : \n", bestPath);
  document.getElementById('dist').value = distance;
}
initLevel();

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
  ctx.drawImage(playerImg, posX * boxSize, posY * boxSize, boxSize, boxSize);
}

function draw() {
  calculateScore();
  clearBoard();
  drawBoard();
  movePlayer();
  drawPlayer();
  updateUI();
}

function movePlayers() {
  for (const player of players) {
    player.move();
  }
}

function calculateScore() {
  if (!ended) {
    timeMalus = new Date().getTime() - startTime.getTime();
    // score = INIT_SCORE - timeMalus + diamondBonus;
    let brain = neat.population[roundsPlayed];
    brain.score = score;
    if (notMovedCycles > NOT_MOVED_LIMIT || timeMalus > TIME_ABORT) {
      resetGame();
    }
  }
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler(e) {
  if (!ended) {
    let levelBlock = level[posX][posY];
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      moveUp();
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      moveDown();
    }
    if (levelBlock === 'D') {
      console.log('Diamond found!');
      diamondBonus += DIAMOND_VALUE;
      level[posX][posY] = '';
    } else if (levelBlock === 'E') {
      console.log('Game ended');
      ended = true;
    }

    console.log(`posX: ${posX}, posY: ${posY}`);
    calculateLee();
  }
}



function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
  }
}

function updateUI() {
  document.getElementById('score').value = score;
}
setInterval(draw, 10);

// eslint-disable-next-line no-unused-vars
function resetGame() {
  console.log('Reset game');
  roundsPlayed++;

  if (roundsPlayed === neat.population.length) {
    evolveGeneration();
    roundsPlayed = 0;
  }

  posX = 0;
  posY = 0;
  score = INIT_SCORE;
  startTime = new Date();
  timeMalus = 0;
  diamondBonus = 0;
  ended = false;
  minDist = START_DIST;
  initLevel();
}

function evolveGeneration() {
  console.log("Evolving...");
  neat.sort();

  console.log(`Best fitness: ${neat.getFittest().score}`);
  console.log(`Average fitness: ${neat.getAverage()}`);
  console.log(`Worst fitness: ${neat.population[neat.popsize - 1].score}`);
  console.log(`### Next generation: ${neat.generation} ###`);

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

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
