/* eslint-disable require-jsdoc */
function convertToLeeMatrix(gameMatrix) {
  const leeMatrix = [];
  for (let x = 0; x < gameMatrix.length; x++) {
    leeMatrix.push([]);
    for (let y = 0; y < gameMatrix[0].length; y++) {
      leeMatrix[x].push(gameMatrix[x][y] === 'O' ? -1 : 0);
    }
  }
  return leeMatrix;
}

function cloneArray(matrix) {
  const result = [];
  for (let x = 0; x < matrix.length; x++) {
    result.push([]);
    for (let y = 0; y < matrix[x].length; y++) {
      result[x].push(matrix[x][y]);
    }
  }
  return result;
}