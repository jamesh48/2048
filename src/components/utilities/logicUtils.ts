export const arraysAreEqual = (arr1: number[], arr2: number[]) => {
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
};

export const randomTwoOrFour = () => {
  if (Math.random() <= 0.9) {
    return 2;
  } else {
    return 4;
  }
};

export const calculateAnimations = (
  arr: number[],
  direction: 'left' | 'right' | 'up' | 'down'
) => {
  const results = [] as number[][];
  if (direction === 'left' || direction === 'up') {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] === 0) {
          continue;
        }
        if (arr[j] !== arr[i] && arr[i] !== 0) {
          if (results.length && arraysAreEqual(results[0], [0, 1])) {
            results.push([1, 2]);
          }
          break;
        }

        if (
          !results.length ||
          results.some((positions) => positions[1] !== j)
        ) {
          // Edge case [ 2, 2, 4, 4 ]
          if (results.length && arraysAreEqual([0, 1], results[0])) {
            results.push([1, 2], [1, 3]);
          } else {
            results.push([i, j]);
          }
        }
        break;
      }
    }
  }
  if (direction === 'right' || direction === 'down') {
    for (let i = arr.length - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j] === 0) {
          continue;
        }

        if (arr[j] !== arr[i] && arr[i] !== 0) {
          if (results.length && arraysAreEqual(results[0], [3, 2])) {
            results.push([2, 1]);
          }
          break;
        }

        if (
          !results.length ||
          results.some((positions) => positions[1] !== j)
        ) {
          if (results.length && arraysAreEqual([3, 2], results[0])) {
            results.push([2, 1], [2, 0]);
          } else {
            results.push([i, j]);
          }
        }
        break;
      }
    }
  }

  if (results.length) {
    const uniqueArray = results.filter((item, index, self) => {
      return self.findIndex((other) => arraysAreEqual(other, item)) === index;
    });

    return uniqueArray;
  }

  return false;
};

export const pickRandomDistinctNumber = (
  arr: number[],
  openingMove?: boolean
) => {
  // Make a copy of the original array to avoid modifying it
  const shuffledArray = arr.slice();

  // Shuffle the array randomly (Fisher-Yates shuffle)
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  const firstNumber = shuffledArray[0];

  if (openingMove) {
    const secondNumber = shuffledArray[1];
    return [firstNumber, secondNumber];
  }
  // Select the first two elements (which are now randomized)

  return [firstNumber];
};
