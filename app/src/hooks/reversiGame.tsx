import { useState, useEffect } from "react";

export const Disc = {
  black: "black",
  white: "white",
  empty: undefined,
};
export type Disc = (typeof Disc)[keyof typeof Disc];

export const Winner = {
  black: "black",
  white: "white",
  draw: "draw",
};
export type Winner = (typeof Winner)[keyof typeof Winner];

export type ReversiGameType = {
  board: Disc[][];
  currentPlayer: Disc;
  makeMove: (row: number, col: number) => boolean;
  checkMakeable: (row: number, col: number) => boolean;
  reset: () => void;
  debug: () => void;
};

export const useReversiGame = (): ReversiGameType => {
  const initialBoard: Disc[][] = [...Array(8)].map(() =>
    Array(8).fill(Disc.empty as Disc),
  );

  initialBoard[3][3] = Disc.white;
  initialBoard[4][4] = Disc.white;
  initialBoard[3][4] = Disc.black;
  initialBoard[4][3] = Disc.black;

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Disc>(Disc.black);
  const [winner, setWinner] = useState<Winner | undefined>(undefined);
  const [passCount, setPassCount] = useState(0);

  const discCount = (): [number, number] => {
    let blackCount = 0;
    let whiteCount = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === Disc.black) {
          blackCount++;
        } else if (cell === Disc.white) {
          whiteCount++;
        }
      });
    });
    return [blackCount, whiteCount];
  };

  const checkWinner = () => {
    const [blackCount, whiteCount] = discCount();
    if (blackCount + whiteCount === 64) {
      if (blackCount > whiteCount) {
        setWinner(Winner.black);
      } else if (blackCount < whiteCount) {
        setWinner(Winner.white);
      } else {
        setWinner(undefined);
      }
    }
  };

  // 石を置けるかどうかの判定
  const checkMakeable = (row: number, col: number): boolean => {
    if (board[row][col] !== Disc.empty) {
      return false;
    }
    // 8方向に対して石をひっくり返せるかどうかを判定
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    let makeable = false;
    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      let canReverse = false;
      while (0 <= x && x < 8 && 0 <= y && y < 8) {
        if (board[x][y] === Disc.empty) {
          break;
        }
        if (board[x][y] === currentPlayer) {
          if (canReverse) {
            makeable = true;
          }
          break;
        }
        canReverse = true;
        x += dx;
        y += dy;
      }
    });
    return makeable;
  };

  const checkMakeableAll = (): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (checkMakeable(i, j)) {
          return true;
        }
      }
    }
    return false;
  };

  // 石をひっくり返す処理
  const reverse = (row: number, col: number) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      let canReverse = false;
      while (0 <= x && x < 8 && 0 <= y && y < 8) {
        if (board[x][y] === Disc.empty) {
          break;
        }
        if (board[x][y] === currentPlayer) {
          if (canReverse) {
            let nx = row + dx;
            let ny = col + dy;
            while (nx !== x || ny !== y) {
              board[nx][ny] = currentPlayer;
              nx += dx;
              ny += dy;
            }
          }
          break;
        }
        canReverse = true;
        x += dx;
        y += dy;
      }
    });
    return board;
  };

  const makeMove = (row: number, col: number): boolean => {
    if (board[row][col] !== undefined) {
      return false;
    }
    if (!checkMakeable(row, col)) {
      return false;
    }
    board[row][col] = currentPlayer;
    reverse(row, col);
    setBoard(board);
    setCurrentPlayer(currentPlayer === Disc.black ? Disc.white : Disc.black);
    return true;
  };

  const reset = () => {
    setBoard(initialBoard);
    setCurrentPlayer(Disc.black);
    setWinner(undefined);
    setPassCount(0);
  };

  // パスの動作を確認するためのboardを生成
  const setPassBoard = () => {
    const initialBoard: Disc[][] = [...Array(8)].map(() =>
      Array(8).fill(Disc.empty as Disc),
    );
    initialBoard[3][3] = Disc.black;
    initialBoard[4][4] = Disc.white;
    initialBoard[3][4] = Disc.black;
    initialBoard[4][3] = Disc.black;

    initialBoard[3][2] = Disc.black;
    initialBoard[4][5] = Disc.white;
    initialBoard[4][6] = Disc.white;

    initialBoard[5][5] = Disc.white;

    initialBoard[6][3] = Disc.black;

    initialBoard[6][4] = Disc.black;
    initialBoard[6][5] = Disc.black;
    initialBoard[6][6] = Disc.black;
    initialBoard[6][6] = Disc.black;
    initialBoard[6][7] = Disc.black;

    initialBoard[7][7] = Disc.white;
    setBoard(initialBoard);
  };

  // boardが変化したときの処理
  useEffect(() => {
    if (!checkMakeableAll()) {
      if (passCount === 1) {
        setWinner(Winner.draw);
      }
      setCurrentPlayer(currentPlayer === Disc.black ? Disc.white : Disc.black);
      setPassCount(passCount + 1);
    } else {
      setPassCount(0);
    }
    checkWinner();
  }, [discCount(), passCount]);

  useEffect(() => {
    switch (winner) {
      case Winner.black:
        alert("黒の勝ちです");
        break;
      case Winner.white:
        alert("白の勝ちです");
        break;
      case Winner.draw:
        alert("引き分けです");
        break;
    }
    reset();
  }, [winner]);

  return {
    board,
    currentPlayer,
    makeMove,
    checkMakeable,
    reset,
    debug: () => {
      setPassBoard();
    },
  };
};
