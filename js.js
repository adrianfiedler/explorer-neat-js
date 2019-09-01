/* eslint-disable semi */
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
const INIT_SCORE = 20000;
const DIAMOND_VALUE = 5000;
let score = INIT_SCORE;
const level = [];
let ended = false;

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

function initLevel () {
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
  console.table(level);
}
initLevel();

function drawBoard () {
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

function drawPlayer () {
  ctx.drawImage(playerImg, posX * boxSize, posY * boxSize, boxSize, boxSize);
}

function draw () {
  calculateScore();
  clearBoard();
  drawBoard();
  drawPlayer();
  updateUI();
}

function calculateScore () {
  if (!ended) {
    timeMalus = new Date().getTime() - startTime.getTime();
    score = INIT_SCORE - timeMalus + diamondBonus;
    if (score < 0) {
      score = 0;
    }
  }
}

function clearBoard () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function keyDownHandler (e) {
  if (!ended) {
    let levelBlock = level[posX][posY];
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      if (posX + 1 < boxesX) {
        levelBlock = level[posX + 1][posY];
        if (levelBlock !== 'O') {
          posX++;
        }
      }
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      if (posX > 0) {
        levelBlock = level[posX - 1][posY];
        if (levelBlock !== 'O') {
          posX--;
        }
      }
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      if (posY > 0) {
        levelBlock = level[posX][posY - 1];
        if (levelBlock !== 'O') {
          posY--;
        }
      }
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      if (posY + 1 < boxesY) {
        levelBlock = level[posX][posY + 1];
        if (levelBlock !== 'O') {
          posY++;
        }
      }
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
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
  }
}

function updateUI () {
  document.getElementById('score').value = score;
}
setInterval(draw, 20);

// eslint-disable-next-line no-unused-vars
function resetGame () {
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
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
