import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameStatus, setGameStatus] = useState('paused'); // paused, playing, gameOver
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setGameStatus('paused');
    setScore(0);
  };

  const startGame = () => {
    setGameStatus('playing');
  };

  const moveSnake = useCallback(() => {
    if (gameStatus !== 'playing') return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameStatus('gameOver');
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameStatus('gameOver');
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStatus, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameStatus === 'paused') {
        if (e.code === 'Space') {
          startGame();
          return;
        }
      }
      
      if (gameStatus !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStatus]);

  const getCellContent = (x, y) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    if (isSnakeHead) {
      return (
        <div className="w-full h-full bg-green-600 rounded-sm flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      );
    }

    if (isSnakeBody) {
      return <div className="w-full h-full bg-green-500 rounded-sm"></div>;
    }

    if (isFood) {
      return <div className="w-full h-full bg-red-500 rounded-full animate-pulse"></div>;
    }

    return null;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
            Snake Game
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Eat the red food and grow longer!
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
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus === 'paused' && (
          <div className="text-center mb-8">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-block">
              Press SPACE to Start
            </div>
          </div>
        )}

        {gameStatus === 'gameOver' && (
          <div className="text-center mb-8">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>Game Over! Score: {score}</span>
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 p-4 rounded-2xl shadow-2xl">
            <div 
              className="grid gap-px bg-gray-700"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: '400px',
                height: '400px'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                return (
                  <div
                    key={index}
                    className="bg-gray-800 flex items-center justify-center"
                  >
                    {getCellContent(x, y)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Controls</h3>
            <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
              <div></div>
              <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ArrowUp className="h-4 w-4 mx-auto" />
              </button>
              <div></div>
              <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mx-auto" />
              </button>
              <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ArrowDown className="h-4 w-4 mx-auto" />
              </button>
              <button className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <ArrowRight className="h-4 w-4 mx-auto" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Use arrow keys to control the snake
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snake;