import {
  calculateAnimations,
  pickRandomDistinctNumber,
  randomTwoOrFour,
} from './logicUtils';

export function transposeBoard(board: number[][]) {
  const numRows = board.length;
  const numCols = board[0].length;

  const transposed = [] as number[][];

  for (let col = 0; col < numCols; col++) {
    transposed[col] = [] as number[];
    for (let row = 0; row < numRows; row++) {
      transposed[col][row] = board[row][col];
    }
  }

  return transposed;
}

export const untransposeBoard = (transposedBoard: number[][]) => {
  const numRows = transposedBoard[0].length;
  const numCols = transposedBoard.length;

  const originalBoard = [] as number[][];

  for (let row = 0; row < numRows; row++) {
    originalBoard[row] = [] as number[];
    for (let col = 0; col < numCols; col++) {
      originalBoard[row][col] = transposedBoard[col][row];
    }
  }

  return originalBoard;
};

export const animateTiles = (
  boardMatrix: number[][],
  direction: 'left' | 'right' | 'up' | 'down'
) => {
  const tilePositions = (() => {
    if (direction === 'up' || direction === 'down') {
      const transposedBoard = transposeBoard(boardMatrix);
      return transposedBoard.reduce((total, boardRow, rowIndex) => {
        const tilesToAnimate = calculateAnimations(boardRow, direction);

        if (tilesToAnimate) {
          tilesToAnimate.forEach((result) => {
            result.unshift(rowIndex);
            total.push(result);
          });
        }
        return total;
      }, [] as number[][]);
    }

    const board = boardMatrix.slice(0);
    return board.reduce((total, boardRow, rowIndex) => {
      const tilesToAnimate = calculateAnimations(boardRow, direction);

      if (tilesToAnimate) {
        tilesToAnimate.forEach((result) => {
          result.unshift(rowIndex);
          total.push(result);
        });
      }
      return total;
    }, [] as number[][]);
  })();

  tilePositions.forEach((movingTile) => {
    const [rowIndex, destinationIndex, originIndex] = movingTile;
    const tile = (() => {
      if (['left', 'right'].includes(direction)) {
        return document.getElementById(`tile-${rowIndex}-${originIndex}`);
      }
      // up, down
      return document.getElementById(`tile-${originIndex}-${rowIndex}`);
    })();

    tile!.style.transition = 'transform 0.25s ease';

    if (direction === 'up') {
      tile!.style.transform = `translateY(-${Math.abs(
        (originIndex - destinationIndex) * 5
      )}rem)`;
    }

    if (direction === 'down') {
      tile!.style.transform = `translateY(${Math.abs(
        (originIndex - destinationIndex) * 5
      )}rem)`;
    }

    if (direction === 'right') {
      tile!.style.transform = `translateX(${Math.abs(
        (originIndex - destinationIndex) * 5
      )}rem)`;
    }

    if (direction === 'left') {
      tile!.style.transform = `translateX(-${Math.abs(
        (originIndex - destinationIndex) * 5
      )}rem)`;
    }
    setTimeout(() => {
      tile!.style.transition = 'initial';
      tile!.style.transform = 'initial';
    }, 250);
  });
};

export const placeNewTile = (
  existingBoardMatrix: number[][],
  openingMove?: boolean
) => {
  const zeroIndexes = existingBoardMatrix
    .flat()
    .reduce<number[]>((total, item, index) => {
      if (item === 0) {
        total.push(index);
      }
      return total;
    }, []);

  const zeroPlacements = pickRandomDistinctNumber(zeroIndexes, openingMove);

  for (let i = 0; i < existingBoardMatrix.length; i++) {
    for (let j = 0; j < existingBoardMatrix[i].length; j++) {
      const cellIndex = i * 4 + j;
      if (zeroPlacements.includes(cellIndex)) {
        existingBoardMatrix[i][j] = randomTwoOrFour();
      }
    }
  }
  return existingBoardMatrix;
};

const collapseRow = (
  inputBoardMatrixRow: number[],
  direction: 'left' | 'right'
) => {
  if (direction === 'left') {
    // Merge adjacent even numbers and even numbers separated by zeros to the left
    for (let i = 0; i < inputBoardMatrixRow.length - 1; i++) {
      if (inputBoardMatrixRow[i] !== 0) {
        for (let j = i + 1; j < inputBoardMatrixRow.length; j++) {
          if (inputBoardMatrixRow[j] === 0) {
            continue; // Skip zeros
          }
          if (inputBoardMatrixRow[i] === inputBoardMatrixRow[j]) {
            inputBoardMatrixRow[i] *= 2;
            inputBoardMatrixRow[j] = 0;
            break; // Merge and exit inner loop
          } else {
            break; // No merge possible, exit inner loop
          }
        }
      }
    }
    // Compact the row by removing any zeros
    let result = [] as number[];
    for (let num of inputBoardMatrixRow) {
      if (num !== 0) {
        result.push(num);
      }
    }

    // Fill the remaining slots with zeros, adjusted for "right" direction
    while (result.length < inputBoardMatrixRow.length) {
      result.push(0); // Add zeros at the end for "left" direction
    }
    return result;
  }

  // Direction === 'right'
  // Reverse the row, collapse to the left, and then reverse it back
  inputBoardMatrixRow.reverse();
  inputBoardMatrixRow = collapseRow(inputBoardMatrixRow, 'left');
  inputBoardMatrixRow.reverse();
  return inputBoardMatrixRow;
};

export const move = (
  inputBoardMatrix: number[][],
  direction: 'left' | 'right'
) => {
  let resultBoard = inputBoardMatrix.slice(0);
  for (let i = 0; i < resultBoard.length; i++) {
    let inputBoardMatrixRow = resultBoard[i].slice(0);
    resultBoard[i] = collapseRow(inputBoardMatrixRow, direction);
  }

  return resultBoard;
};
