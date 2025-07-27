import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Layers, Clock, Target } from 'lucide-react';

const DISK_COLORS = [
  'bg-red-500 border-red-700',
  'bg-orange-500 border-orange-700', 
  'bg-yellow-500 border-yellow-700',
  'bg-green-500 border-green-700',
  'bg-blue-500 border-blue-700',
  'bg-indigo-500 border-indigo-700',
  'bg-purple-500 border-purple-700',
];

const TowerOfHanoi = () => {
  const [numDisks, setNumDisks] = useState(3);
  const [towers, setTowers] = useState([]);
  const [selectedTower, setSelectedTower] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [minMoves, setMinMoves] = useState(7); // 2^n - 1

  const initializeGame = (diskCount) => {
    const newTowers = [[], [], []];
    // Place all disks on the first tower (largest to smallest)
    for (let i = diskCount - 1; i >= 0; i--) {
      newTowers[0].push(i);
    }
    setTowers(newTowers);
    setMoves(0);
    setTime(0);
    setSelectedTower(null);
    setGameStatus('playing');
    setIsActive(false);
    setMinMoves(Math.pow(2, diskCount) - 1);
  };

  useEffect(() => {
    initializeGame(numDisks);
  }, [numDisks]);

  useEffect(() => {
    let interval = null;
    if (isActive && gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, gameStatus]);

  const canMoveDisk = (fromTower, toTower) => {
    const from = towers[fromTower];
    const to = towers[toTower];
    
    if (from.length === 0) return false;
    if (to.length === 0) return true;
    
    return from[from.length - 1] < to[to.length - 1];
  };

  const moveDisk = (fromTower, toTower) => {
    if (!canMoveDisk(fromTower, toTower)) return;

    if (!isActive) {
      setIsActive(true);
    }

    const newTowers = towers.map(tower => [...tower]);
    const disk = newTowers[fromTower].pop();
    newTowers[toTower].push(disk);
    
    setTowers(newTowers);
    setMoves(prev => prev + 1);

    // Check win condition
    if (newTowers[2].length === numDisks) {
      setGameStatus('won');
      setIsActive(false);
    }
  };

  const handleTowerClick = (towerIndex) => {
    if (gameStatus === 'won') return;

    if (selectedTower === null) {
      // Select a tower if it has disks
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
      }
    } else if (selectedTower === towerIndex) {
      // Deselect if clicking the same tower
      setSelectedTower(null);
    } else {
      // Try to move disk
      if (canMoveDisk(selectedTower, towerIndex)) {
        moveDisk(selectedTower, towerIndex);
      }
      setSelectedTower(null);
    }
  };

  const resetGame = () => {
    initializeGame(numDisks);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDiskWidth = (diskSize) => {
    const baseWidth = 40;
    const increment = 20;
    return baseWidth + (diskSize * increment);
  };

  const renderDisk = (diskSize, index) => {
    const width = getDiskWidth(diskSize);
    return (
      <div
        key={index}
        className={`h-6 rounded-lg border-2 ${DISK_COLORS[diskSize]} shadow-lg transition-all duration-200 hover:scale-105`}
        style={{ width: `${width}px` }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/20 to-transparent rounded-md"></div>
      </div>
    );
  };

  const renderTower = (towerIndex) => {
    const tower = towers[towerIndex];
    const isSelected = selectedTower === towerIndex;
    const canReceive = selectedTower !== null && selectedTower !== towerIndex && 
                      canMoveDisk(selectedTower, towerIndex);

    return (
      <div
        key={towerIndex}
        className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-105' : ''
        }`}
        onClick={() => handleTowerClick(towerIndex)}
      >
        {/* Tower label */}
        <div className="mb-2 text-lg font-bold text-gray-700 dark:text-gray-300">
          Tower {String.fromCharCode(65 + towerIndex)}
        </div>

        {/* Tower pole and base */}
        <div className="relative">
          {/* Base */}
          <div className={`w-48 h-4 bg-amber-800 rounded-lg border-2 border-amber-900 ${
            isSelected ? 'ring-4 ring-blue-500' : canReceive ? 'ring-4 ring-green-400' : ''
          }`}></div>
          
          {/* Pole */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-40 bg-amber-700 border border-amber-900 -top-40"></div>
          
          {/* Disks */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex flex-col-reverse items-center">
            {tower.map((diskSize, index) => renderDisk(diskSize, index))}
          </div>
        </div>

        {/* Tower status */}
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {tower.length} disk{tower.length !== 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  const getPerformanceRating = () => {
    if (moves === minMoves) return { text: 'Perfect!', color: 'text-green-600', icon: '🏆' };
    if (moves <= minMoves * 1.5) return { text: 'Excellent!', color: 'text-blue-600', icon: '⭐' };
    if (moves <= minMoves * 2) return { text: 'Good!', color: 'text-yellow-600', icon: '👍' };
    return { text: 'Try Again!', color: 'text-orange-600', icon: '🎯' };
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-green-600 bg-clip-text text-transparent mb-4">
            Tower of Hanoi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Move all disks to the rightmost tower following the rules!
          </p>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 dark:text-gray-300 font-medium">Disks:</label>
            <select
              value={numDisks}
              onChange={(e) => setNumDisks(parseInt(e.target.value))}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              disabled={gameStatus === 'won' && moves > 0}
            >
              {[3, 4, 5, 6, 7].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-lg">{formatTime(time)}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Target className="h-5 w-5 text-purple-500" />
            <span className="font-bold text-lg">{moves} moves</span>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Layers className="h-5 w-5 text-green-500" />
            <span className="font-bold text-lg">Min: {minMoves}</span>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus === 'won' && (
          <div className="text-center mb-8">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2 mb-4">
              <Trophy className="h-6 w-6" />
              <span>Congratulations! You Won!</span>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getPerformanceRating().color}`}>
                {getPerformanceRating().icon} {getPerformanceRating().text}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">
                Completed in {moves} moves • Time: {formatTime(time)}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {selectedTower !== null && gameStatus === 'playing' && (
          <div className="text-center mb-8">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium inline-block">
              Selected Tower {String.fromCharCode(65 + selectedTower)} - Click another tower to move the top disk
            </div>
          </div>
        )}

        {/* Game Area */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-b from-sky-100 to-green-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-end space-x-8">
              {towers.map((_, index) => renderTower(index))}
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="text-center">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-2xl">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">Game Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="space-y-2 text-left">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Objective:</h4>
                <ul className="space-y-1">
                  <li>• Move all disks from Tower A to Tower C</li>
                  <li>• Use Tower B as temporary storage</li>
                </ul>
              </div>
              <div className="space-y-2 text-left">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Rules:</h4>
                <ul className="space-y-1">
                  <li>• Only move one disk at a time</li>
                  <li>• Only move the top disk from a tower</li>
                  <li>• Never place a larger disk on a smaller one</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Minimum moves for {numDisks} disks: {minMoves} • Click towers to select and move disks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerOfHanoi;