import React, { useState } from "react";

function Square({ value, onSquareClick }) {
  return (<button className="square" onClick={onSquareClick}>{value}</button>)
}

function Board({ squares, isXNext, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (isXNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }


  return (
    <div>
      {
        squares.map((square, id) => <Square
          value={square}
          key={id}
          onSquareClick={() => handleClick(id)}
        />)
      }
    </div>
  )
}

export default function Game() {
  const [isXNext, setIsXNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null)); //not a state
  const [history, setHistory] = useState([squares]);
  const [currentMove, setCurrentMove] = useState(0);

  function handlePlay(nextSquares) {
    setIsXNext(!isXNext);
    setSquares(nextSquares);
    const nextHistory = [...history.slice(0,currentMove+1), nextSquares];
    setCurrentMove(nextHistory.length-1);
    setHistory(nextHistory);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setIsXNext(nextMove%2 === 0);
    setSquares(history[nextMove])
  }

  const moves = history.map((squares, move)=>{
    let description;
    if(move>0){
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return(
      <li key={move}>
        <button onClick={()=>jumpTo(move)}>{description}</button>
      </li>
    )
  })

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner
  } else {
    status = "Next player: " + (isXNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="board">
        <Board
          squares={squares}
          onPlay={handlePlay}
          isXNext={isXNext} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <span>History:</span>
        <ol>{moves}</ol>
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
      return squares[a];
    }
  }
  return null;
}


/* 
To do later:
For the current move only, show “You are at move #…” instead of a button.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
Display the location for each move in the format (row, col) in the move history list.
Make it beautifull and deploy on github
*/