import React, { useState, useCallback } from 'react';
import { RotateCcw, Crown, Trophy } from 'lucide-react';

const BOARD_SIZE = 8;

const Checkers = () => {
  const [board, setBoard] = useState(() => {
    const initialBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // Place black pieces (top)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { color: 'black', isKing: false };
        }
      }
    }
    
    // Place red pieces (bottom)
    for (let row = 5; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { color: 'red', isKing: false };
        }
      }
    }
    
    return initialBoard;
  });

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [capturedPieces, setCapturedPieces] = useState({ red: 0, black: 0 });
  const [mustCapture, setMustCapture] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, red_wins, black_wins

  const isValidSquare = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  const getValidMoves = useCallback((row, col, piece, boardState = board, checkCaptures = true) => {
    const moves = [];
    const captures = [];
    
    if (!piece) return { moves, captures };

    const directions = piece.isKing 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // Kings can move in all directions
      : piece.color === 'red' 
        ? [[-1, -1], [-1, 1]] // Red moves up
        : [[1, -1], [1, 1]]; // Black moves down

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (!isValidSquare(newRow, newCol)) continue;

      if (!boardState[newRow][newCol]) {
        // Regular move to empty square
        if (!checkCaptures) {
          moves.push({ row: newRow, col: newCol, type: 'move' });
        }
      } else if (boardState[newRow][newCol].color !== piece.color) {
        // Potential capture
        const jumpRow = newRow + dRow;
        const jumpCol = newCol + dCol;
        
        if (isValidSquare(jumpRow, jumpCol) && !boardState[jumpRow][jumpCol]) {
          captures.push({
            row: jumpRow,
            col: jumpCol,
            type: 'capture',
            capturedRow: newRow,
            capturedCol: newCol
          });
        }
      }
    }

    return { moves: checkCaptures && captures.length > 0 ? [] : moves, captures };
  }, [board]);

  const getAllCaptures = useCallback((color, boardState = board) => {
    const allCaptures = [];
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = boardState[row][col];
        if (piece && piece.color === color) {
          const { captures } = getValidMoves(row, col, piece, boardState);
          if (captures.length > 0) {
            allCaptures.push({ row, col, captures });
          }
        }
      }
    }
    
    return allCaptures;
  }, [getValidMoves]);

  const makeMove = (fromRow, fromCol, toRow, toCol, capturedRow = null, capturedCol = null) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    
    // Move piece
    newBoard[toRow][toCol] = { ...piece };
    newBoard[fromRow][fromCol] = null;
    
    // Handle capture
    if (capturedRow !== null && capturedCol !== null) {
      const capturedPiece = newBoard[capturedRow][capturedCol];
      newBoard[capturedRow][capturedCol] = null;
      setCapturedPieces(prev => ({
        ...prev,
        [capturedPiece.color]: prev[capturedPiece.color] + 1
      }));
    }
    
    // Check for king promotion
    if (!piece.isKing) {
      if ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === BOARD_SIZE - 1)) {
        newBoard[toRow][toCol].isKing = true;
      }
    }
    
    setBoard(newBoard);
    
    // Check for additional captures
    const { captures } = getValidMoves(toRow, toCol, newBoard[toRow][toCol], newBoard);
    if (captures.length > 0 && (capturedRow !== null && capturedCol !== null)) {
      // Player can capture again
      setSelectedSquare([toRow, toCol]);
      setMustCapture(true);
    } else {
      // End turn
      setSelectedSquare(null);
      setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
      setMustCapture(false);
      
      // Check for win conditions
      checkGameEnd(newBoard);
    }
  };

  const checkGameEnd = (boardState) => {
    let redPieces = 0;
    let blackPieces = 0;
    let redCanMove = false;
    let blackCanMove = false;
    
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const piece = boardState[row][col];
        if (piece) {
          if (piece.color === 'red') {
            redPieces++;
            const { moves, captures } = getValidMoves(row, col, piece, boardState, false);
            if (moves.length > 0 || captures.length > 0) {
              redCanMove = true;
            }
          } else {
            blackPieces++;
            const { moves, captures } = getValidMoves(row, col, piece, boardState, false);
            if (moves.length > 0 || captures.length > 0) {
              blackCanMove = true;
            }
          }
        }
      }
    }
    
    if (redPieces === 0 || !redCanMove) {
      setGameStatus('black_wins');
    } else if (blackPieces === 0 || !blackCanMove) {
      setGameStatus('red_wins');
    }
  };

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;

    const piece = board[row][col];
    const allCaptures = getAllCaptures(currentPlayer);
    const hasCaptures = allCaptures.length > 0;

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      
      if (selectedRow === row && selectedCol === col) {
        // Deselect
        setSelectedSquare(null);
        setMustCapture(false);
        return;
      }

      const { moves, captures } = getValidMoves(selectedRow, selectedCol, selectedPiece);
      const allMoves = [...moves, ...captures];
      const validMove = allMoves.find(move => move.row === row && move.col === col);

      if (validMove) {
        if (hasCaptures && validMove.type !== 'capture') {
          // Must capture if captures are available
          return;
        }
        
        makeMove(
          selectedRow, 
          selectedCol, 
          row, 
          col, 
          validMove.capturedRow, 
          validMove.capturedCol
        );
      } else if (piece && piece.color === currentPlayer && !mustCapture) {
        // Select new piece
        setSelectedSquare([row, col]);
      } else {
        // Invalid move
        setSelectedSquare(null);
        setMustCapture(false);
      }
    } else if (piece && piece.color === currentPlayer) {
      // Select piece
      setSelectedSquare([row, col]);
    }
  };

  const resetGame = () => {
    const initialBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // Place black pieces (top)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { color: 'black', isKing: false };
        }
      }
    }
    
    // Place red pieces (bottom)
    for (let row = 5; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          initialBoard[row][col] = { color: 'red', isKing: false };
        }
      }
    }
    
    setBoard(initialBoard);
    setSelectedSquare(null);
    setCurrentPlayer('red');
    setCapturedPieces({ red: 0, black: 0 });
    setMustCapture(false);
    setGameStatus('playing');
  };

  const getSquareClassName = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    let baseClass = `w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 `;
    
    if (isLight) {
      baseClass += "bg-amber-100 ";
    } else {
      baseClass += "bg-amber-800 ";
    }

    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
      baseClass += "ring-4 ring-blue-500 ";
    }

    // Highlight valid moves
    if (selectedSquare && !isLight) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      if (selectedPiece) {
        const { moves, captures } = getValidMoves(selectedRow, selectedCol, selectedPiece);
        const allMoves = [...moves, ...captures];
        if (allMoves.some(move => move.row === row && move.col === col)) {
          const moveType = captures.some(move => move.row === row && move.col === col) ? 'capture' : 'move';
          baseClass += moveType === 'capture' 
            ? "ring-2 ring-red-400 bg-red-200 hover:bg-red-300 " 
            : "ring-2 ring-green-400 bg-green-200 hover:bg-green-300 ";
        }
      }
    }

    return baseClass;
  };

  const renderPiece = (piece) => {
    if (!piece) return null;
    
    const baseClass = "w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-200 ";
    const colorClass = piece.color === 'red' 
      ? "bg-red-500 border-red-700 " 
      : "bg-gray-800 border-gray-900 ";
    
    return (
      <div className={baseClass + colorClass}>
        {piece.isKing && <Crown className="h-6 w-6 text-yellow-400" />}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Checkers
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Jump over your opponent's pieces to win!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 ${
                currentPlayer === 'red' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-800 text-white'
              }`}>
                <div className={`w-4 h-4 rounded-full ${
                  currentPlayer === 'red' ? 'bg-red-300' : 'bg-gray-300'
                }`}></div>
                <span>{currentPlayer === 'red' ? 'Red' : 'Black'} to move</span>
              </div>
              
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
              >
                <RotateCcw className="h-5 w-5" />
                <span>New Game</span>
              </button>
            </div>

            {/* Game Status */}
            {gameStatus !== 'playing' && (
              <div className="mb-4">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <span>{gameStatus === 'red_wins' ? 'Red Wins!' : 'Black Wins!'}</span>
                </div>
              </div>
            )}

            {mustCapture && (
              <div className="mb-4">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">
                  You must capture! Additional captures available.
                </div>
              </div>
            )}

            <div className="bg-amber-900 p-4 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-8 gap-0 border-2 border-amber-900">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={getSquareClassName(rowIndex, colIndex)}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {renderPiece(piece)}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Captured Pieces</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-700"></div>
                    <span className="font-medium">Red captured:</span>
                  </div>
                  <span className="text-2xl font-bold">{capturedPieces.red}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900"></div>
                    <span className="font-medium">Black captured:</span>
                  </div>
                  <span className="text-2xl font-bold">{capturedPieces.black}</span>
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">How to Play</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Click a piece to select it</li>
                <li>• Move diagonally to empty dark squares</li>
                <li>• Jump over opponent pieces to capture them</li>
                <li>• If you can capture, you must capture</li>
                <li>• Reach the opposite end to become a King</li>
                <li>• Kings can move in all diagonal directions</li>
                <li>• Win by capturing all opponent pieces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkers;