import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';

const GRID_SIZE = 10;
const MINE_COUNT = 15;

const Minesweeper = () => {
  const [grid, setGrid] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [flagCount, setFlagCount] = useState(MINE_COUNT);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const initializeGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() =>
      Array(GRID_SIZE).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < GRID_SIZE &&
                newCol >= 0 && newCol < GRID_SIZE &&
                newGrid[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[row][col].neighborMines = count;
        }
      }
    }

    return newGrid;
  }, []);

  const resetGame = () => {
    setGrid(initializeGrid());
    setGameStatus('playing');
    setFlagCount(MINE_COUNT);
    setTime(0);
    setTimerActive(false);
  };

  useEffect(() => {
    resetGame();
  }, [initializeGrid]);

  useEffect(() => {
    let interval;
    if (timerActive && gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameStatus]);

  const revealCell = (row, col) => {
    if (gameStatus !== 'playing' || grid[row][col].isRevealed || grid[row][col].isFlagged) {
      return;
    }

    if (!timerActive) {
      setTimerActive(true);
    }

    const newGrid = [...grid];
    
    if (newGrid[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c].isMine) {
            newGrid[r][c].isRevealed = true;
          }
        }
      }
      setGameStatus('lost');
      setTimerActive(false);
    } else {
      // Reveal cells using flood fill
      const queue = [[row, col]];
      const visited = new Set();

      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift();
        const key = `${currentRow}-${currentCol}`;
        
        if (visited.has(key)) continue;
        visited.add(key);

        if (
          currentRow < 0 || currentRow >= GRID_SIZE ||
          currentCol < 0 || currentCol >= GRID_SIZE ||
          newGrid[currentRow][currentCol].isRevealed ||
          newGrid[currentRow][currentCol].isFlagged ||
          newGrid[currentRow][currentCol].isMine
        ) {
          continue;
        }

        newGrid[currentRow][currentCol].isRevealed = true;

        if (newGrid[currentRow][currentCol].neighborMines === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              queue.push([currentRow + i, currentCol + j]);
            }
          }
        }
      }

      // Check win condition
      let revealedCount = 0;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c].isRevealed && !newGrid[r][c].isMine) {
            revealedCount++;
          }
        }
      }

      if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
        setGameStatus('won');
        setTimerActive(false);
      }
    }

    setGrid(newGrid);
  };

  const toggleFlag = (e, row, col) => {
    e.preventDefault();
    
    if (gameStatus !== 'playing' || grid[row][col].isRevealed) {
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    
    setFlagCount(prev => newGrid[row][col].isFlagged ? prev - 1 : prev + 1);
    setGrid(newGrid);
  };

  const getCellContent = (cell) => {
    if (cell.isFlagged) {
      return <Flag className="h-4 w-4 text-red-500" />;
    }
    
    if (!cell.isRevealed) {
      return null;
    }
    
    if (cell.isMine) {
      return <Bomb className="h-4 w-4 text-red-600" />;
    }
    
    if (cell.neighborMines > 0) {
      return (
        <span className={`font-bold text-sm ${
          cell.neighborMines === 1 ? 'text-blue-600' :
          cell.neighborMines === 2 ? 'text-green-600' :
          cell.neighborMines === 3 ? 'text-red-600' :
          cell.neighborMines === 4 ? 'text-purple-600' :
          cell.neighborMines === 5 ? 'text-yellow-600' :
          cell.neighborMines === 6 ? 'text-pink-600' :
          cell.neighborMines === 7 ? 'text-black' : 'text-gray-600'
        }`}>
          {cell.neighborMines}
        </span>
      );
    }
    
    return null;
  };

  const getCellClassName = (cell) => {
    let baseClass = "w-8 h-8 border border-gray-400 flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-105 ";
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        baseClass += "bg-red-500 hover:bg-red-600";
      } else {
        baseClass += "bg-gray-200 dark:bg-gray-600";
      }
    } else {
      baseClass += "bg-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer";
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Minesweeper
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find all the mines without exploding!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Flag className="h-5 w-5 text-red-500" />
            <span className="font-bold text-lg">{flagCount}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-lg">{time}s</span>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus !== 'playing' && (
          <div className="text-center mb-8">
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold text-lg ${
              gameStatus === 'won' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {gameStatus === 'won' ? (
                <>
                  <Trophy className="h-6 w-6" />
                  <span>You Won!</span>
                </>
              ) : (
                <>
                  <Bomb className="h-6 w-6" />
                  <span>Game Over!</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClassName(cell)}
                    onClick={() => revealCell(rowIndex, colIndex)}
                    onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                    disabled={gameStatus !== 'playing'}
                  >
                    {getCellContent(cell)}
                  </button>
                ))
              )}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Left click to reveal • Right click to flag
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;