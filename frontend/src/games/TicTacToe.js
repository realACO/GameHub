import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, X, Circle } from 'lucide-react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const calculateWinner = (squares) => {
    for (let i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
    } else if (board.every(square => square !== null)) {
      setWinner('draw');
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || winner) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const getSquareClassName = (index) => {
    let baseClass = "w-24 h-24 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-4xl font-bold transition-all duration-200 hover:scale-105 ";
    
    if (winningLine.includes(index)) {
      baseClass += "bg-green-200 dark:bg-green-700 border-green-500 ";
    }
    
    if (!board[index] && !winner) {
      baseClass += "hover:bg-purple-50 dark:hover:bg-purple-900 cursor-pointer ";
    }
    
    return baseClass;
  };

  const renderSquare = (index) => {
    const value = board[index];
    return (
      <button
        key={index}
        className={getSquareClassName(index)}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
      >
        {value === 'X' && <X className="h-12 w-12 text-purple-600" />}
        {value === 'O' && <Circle className="h-12 w-12 text-pink-600" />}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (winner === 'draw') {
      return "It's a draw!";
    } else if (winner) {
      return `Player ${winner} wins!`;
    } else {
      return `Player ${isXNext ? 'X' : 'O'}'s turn`;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get three in a row to win!
          </p>
        </div>

        {/* Score Board */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <X className="h-5 w-5 text-purple-600" />
              <span className="font-bold">Player X</span>
            </div>
            <div className="text-2xl font-bold text-center">{scores.X}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md">
            <div className="text-center text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-bold">Draws</span>
            </div>
            <div className="text-2xl font-bold text-center">{scores.draws}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <Circle className="h-5 w-5 text-pink-600" />
              <span className="font-bold">Player O</span>
            </div>
            <div className="text-2xl font-bold text-center">{scores.O}</div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </button>
          
          <button
            onClick={resetScores}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <Trophy className="h-5 w-5" />
            <span>Reset Scores</span>
          </button>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-lg ${
            winner === 'draw' ? 'bg-yellow-500 text-white' :
            winner ? 'bg-green-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {winner && winner !== 'draw' && <Trophy className="h-6 w-6" />}
            <span>{getStatusMessage()}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, index) => renderSquare(index))}
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="text-center mt-8">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">How to Play</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
              <li>• Players take turns placing X's and O's</li>
              <li>• Get three in a row to win (horizontal, vertical, or diagonal)</li>
              <li>• If all squares are filled without a winner, it's a draw</li>
              <li>• Click "New Game" to play again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;