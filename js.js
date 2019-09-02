/* eslint-disable semi */
const Neat = neataptic.Neat;
const boxesX = 20;
const boxesY = boxesX;
var canvas = document.getElementById('myCanvas');
const boxSize = canvas.width / boxesX;
console.log(`boxSize: ${boxSize}`);
var ctx = canvas.getContext('2d');
var posX = 0;
var posY = 0;
let startTime = new Date();
let timeMalus = 0;
let diamondBonus = 0;
const obstacleProb = 10;
const diamondProb = 1;
const INIT_SCORE = 500;
const DIAMOND_VALUE = 5000;
let score = INIT_SCORE;
const level = [];
let ended = false;
let distance = 0;
const POPULATION = 60;
const MUTATION_RATE = 0.5
const MUTATION_AMOUNT = 3
const neat = new Neat(1, 4, null, {
  popsize: POPULATION,
  elitism: Math.round(0.2 * POPULATION),
  mutationRate: MUTATION_RATE,
  mutationAmount: MUTATION_AMOUNT
}
);
let roundsPlayed = 0;

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
  calculateLee();
}

function calculateLee() {
  const tmpMatrix = convertToLeeMatrix(level);
  // console.table(tmpMatrix);
  leeMatrix = lee.pathfinder(tmpMatrix, posX, posY, boxesX - 1, boxesY - 1);
  distance = leeMatrix[1];
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

function movePlayer() {
  const input = [distance / 21];
  let brain = neat.population[roundsPlayed];
  const output = brain.activate(input).map(o => Math.round(o));

  if (output[0]) {
    moveUp();
  } else if (output[1]) {
    moveRight();
  } else if (output[2]) {
    moveDown();
  } else {
    moveLeft();
  }
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

function calculateScore() {
  if (!ended) {
    timeMalus = new Date().getTime() - startTime.getTime();
    score = INIT_SCORE - timeMalus + diamondBonus;
    if (score < 0) {
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

function moveLeft() {
  if (posX > 0) {
    levelBlock = level[posX - 1][posY];
    if (levelBlock !== 'O') {
      posX--;
    }
  }
}

function moveRight() {
  if (posX + 1 < boxesX) {
    levelBlock = level[posX + 1][posY];
    if (levelBlock !== 'O') {
      posX++;
    }
  }
}

function moveDown() {
  if (posY + 1 < boxesY) {
    levelBlock = level[posX][posY + 1];
    if (levelBlock !== 'O') {
      posY++;
    }
  }
}

function moveUp() {
  if (posY > 0) {
    levelBlock = level[posX][posY - 1];
    if (levelBlock !== 'O') {
      posY--;
    }
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
setInterval(draw, 20);

// eslint-disable-next-line no-unused-vars
function resetGame() {
  roundsPlayed++;
  if (roundsPlayed > neat.population.length) {
    roundsPlayed = 0;
  }
  evolveGeneration();

  console.log('Reset game');
  posX = 0;
  posY = 0;
  score = INIT_SCORE;
  startTime = new Date();
  timeMalus = 0;
  diamondBonus = 0;
  ended = false;
  initLevel();
}

function evolveGeneration() {
  if (roundsPlayed % 50 == 0) {
    console.log("Evolving...");
    neat.sort();
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
    console.log(`Best fitness: ${neat.getFittest().score}`);
    console.log(`Average fitness: ${neat.getAverage()}`);
    console.log(`Worst fitness: ${neat.population[neat.popsize - 1].score}`);
    console.log(`### Next generation: ${neat.generation} ###`);
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
