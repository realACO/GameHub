import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 4;

const Game2048 = () => {
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0))
  );
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, gameOver

  const addRandomTile = useCallback((currentGrid) => {
    const emptyCells = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length === 0) return currentGrid;
    
    const newGrid = currentGrid.map(row => [...row]);
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newGrid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    
    return newGrid;
  }, []);

  const initializeGrid = useCallback(() => {
    let newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    return newGrid;
  }, [addRandomTile]);

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    resetGame();
  }, [initializeGrid]);

  const canMove = (grid) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true;
      }
    }
    
    // Check for adjacent equal cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = grid[i][j];
        if (
          (i < GRID_SIZE - 1 && grid[i + 1][j] === current) ||
          (j < GRID_SIZE - 1 && grid[i][j + 1] === current)
        ) {
          return true;
        }
      }
    }
    
    return false;
  };

  const slideArray = (arr) => {
    const filtered = arr.filter(val => val !== 0);
    const missing = GRID_SIZE - filtered.length;
    const zeros = Array(missing).fill(0);
    return filtered.concat(zeros);
  };

  const combineArray = (arr) => {
    let newScore = 0;
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        newScore += arr[i];
        
        if (arr[i] === 2048 && gameStatus === 'playing') {
          setGameStatus('won');
        }
      }
    }
    return { arr, newScore };
  };

  const moveLeft = (grid) => {
    let newGrid = [];
    let totalScore = 0;
    let moved = false;

    for (let i = 0; i < GRID_SIZE; i++) {
      let arr = grid[i];
      arr = slideArray(arr);
      const result = combineArray(arr);
      arr = slideArray(result.arr);
      
      if (JSON.stringify(arr) !== JSON.stringify(grid[i])) {
        moved = true;
      }
      
      newGrid.push(arr);
      totalScore += result.newScore;
    }

    return { grid: newGrid, score: totalScore, moved };
  };

  const moveRight = (grid) => {
    let newGrid = [];
    let totalScore = 0;
    let moved = false;

    for (let i = 0; i < GRID_SIZE; i++) {
      let arr = [...grid[i]].reverse();
      arr = slideArray(arr);
      const result = combineArray(arr);
      arr = slideArray(result.arr);
      arr = arr.reverse();
      
      if (JSON.stringify(arr) !== JSON.stringify(grid[i])) {
        moved = true;
      }
      
      newGrid.push(arr);
      totalScore += result.newScore;
    }

    return { grid: newGrid, score: totalScore, moved };
  };

  const moveUp = (grid) => {
    let newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    let totalScore = 0;
    let moved = false;

    for (let j = 0; j < GRID_SIZE; j++) {
      let arr = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        arr.push(grid[i][j]);
      }
      
      arr = slideArray(arr);
      const result = combineArray(arr);
      arr = slideArray(result.arr);
      
      let originalColumn = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        originalColumn.push(grid[i][j]);
      }
      
      if (JSON.stringify(arr) !== JSON.stringify(originalColumn)) {
        moved = true;
      }
      
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i][j] = arr[i];
      }
      
      totalScore += result.newScore;
    }

    return { grid: newGrid, score: totalScore, moved };
  };

  const moveDown = (grid) => {
    let newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    let totalScore = 0;
    let moved = false;

    for (let j = 0; j < GRID_SIZE; j++) {
      let arr = [];
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        arr.push(grid[i][j]);
      }
      
      arr = slideArray(arr);
      const result = combineArray(arr);
      arr = slideArray(result.arr);
      
      let originalColumn = [];
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        originalColumn.push(grid[i][j]);
      }
      
      if (JSON.stringify(arr) !== JSON.stringify(originalColumn)) {
        moved = true;
      }
      
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[GRID_SIZE - 1 - i][j] = arr[i];
      }
      
      totalScore += result.newScore;
    }

    return { grid: newGrid, score: totalScore, moved };
  };

  const handleMove = (direction) => {
    if (gameStatus === 'gameOver') return;

    let result;
    switch (direction) {
      case 'left':
        result = moveLeft(grid);
        break;
      case 'right':
        result = moveRight(grid);
        break;
      case 'up':
        result = moveUp(grid);
        break;
      case 'down':
        result = moveDown(grid);
        break;
      default:
        return;
    }

    if (result.moved) {
      const newGrid = addRandomTile(result.grid);
      setGrid(newGrid);
      setScore(prev => prev + result.score);

      if (!canMove(newGrid)) {
        setGameStatus('gameOver');
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameStatus === 'gameOver') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove('down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grid, gameStatus]);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-200 dark:bg-gray-700',
      2: 'bg-yellow-100 text-gray-800',
      4: 'bg-yellow-200 text-gray-800',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-purple-600 text-white animate-pulse',
    };
    
    return colors[value] || 'bg-purple-700 text-white';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
            2048
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Combine tiles to reach 2048!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-lg">Score: {score}</span>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus === 'won' && (
          <div className="text-center mb-8">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>You Won! Keep going!</span>
            </div>
          </div>
        )}

        {gameStatus === 'gameOver' && (
          <div className="text-center mb-8">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>Game Over! Final Score: {score}</span>
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-400 p-4 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-4 gap-2">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-20 h-20 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${getTileColor(cell)}`}
                  >
                    {cell !== 0 ? cell : ''}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Controls</h3>
            <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-4">
              <div></div>
              <button 
                onClick={() => handleMove('up')}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowUp className="h-4 w-4 mx-auto" />
              </button>
              <div></div>
              <button 
                onClick={() => handleMove('left')}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mx-auto" />
              </button>
              <button 
                onClick={() => handleMove('down')}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowDown className="h-4 w-4 mx-auto" />
              </button>
              <button 
                onClick={() => handleMove('right')}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowRight className="h-4 w-4 mx-auto" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use arrow keys or click buttons to move tiles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2048;