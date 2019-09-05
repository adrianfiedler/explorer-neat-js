/* eslint-disable object-curly-spacing */
/* eslint-disable require-jsdoc */
class Player {
  constructor(brain, level, startDist, notMovedLimit, timeMaxLimit) {
    this.posX = 0;
    this.posY = 0;
    this.level = level;
    this.brain = brain;
    this.brain.score = 0;
    this.notMovedCycles = 0;
    this.distance = 0;
    this.minDist = startDist;
    this.ended = false;
    this.boxesX = level.length;
    this.boxesY = level[0].length;
    this.notMovedCycles = 0;
    this.startTime = new Date();
    this.notMovedLimit = notMovedLimit;
    this.timeMaxLimit = timeMaxLimit;
  }

  move() {
    const timeElapsed = new Date().getTime() - this.startTime.getTime();
    const lastX = this.posX;
    const lastY = this.posY;
    const canMoveLeft = this.posX > 0 && this.level[this.posX - 1][this.posY] !== 'O';
    const canMoveRight = this.posX < this.boxesX - 1 && this.level[this.posX + 1][this.posY] !== 'O';
    const canMoveUp = this.posY > 0 && this.level[this.posX][this.posY - 1] !== 'O';
    const canMoveDown = this.posY < this.boxesY - 1 && this.level[this.posX][this.posY + 1] !== 'O';
    const input = [canMoveLeft, canMoveRight, canMoveUp, canMoveDown, this.distance];

    const output = this.brain.activate(input);

    if (output[0] > output[1] &&
      output[0] > output[2] &&
      output[0] > output[3]) {
      this.moveUp();
    } else if (output[1] > output[0] &&
      output[1] > output[2] &&
      output[1] > output[3]) {
      this.moveRight();
    } else if (output[2] > output[0] &&
      output[2] > output[1] &&
      output[2] > output[3]) {
      this.moveDown();
    } else {
      this.moveLeft();
    }
    if (lastX === this.posX && lastY === this.posY) {
      // not moved
      this.notMovedCycles++;
    } else {
      this.notMovedCycles = 0;
    }

    if (this.notMovedCycles >= this.notMovedLimit ||
      timeElapsed >= this.timeMaxLimit) {
      this.ended = true;
    }
  }

  moveLeft() {
    if (this.posX > 0) {
      const levelBlock = this.level[this.posX - 1][this.posY];
      if (levelBlock !== 'O') {
        this.posX--;
      }
    }
  }

  moveRight() {
    if (this.posX + 1 < this.boxesX) {
      const levelBlock = this.level[this.posX + 1][this.posY];
      if (levelBlock !== 'O') {
        this.posX++;
      }
    }
  }

  moveDown() {
    if (this.posY + 1 < this.boxesY) {
      const levelBlock = this.level[this.posX][this.posY + 1];
      if (levelBlock !== 'O') {
        this.posY++;
      }
    }
  }

  moveUp() {
    if (this.posY > 0) {
      const levelBlock = this.level[this.posX][this.posY - 1];
      if (levelBlock !== 'O') {
        this.posY--;
      }
    }
  }
}

export { Player };
