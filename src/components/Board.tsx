import * as React from "react";
import { Box } from "@mui/material";

export const zeroSandwichOrAdjacent = (
  arr: number[],
  direction: "left" | "right" | "up" | "down",
) => {
  const results = [] as number[][];
  if (direction === "left" || direction === "up") {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] === 0) {
          continue;
        }
        if (arr[j] !== arr[i] && arr[i] !== 0) {
          break;
        }
        results.push([i, j]);
        i++;
        break;
      }
    }
  }

  if (direction === "right" || direction === "down") {
    for (let i = arr.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j] === 0) {
          continue;
        }
        if (arr[j] !== arr[i] && arr[i] !== 0) {
          break;
        }

        results.push([i, j]);
        i--;
        break;
      }
    }
  }

  if (results.length) {
    return results;
  }

  return false;
};

function collapseRow(inputBoardMatrixRow: number[], direction: "left" | "right") {
  if (direction === "left") {
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
  inputBoardMatrixRow = collapseRow(inputBoardMatrixRow, "left");
  inputBoardMatrixRow.reverse();
  return inputBoardMatrixRow;
}

export const move = (inputBoardMatrix: number[][], direction: "left" | "right") => {
  let resultBoard = inputBoardMatrix.slice(0);
  for (let i = 0; i < resultBoard.length; i++) {
    let inputBoardMatrixRow = resultBoard[i].slice(0);
    resultBoard[i] = collapseRow(inputBoardMatrixRow, direction);
  }

  return resultBoard;
};

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

function untransposeBoard(transposedBoard: number[][]) {
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
}

function pickTwoDistinctNumbers(arr: number[]) {
  // Make a copy of the original array to avoid modifying it
  const shuffledArray = arr.slice();

  // Shuffle the array randomly (Fisher-Yates shuffle)
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Select the first two elements (which are now randomized)
  const firstNumber = shuffledArray[0];
  const secondNumber = shuffledArray[1];

  return [firstNumber, secondNumber];
}

function arraysAreEqual(arr1: number[], arr2: number[]) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Compare elements one by one
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If all elements match, the arrays are equal
  return true;
}

const placeTwoTiles = (existingBoardMatrix: number[][]) => {
  const zeroIndexes = existingBoardMatrix.flat().reduce<number[]>((total, item, index) => {
    if (item === 0) {
      total.push(index);
    }
    return total;
  }, []);

  const zeroPlacements = pickTwoDistinctNumbers(zeroIndexes);

  for (let i = 0; i < existingBoardMatrix.length; i++) {
    for (let j = 0; j < existingBoardMatrix[i].length; j++) {
      const cellIndex = i * 4 + j;
      if (zeroPlacements.includes(cellIndex)) {
        existingBoardMatrix[i][j] = 2;
      }
    }
  }
  return existingBoardMatrix;
};

const animateTiles = (boardMatrix: number[][], direction: "left" | "right" | "up" | "down") => {
  const tilePositions = (() => {
    if (direction === "up" || direction === "down") {
      const transposedBoard = transposeBoard(boardMatrix);
      return transposedBoard.reduce((total, boardRow, rowIndex) => {
        const rowResult = zeroSandwichOrAdjacent(boardRow, direction);

        if (rowResult) {
          rowResult.forEach((result) => {
            result.unshift(rowIndex);
            total.push(result);
          });
        }
        return total;
      }, [] as number[][]);
    }

    const board = boardMatrix.slice(0);
    return board.reduce((total, boardRow, rowIndex) => {
      const rowResult = zeroSandwichOrAdjacent(boardRow, direction);

      if (rowResult) {
        rowResult.forEach((result) => {
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
      if (["left", "right"].includes(direction)) {
        return document.getElementById(`tile-${rowIndex}-${originIndex}`);
      }
      // up, down
      return document.getElementById(`tile-${originIndex}-${rowIndex}`);
    })();

    tile!.style.transition = "transform 0.5s ease";

    if (direction === "up") {
      tile!.style.transform = `translateY(-${Math.abs((originIndex - destinationIndex) * 5)}rem)`;
    }

    if (direction === "down") {
      tile!.style.transform = `translateY(${Math.abs((originIndex - destinationIndex) * 5)}rem)`;
    }

    if (direction === "right") {
      tile!.style.transform = `translateX(${Math.abs((originIndex - destinationIndex) * 5)}rem)`;
    }

    if (direction === "left") {
      tile!.style.transform = `translateX(-${Math.abs((originIndex - destinationIndex) * 5)}rem)`;
    }
    setTimeout(() => {
      tile!.style.transition = "initial";
      tile!.style.transform = "initial";
    }, 500);
  });
};

const Board = () => {
  const [boardMatrix, setBoardMatrix] = React.useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  React.useEffect(() => {
    setBoardMatrix((existingBoardMatrix) => {
      return [...placeTwoTiles(existingBoardMatrix)];
    });
  }, []);

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        animateTiles(boardMatrix, "left");
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = move(boardMatrix, "left");
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeTwoTiles(possibleMove)];
            }
          });
        }, 500);
      } else if (event.key === "ArrowRight") {
        animateTiles(boardMatrix, "right");
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = move(boardMatrix, "right");
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeTwoTiles(possibleMove)];
            }
          });
        }, 500);
      } else if (event.key === "ArrowUp") {
        animateTiles(boardMatrix, "up");
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = untransposeBoard(move(transposeBoard(boardMatrix), "left"));
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeTwoTiles(possibleMove)];
            }
          });
        }, 500);
      } else if (event.key === "ArrowDown") {
        animateTiles(boardMatrix, "down");
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = untransposeBoard(move(transposeBoard(boardMatrix), "right"));
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeTwoTiles(possibleMove)];
            }
          });
        }, 500);
      }
    };

    window.addEventListener("keydown", callback);

    return () => window.removeEventListener("keydown", callback);
  }, [boardMatrix]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {boardMatrix.map((row, jindex) => {
        return (
          <Box sx={{ display: "flex", border: "1px solid white" }}>
            {row.map((tile, index) => {
              return (
                <Box
                  id={`tile-${jindex}-${index}`}
                  sx={{
                    boxSizing: "border-box",
                    color: "white",
                    border: "1px solid grey",
                    padding: "1.5rem",
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: (() => {
                      if (tile === 2) {
                        return "green";
                      }
                      if (tile === 4) {
                        return "blue";
                      }

                      if (tile === 8) {
                        return "orange";
                      }

                      if (tile === 16) {
                        return "purple";
                      }

                      if (tile === 32) {
                        return "brown";
                      }

                      if (tile === 64) {
                        return "pink";
                      }
                      return "black";
                    })(),
                  }}
                >
                  {tile}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default Board;
