import * as React from 'react';
import { Box } from '@mui/material';
import {
  animateTiles,
  arraysAreEqual,
  move,
  placeNewTile,
  transposeBoard,
  untransposeBoard,
} from './utilities';

const Board = () => {
  const [boardMatrix, setBoardMatrix] = React.useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  React.useEffect(() => {
    setBoardMatrix((existingBoardMatrix) => {
      return [...placeNewTile(existingBoardMatrix, true)];
    });
  }, []);

  React.useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        animateTiles(boardMatrix, 'left');
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = move(boardMatrix, 'left');
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeNewTile(possibleMove)];
            }
          });
        }, 250);
      } else if (event.key === 'ArrowRight') {
        animateTiles(boardMatrix, 'right');
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = move(boardMatrix, 'right');
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeNewTile(possibleMove)];
            }
          });
        }, 250);
      } else if (event.key === 'ArrowUp') {
        animateTiles(boardMatrix, 'up');
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = untransposeBoard(
              move(transposeBoard(boardMatrix), 'left')
            );
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeNewTile(possibleMove)];
            }
          });
        }, 250);
      } else if (event.key === 'ArrowDown') {
        animateTiles(boardMatrix, 'down');
        setTimeout(() => {
          setBoardMatrix((existing) => {
            const possibleMove = untransposeBoard(
              move(transposeBoard(boardMatrix), 'right')
            );
            if (arraysAreEqual(possibleMove.flat(), existing.flat())) {
              return [...existing];
            } else {
              return [...placeNewTile(possibleMove)];
            }
          });
        }, 250);
      }
    };

    window.addEventListener('keydown', callback);

    return () => window.removeEventListener('keydown', callback);
  }, [boardMatrix]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Box sx={{ border: '.25rem solid #716556' }}>
        {boardMatrix.map((row, jindex) => {
          return (
            <Box
              sx={{ display: 'flex', backgroundColor: '#8a7e6f' }}
              key={jindex}
            >
              {row.map((tile, index) => {
                return (
                  <Box
                    key={index}
                    id={`tile-${jindex}-${index}`}
                    sx={{
                      boxSizing: 'border-box',
                      color: (() => {
                        if ([2, 4].includes(tile)) {
                          return 'black';
                        }
                        return 'ivory';
                      })(),
                      border: '.25rem solid #716556',
                      fontWeight: 700,
                      fontSize: (() => {
                        if (tile > 999) {
                          return '1.5rem';
                        }
                        if (tile > 99) {
                          return '2rem';
                        }
                        return '2.5rem';
                      })(),
                      padding: '1.5rem',
                      width: '5rem',
                      height: '5rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: (() => {
                        if (tile === 2) {
                          return 'ivory';
                        }
                        if (tile === 4) {
                          return 'beige';
                        }

                        if (tile === 8) {
                          return 'orange';
                        }

                        if (tile === 16) {
                          return 'coral';
                        }

                        if (tile === 32) {
                          return '#CD5B45';
                        }

                        if (tile === 64) {
                          return 'maroon';
                        }

                        if (tile === 128) {
                          return '#E4E47C';
                        }

                        if (tile === 256) {
                          return '#E0E066';
                        }

                        if (tile === 512) {
                          return '#E0C466';
                        }

                        if (tile === 1024) {
                          return '#e0a766';
                        }

                        if (tile === 2048) {
                          return '#d6e066';
                        }

                        if (tile === 4096) {
                          return 'black';
                        }
                        return '#8a7e6f';
                      })(),
                    }}
                  >
                    {tile === 0 ? null : tile}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Board;
