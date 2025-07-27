import React, { useState, useCallback } from 'react';
import { RotateCcw, Crown, AlertCircle } from 'lucide-react';

const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const PIECE_SYMBOLS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

const PIECE_NAMES = {
  'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight', 'P': 'Pawn',
  'k': 'King', 'q': 'Queen', 'r': 'Rook', 'b': 'Bishop', 'n': 'Knight', 'p': 'Pawn'
};

const Chess = () => {
  const [board, setBoard] = useState(INITIAL_BOARD.map(row => [...row]));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  const isValidSquare = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  const isWhitePiece = (piece) => {
    return piece && piece === piece.toUpperCase();
  };

  const isBlackPiece = (piece) => {
    return piece && piece === piece.toLowerCase();
  };

  const isCurrentPlayerPiece = (piece) => {
    return currentPlayer === 'white' ? isWhitePiece(piece) : isBlackPiece(piece);
  };

  const isOpponentPiece = (piece) => {
    return currentPlayer === 'white' ? isBlackPiece(piece) : isWhitePiece(piece);
  };

  const getValidMoves = useCallback((row, col, piece, boardState = board) => {
    const moves = [];
    const pieceType = piece.toLowerCase();

    switch (pieceType) {
      case 'p': // Pawn
        const direction = isWhitePiece(piece) ? -1 : 1;
        const startRow = isWhitePiece(piece) ? 6 : 1;
        
        // Move forward
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
          moves.push([row + direction, col]);
          
          // Initial two-square move
          if (row === startRow && !boardState[row + 2 * direction][col]) {
            moves.push([row + 2 * direction, col]);
          }
        }
        
        // Capture diagonally
        for (const colOffset of [-1, 1]) {
          const newRow = row + direction;
          const newCol = col + colOffset;
          if (isValidSquare(newRow, newCol) && boardState[newRow][newCol] && 
              isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol])) {
            moves.push([newRow, newCol]);
          }
        }
        break;

      case 'r': // Rook
        const rookDirections = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dRow, dCol] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            
            if (!isValidSquare(newRow, newCol)) break;
            
            if (!boardState[newRow][newCol]) {
              moves.push([newRow, newCol]);
            } else {
              if (isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol])) {
                moves.push([newRow, newCol]);
              }
              break;
            }
          }
        }
        break;

      case 'n': // Knight
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        for (const [dRow, dCol] of knightMoves) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          
          if (isValidSquare(newRow, newCol) && 
              (!boardState[newRow][newCol] || 
               isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol]))) {
            moves.push([newRow, newCol]);
          }
        }
        break;

      case 'b': // Bishop
        const bishopDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dRow, dCol] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            
            if (!isValidSquare(newRow, newCol)) break;
            
            if (!boardState[newRow][newCol]) {
              moves.push([newRow, newCol]);
            } else {
              if (isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol])) {
                moves.push([newRow, newCol]);
              }
              break;
            }
          }
        }
        break;

      case 'q': // Queen
        const queenDirections = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dRow, dCol] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            
            if (!isValidSquare(newRow, newCol)) break;
            
            if (!boardState[newRow][newCol]) {
              moves.push([newRow, newCol]);
            } else {
              if (isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol])) {
                moves.push([newRow, newCol]);
              }
              break;
            }
          }
        }
        break;

      case 'k': // King
        const kingMoves = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dRow, dCol] of kingMoves) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          
          if (isValidSquare(newRow, newCol) && 
              (!boardState[newRow][newCol] || 
               isCurrentPlayerPiece(piece) !== isCurrentPlayerPiece(boardState[newRow][newCol]))) {
            moves.push([newRow, newCol]);
          }
        }
        break;

      default:
        break;
    }

    return moves;
  }, [board]);

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      
      if (selectedRow === row && selectedCol === col) {
        // Deselect
        setSelectedSquare(null);
        return;
      }

      const validMoves = getValidMoves(selectedRow, selectedCol, selectedPiece);
      const isValidMove = validMoves.some(([moveRow, moveCol]) => moveRow === row && moveCol === col);

      if (isValidMove) {
        // Make the move
        const newBoard = board.map(r => [...r]);
        const capturedPiece = newBoard[row][col];
        
        newBoard[row][col] = selectedPiece;
        newBoard[selectedRow][selectedCol] = null;

        // Handle captures
        if (capturedPiece) {
          const captureColor = isWhitePiece(capturedPiece) ? 'white' : 'black';
          setCapturedPieces(prev => ({
            ...prev,
            [captureColor]: [...prev[captureColor], capturedPiece]
          }));
        }

        setBoard(newBoard);
        setMoveHistory(prev => [...prev, {
          from: [selectedRow, selectedCol],
          to: [row, col],
          piece: selectedPiece,
          captured: capturedPiece
        }]);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedSquare(null);
      } else if (piece && isCurrentPlayerPiece(piece)) {
        // Select new piece
        setSelectedSquare([row, col]);
      } else {
        // Invalid move
        setSelectedSquare(null);
      }
    } else if (piece && isCurrentPlayerPiece(piece)) {
      // Select piece
      setSelectedSquare([row, col]);
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD.map(row => [...row]));
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
  };

  const getSquareClassName = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    let baseClass = `w-16 h-16 flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 hover:scale-105 `;
    
    if (isLight) {
      baseClass += "bg-amber-100 hover:bg-amber-200 ";
    } else {
      baseClass += "bg-amber-800 hover:bg-amber-700 ";
    }

    if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
      baseClass += "ring-4 ring-blue-500 ";
    }

    // Highlight valid moves
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      if (selectedPiece) {
        const validMoves = getValidMoves(selectedRow, selectedCol, selectedPiece);
        if (validMoves.some(([moveRow, moveCol]) => moveRow === row && moveCol === col)) {
          baseClass += "ring-2 ring-green-400 bg-green-200 hover:bg-green-300 ";
        }
      }
    }

    return baseClass;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Chess
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            The ultimate strategy game
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div className="mb-4 flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg font-bold ${
                currentPlayer === 'white' 
                  ? 'bg-white text-black border-2 border-gray-800' 
                  : 'bg-gray-800 text-white border-2 border-white'
              }`}>
                <Crown className="h-5 w-5 inline mr-2" />
                {currentPlayer === 'white' ? 'White' : 'Black'} to move
              </div>
              
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
              >
                <RotateCcw className="h-5 w-5" />
                <span>New Game</span>
              </button>
            </div>

            <div className="bg-amber-900 p-4 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-8 gap-0 border-2 border-amber-900">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={getSquareClassName(rowIndex, colIndex)}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {piece && (
                        <span className={isWhitePiece(piece) ? 'text-white drop-shadow-lg' : 'text-black drop-shadow-lg'}>
                          {PIECE_SYMBOLS[piece]}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
              
              {/* Board coordinates */}
              <div className="flex justify-between mt-2 px-4">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
                  <span key={letter} className="text-amber-200 text-sm font-bold">{letter}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Captured Pieces */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Captured Pieces</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Black captured:</h4>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.black.map((piece, index) => (
                      <span key={index} className="text-2xl text-black">
                        {PIECE_SYMBOLS[piece]}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">White captured:</h4>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.white.map((piece, index) => (
                      <span key={index} className="text-2xl text-white drop-shadow-lg">
                        {PIECE_SYMBOLS[piece]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Recent Moves</h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {moveHistory.slice(-5).reverse().map((move, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {PIECE_NAMES[move.piece]} {String.fromCharCode(97 + move.from[1])}{8 - move.from[0]} → {String.fromCharCode(97 + move.to[1])}{8 - move.to[0]}
                    {move.captured && <span className="text-red-500"> (captured {PIECE_NAMES[move.captured]})</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                How to Play
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Click a piece to select it</li>
                <li>• Valid moves are highlighted in green</li>
                <li>• Click a highlighted square to move</li>
                <li>• Capture opponent pieces to gain advantage</li>
                <li>• This is a simplified version - no castling, en passant, or check detection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chess;