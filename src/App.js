import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function ReverseBtn({ onButtonClick }) {
  return (
    <button className="game-info-btn reverse-btn" onClick={onButtonClick}>
      Reorder Moves
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const isEnd = calculateWinner(squares);
    if (isEnd.line || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "✗";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let winningSquares = null;
  if (winner) {
    winningSquares = winner.line;
  }

  let status;

  if (winner.winner) {
    status = "Winner: " + winner.winner;
  } else if (winner.isDraw) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>

      {[0, 1, 2].map((i) => (
        <div className="board-row" key={i}>
          {[0, 1, 2].map((j) => {
            const index = i * 3 + j;
            const isWinningSquare =
              winningSquares && winningSquares.includes(index);
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                className={isWinningSquare ? "square winning-square" : "square"}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [currentMoves, setMoves] = useState([]);
  const [isSwap, setSwaped] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    reorderMoves(!isSwap);
  }

  function reorderMoves(swit) {
    if (!swit) {
      setMoves([...moves].reverse());
    } else {
      setMoves([...moves]);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = "Go to game start";
    } else {
      const [prevRow, prevCol] = getPosition(history[move - 1], squares);
      description = `Go to move #${move} (${prevRow}, ${prevCol})`;
    }

    return (
      <li className="game-info-li" key={move}>
        <button className="game-info-btn" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  function getPosition(prevSquares, squares) {
    for (let i = 0; i < squares.length; i++) {
      if (prevSquares[i] !== squares[i]) {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return [row, col];
      }
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ReverseBtn
          onButtonClick={() => {
            reorderMoves(isSwap);
            setSwaped(!isSwap);
          }}
        />
        <ul>{currentMoves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  if (squares.every((square) => square !== null)) {
    return { winner: null, line: null, isDraw: true };
  }
  return { winner: null, line: null, isDraw: null };
}
