import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Trophy, Bird, Play, Pause } from 'lucide-react';

const GAME_HEIGHT = 600;
const GAME_WIDTH = 400;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_SPEED = 3;

const FlappyBird = () => {
  const [bird, setBird] = useState({ y: GAME_HEIGHT / 2, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready'); // ready, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyBirdHighScore');
    return saved ? parseInt(saved) : 0;
  });
  
  const gameLoopRef = useRef();
  const pipeIdRef = useRef(0);

  const createPipe = useCallback(() => {
    const pipeHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 200) + 100;
    return {
      id: pipeIdRef.current++,
      x: GAME_WIDTH,
      topHeight: pipeHeight,
      bottomY: pipeHeight + PIPE_GAP,
      passed: false
    };
  }, []);

  const resetGame = () => {
    setBird({ y: GAME_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameStatus('ready');
    pipeIdRef.current = 0;
  };

  const jump = useCallback(() => {
    if (gameStatus === 'ready') {
      setGameStatus('playing');
    }
    
    if (gameStatus !== 'gameOver') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, [gameStatus]);

  const checkCollision = useCallback((birdY, currentPipes) => {
    // Check ground and ceiling collision
    if (birdY <= 0 || birdY >= GAME_HEIGHT - BIRD_SIZE) {
      return true;
    }

    // Check pipe collision
    for (const pipe of currentPipes) {
      if (
        pipe.x < BIRD_SIZE + 50 && // Bird x position is fixed at 50
        pipe.x + PIPE_WIDTH > 50 &&
        (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.bottomY)
      ) {
        return true;
      }
    }

    return false;
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStatus !== 'playing') return;

    setBird(prev => {
      const newVelocity = prev.velocity + GRAVITY;
      const newY = prev.y + newVelocity;
      return { y: newY, velocity: newVelocity };
    });

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      
      // Remove pipes that are off screen
      newPipes = newPipes.filter(pipe => pipe.x + PIPE_WIDTH > -100);
      
      // Add new pipe if needed
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
        newPipes.push(createPipe());
      }
      
      // Check for score updates
      let newScore = score;
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          newScore++;
        }
      });
      
      if (newScore !== score) {
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('flappyBirdHighScore', newScore.toString());
        }
      }

      return newPipes;
    });
  }, [gameStatus, score, highScore, createPipe]);

  // Check collision
  useEffect(() => {
    if (gameStatus === 'playing') {
      const collision = checkCollision(bird.y, pipes);
      if (collision) {
        setGameStatus('gameOver');
      }
    }
  }, [bird.y, pipes, gameStatus, checkCollision]);

  // Game loop
  useEffect(() => {
    if (gameStatus === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60); // 60 FPS
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameLoop, gameStatus]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  const renderPipe = (pipe) => (
    <div key={pipe.id}>
      {/* Top pipe */}
      <div
        className="absolute bg-green-500 border-4 border-green-700"
        style={{
          left: pipe.x,
          top: 0,
          width: PIPE_WIDTH,
          height: pipe.topHeight,
        }}
      />
      {/* Bottom pipe */}
      <div
        className="absolute bg-green-500 border-4 border-green-700"
        style={{
          left: pipe.x,
          top: pipe.bottomY,
          width: PIPE_WIDTH,
          height: GAME_HEIGHT - pipe.bottomY,
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Flappy Bird
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Fly through the pipes without crashing!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{highScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best</div>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus === 'ready' && (
          <div className="text-center mb-8">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
              <Play className="h-6 w-6" />
              <span>Press SPACE or Click to Start!</span>
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

        {/* Game Area */}
        <div className="flex justify-center mb-8">
          <div className="relative bg-gradient-to-b from-sky-200 to-green-200 border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
            <div
              className="relative cursor-pointer"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              onClick={jump}
            >
              {/* Background elements */}
              <div className="absolute inset-0">
                {/* Clouds */}
                <div className="absolute top-10 left-10 w-16 h-8 bg-white rounded-full opacity-70"></div>
                <div className="absolute top-20 right-20 w-20 h-10 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-32 left-32 w-12 h-6 bg-white rounded-full opacity-80"></div>
                
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-green-400 border-t-4 border-green-600"></div>
              </div>

              {/* Pipes */}
              {pipes.map(renderPipe)}

              {/* Bird */}
              <div
                className="absolute transition-transform duration-100"
                style={{
                  left: 50 - BIRD_SIZE / 2,
                  top: bird.y - BIRD_SIZE / 2,
                  transform: `rotate(${Math.min(bird.velocity * 3, 45)}deg)`,
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center shadow-lg">
                    <Bird className="h-4 w-4 text-yellow-800" />
                  </div>
                  {/* Wing */}
                  <div className="absolute -right-1 top-2 w-3 h-2 bg-orange-400 rounded-full border border-orange-600"></div>
                </div>
              </div>

              {/* Score display in game */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="text-4xl font-bold text-white drop-shadow-lg">
                  {score}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">How to Play</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
              <li>• Press SPACE or click to make the bird fly</li>
              <li>• Avoid hitting the pipes or ground</li>
              <li>• Each pipe you pass gives you 1 point</li>
              <li>• Try to beat your high score!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;