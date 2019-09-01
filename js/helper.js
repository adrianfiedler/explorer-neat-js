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