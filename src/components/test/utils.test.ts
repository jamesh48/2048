import { move, calculateAnimations } from '../utilities';

describe('calculateAnimations', () => {
  test('[0, 0, 0, 0] case', () => {
    const result = calculateAnimations([0, 0, 0, 0], 'left');
    expect(result).toBeFalsy();
  });

  test('Outside Sandwich Truthy [2, 0, 0, 2]', () => {
    const result = calculateAnimations([2, 0, 0, 2], 'left');
    expect(result && result.length).toBeTruthy();
    expect(result).toEqual([[0, 3]]);
  });

  test('Outside Sandwich Falsy[2, 0, 0, 4]', () => {
    const result = calculateAnimations([2, 0, 0, 4], 'left');
    expect(result).toEqual([[1, 3]]);
  });

  test('Adjacent Truthy [2, 2, 0, 0]', () => {
    const result = calculateAnimations([2, 2, 0, 0], 'left');
    expect(result && result.length).toBeTruthy();
    expect(result).toEqual([[0, 1]]);
  });

  test('Adjacent Falsy [2, 4, 2, 4]', () => {
    const result = calculateAnimations([2, 4, 2, 4], 'left');
    expect(result).toBeFalsy();
  });

  test('Inside Sandwich Truthy [2, 0, 2, 4]', () => {
    const result = calculateAnimations([2, 0, 2, 4], 'left');
    expect(result && result.length).toBeTruthy();
    expect(result).toEqual([[0, 2]]);
  });

  test('Inside Sandwich Falsy [2, 4, 2, 0]', () => {
    const result = calculateAnimations([2, 4, 2, 0], 'left');
    expect(result).toBeFalsy();
  });

  test('double adjacent', () => {
    const result = calculateAnimations([2, 2, 2, 2], 'left');
    expect(result && result.length).toBeTruthy();
    expect(result).toEqual([
      [0, 1],
      [1, 2],
      [1, 3],
    ]);
  });

  test('ending adjacent', () => {
    const result = calculateAnimations([2, 4, 2, 2], 'left');
    expect(result && result.length).toBeTruthy();
    expect(result).toEqual([[2, 3]]);
  });

  describe('collapse', () => {
    // describe("collapseLeft", () => {
    //   test("Beginning Adjacent", () => {
    //     // [4, 4, 0, 0]
    //     const result = collapseLeft([8, 0, 0, 0], 8, 0);
    //     expect(result).toEqual([8, 0, 0, 0]);
    //   });
    //   test("Narrow Sandwich", () => {
    //     // [2, 4, 0, 4]
    //     const result = collapseLeft([2, 8, 0, 0], 8, 2);
    //     expect(result).toEqual([2, 8, 0, 0]);
    //   });
    //   test("Ending adjacent", () => {
    //     // [0, 0, 4, 4]
    //     const result = collapseLeft([0, 0, 8, 0], 8, 2);
    //     expect(result).toEqual([8, 0, 0, 0]);
    //   });
    //   test("Ending adjacent pt 2", () => {
    //     // [2, 4, 8, 8]
    //     const result = collapseLeft([2, 4, 16, 0], 16, 2);
    //     expect(result).toEqual([2, 4, 16, 0]);
    //   });
    // });
  });

  describe('move', () => {
    describe('moveLeft', () => {
      test('Beginning Adjacent', () => {
        const result = move([[4, 4, 0, 0]], 'left');
        expect(result).toEqual([[8, 0, 0, 0]]);
      });

      describe('Narrow Sandwich', () => {
        const result = move([[4, 0, 4, 0]], 'left');
        expect(result).toEqual([[8, 0, 0, 0]]);
      });

      describe('Narrow Sandwich 2', () => {
        const result = move([[2, 4, 0, 4]], 'left');
        expect(result).toEqual([[2, 8, 0, 0]]);
      });

      describe('Wide Sandwich', () => {
        const result = move([[4, 0, 0, 4]], 'left');
        expect(result).toEqual([[8, 0, 0, 0]]);
      });

      test('End Adjacent', () => {
        const result = move([[0, 0, 4, 4]], 'left');
        expect(result).toEqual([[8, 0, 0, 0]]);
      });
    });
    describe('move right', () => {
      test('End Adjacent', () => {
        const result = move([[0, 0, 4, 4]], 'right');
        expect(result).toEqual([[0, 0, 0, 8]]);
      });

      test('Move into empty space', () => {
        const result = move([[4, 2, 4, 0]], 'right');
        expect(result).toEqual([[0, 4, 2, 4]]);
      });

      test('End Narrow Sandwich', () => {
        const result = move([[0, 4, 0, 4]], 'right');
        expect(result).toEqual([[0, 0, 0, 8]]);
      });
    });
  });
});

export {};
