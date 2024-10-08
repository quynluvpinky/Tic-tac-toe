import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function renderSquare(i) {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winningSquares.includes(i)}
      />
    );
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (squares.every(Boolean)) {
    status = 'Draw: No one wins';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function App() {

  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const [winningSquares, setWinningSquares] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, location) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      setWinningSquares(winner.line);
    } else {
      setWinningSquares([]);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    const winner = calculateWinner(history[nextMove].squares);
    if (winner) {
      setWinningSquares(winner.line);
    } else {
      setWinningSquares([]);
    }
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  function getLocation(index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return `(${row}, ${col})`;
  }

  const moves = history.map((step, move) => {
    const description = move > 0 ? `Go to move #${move} ${step.location !== null ? getLocation(step.location) : ''}` : 'Go to game start';
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move} {step.location !== null ? getLocation(step.location) : ''}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

export default App
