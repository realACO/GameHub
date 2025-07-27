import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bomb, 
  Zap, 
  Grid3x3, 
  X, 
  Brain, 
  Crown, 
  CircleDot,
  Bird,
  Layers
} from 'lucide-react';

const games = [
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic puzzle game with hidden mines',
    icon: Bomb,
    path: '/minesweeper',
    gradient: 'from-red-500 to-orange-500',
    bgImage: 'https://images.unsplash.com/flagged/photo-1580234759288-fbf3ccdd9a06?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxnYW1pbmd8ZW58MHx8fHB1cnBsZXwxNzUzMzkzMTU4fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Eat apples and grow longer!',
    icon: Zap,
    path: '/snake',
    gradient: 'from-green-500 to-lime-500',
    bgImage: 'https://images.unsplash.com/flagged/photo-1580234748052-2c23d8b27a71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxnYW1pbmd8ZW58MHx8fHB1cnBsZXwxNzUzMzkzMTU4fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: '2048',
    name: '2048',
    description: 'Combine tiles to reach 2048',
    icon: Grid3x3,
    path: '/2048',
    gradient: 'from-yellow-400 to-amber-500',
    bgImage: 'https://images.unsplash.com/photo-1550340733-4c0bdcfe1187?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxnYW1pbmd8ZW58MHx8fHB1cnBsZXwxNzUzMzkzMTU4fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic 3x3 strategy game',
    icon: X,
    path: '/tic-tac-toe',
    gradient: 'from-pink-500 to-rose-500',
    bgImage: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'memory',
    name: 'Memory Matching',
    description: 'Find matching pairs of cards',
    icon: Brain,
    path: '/memory',
    gradient: 'from-emerald-500 to-teal-600',
    bgImage: 'https://images.unsplash.com/photo-1498940757830-82f7813bf178?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'chess',
    name: 'Chess',
    description: 'The ultimate strategy game',
    icon: Crown,
    path: '/chess',
    gradient: 'from-slate-600 to-gray-800',
    bgImage: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'checkers',
    name: 'Checkers',
    description: 'Classic board game strategy',
    icon: CircleDot,
    path: '/checkers',
    gradient: 'from-orange-500 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Fly through pipes without crashing',
    icon: Bird,
    path: '/flappy-bird',
    gradient: 'from-cyan-400 to-emerald-500',
    bgImage: 'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    description: 'Move disks between pegs under rules',
    icon: Layers,
    path: '/tower-of-hanoi',
    gradient: 'from-amber-500 to-orange-600',
    bgImage: 'https://images.unsplash.com/photo-1498940757830-82f7813bf178?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxjb2xvcmZ1bHxlbnwwfHx8fDE3NTMzOTMxNjR8MA&ixlib=rb-4.1.0&q=85'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 animate-pulse">
            GameHub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A collection of timeless games — play, relax, and compete. All in your browser, no fuss.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {games.map((game, index) => {
            const IconComponent = game.icon;
            return (
              <Link
                key={game.id}
                to={game.path}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.bgImage})` }}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative p-8 h-64 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:bg-white/30 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                      {game.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 -left-4 w-6 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-pulse"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            Built with ❤️ for game enthusiasts everywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;