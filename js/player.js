/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */
class Player {
  constructor(brain, level) {
    this.posX = 0;
    this.posY = 0;
    this.level = level;
    this.brain = brain;
  }

  move() {
    const lastX = posX;
    const lastY = posY;
    const canMoveLeft = posX > 0 && level[posX - 1][posY] !== 'O';
    const canMoveRight = posX < boxesX - 1 && level[posX + 1][posY] !== 'O';
    const canMoveUp = posY > 0 && level[posX][posY - 1] !== 'O';
    const canMoveDown = posY < boxesY - 1 && level[posX][posY + 1] !== 'O';
    const input = [canMoveLeft, canMoveRight, canMoveUp, canMoveDown, distance];

    const output = brain.activate(input);

    if (output[0] > output[1] &&
      output[0] > output[2] &&
      output[0] > output[3]) {
      moveUp();
    } else if (output[1] > output[0] &&
      output[1] > output[2] &&
      output[1] > output[3]) {
      moveRight();
    } else if (output[2] > output[0] &&
      output[2] > output[1] &&
      output[2] > output[3]) {
      moveDown();
    } else {
      moveLeft();
    }
    if (lastX === posX && lastY === posY) {
      // not moved
      notMovedCycles++;
    } else {
      notMovedCycles = 0;
    }
    calculateLee();
  }

  moveLeft() {
    if (posX > 0) {
      levelBlock = level[posX - 1][posY];
      if (levelBlock !== 'O') {
        posX--;
      }
    }
  }

  moveRight() {
    if (posX + 1 < boxesX) {
      levelBlock = level[posX + 1][posY];
      if (levelBlock !== 'O') {
        posX++;
      }
    }
  }

  moveDown() {
    if (posY + 1 < boxesY) {
      levelBlock = level[posX][posY + 1];
      if (levelBlock !== 'O') {
        posY++;
      }
    }
  }

  moveUp() {
    if (posY > 0) {
      levelBlock = level[posX][posY - 1];
      if (levelBlock !== 'O') {
        posY--;
      }
    }
  }
}

export { Player };