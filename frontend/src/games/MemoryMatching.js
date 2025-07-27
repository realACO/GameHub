import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, Clock, Brain, Star, Heart, Zap, Sun, Moon, Flower } from 'lucide-react';

const GRID_SIZE = 4;
const CARD_COUNT = (GRID_SIZE * GRID_SIZE) / 2;

const cardIcons = [
  { icon: Star, color: 'text-yellow-500' },
  { icon: Heart, color: 'text-red-500' },
  { icon: Zap, color: 'text-blue-500' },
  { icon: Sun, color: 'text-orange-500' },
  { icon: Moon, color: 'text-purple-500' },
  { icon: Flower, color: 'text-pink-500' },
  { icon: Brain, color: 'text-green-500' },
  { icon: Trophy, color: 'text-indigo-500' },
];

const MemoryMatching = () => {
  const [board, setBoard] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameStatus, setGameStatus] = useState('ready'); // ready, playing, won

  const generateBoard = useCallback(() => {
    const cards = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const iconData = cardIcons[i];
      cards.push(
        { id: i * 2, iconData, matched: false },
        { id: i * 2 + 1, iconData, matched: false }
      );
    }
    
    // Shuffle the cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
  }, []);

  const resetGame = () => {
    setBoard(generateBoard());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsActive(false);
    setGameStatus('ready');
  };

  useEffect(() => {
    resetGame();
  }, [generateBoard]);

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

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      
      if (board[first].iconData === board[second].iconData) {
        // Match found
        setMatchedCards(prev => [...prev, first, second]);
        setFlippedCards([]);
        
        // Check if game is won
        if (matchedCards.length + 2 === board.length) {
          setGameStatus('won');
          setIsActive(false);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
      
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, board, matchedCards.length]);

  const handleCardClick = (index) => {
    if (
      gameStatus === 'won' ||
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    if (gameStatus === 'ready') {
      setGameStatus('playing');
      setIsActive(true);
    }

    setFlippedCards(prev => [...prev, index]);
  };

  const isCardFlipped = (index) => {
    return flippedCards.includes(index) || matchedCards.includes(index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCardClassName = (index) => {
    let baseClass = "w-20 h-20 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ";
    
    if (isCardFlipped(index)) {
      if (matchedCards.includes(index)) {
        baseClass += "bg-green-100 dark:bg-green-800 border-green-500 ";
      } else {
        baseClass += "bg-blue-100 dark:bg-blue-800 border-blue-500 ";
      }
    } else {
      baseClass += "bg-gradient-to-br from-purple-400 to-pink-400 border-purple-500 hover:from-purple-500 hover:to-pink-500 ";
    }
    
    return baseClass;
  };

  const renderCard = (index) => {
    const card = board[index];
    const IconComponent = card?.iconData?.icon;
    const isFlipped = isCardFlipped(index);

    return (
      <button
        key={index}
        className={getCardClassName(index)}
        onClick={() => handleCardClick(index)}
        disabled={gameStatus === 'won'}
      >
        {isFlipped && IconComponent ? (
          <IconComponent className={`h-8 w-8 ${card.iconData.color}`} />
        ) : (
          <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
            Memory Matching
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find all matching pairs of cards!
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-lg">{formatTime(time)}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <Brain className="h-5 w-5 text-purple-500" />
            <span className="font-bold text-lg">Moves: {moves}</span>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </button>
        </div>

        {/* Game Status */}
        {gameStatus === 'ready' && (
          <div className="text-center mb-8">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-block">
              Click any card to start!
            </div>
          </div>
        )}

        {gameStatus === 'won' && (
          <div className="text-center mb-8">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg inline-flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>Congratulations! Time: {formatTime(time)}, Moves: {moves}</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(matchedCards.length / board.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            {matchedCards.length / 2} / {CARD_COUNT} pairs found
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-4 gap-3">
              {board.map((_, index) => renderCard(index))}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center">
          <div className="inline-block bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md">
            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-200">How to Play</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
              <li>• Click on cards to flip them over</li>
              <li>• Find two cards with matching icons</li>
              <li>• Matched pairs will stay face up</li>
              <li>• Match all pairs to win the game</li>
              <li>• Try to complete it in fewer moves!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatching;