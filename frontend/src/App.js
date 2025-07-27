import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Minesweeper from "./games/Minesweeper";
import Snake from "./games/Snake";
import Game2048 from "./games/Game2048";
import TicTacToe from "./games/TicTacToe";
import MemoryMatching from "./games/MemoryMatching";
import Chess from "./games/Chess";
import Checkers from "./games/Checkers";
import FlappyBird from "./games/FlappyBird";
import TowerOfHanoi from "./games/TowerOfHanoi";

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 dark:from-gray-900 dark:via-orange-900 dark:to-red-900 transition-all duration-300">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/minesweeper" element={<Minesweeper />} />
            <Route path="/snake" element={<Snake />} />
            <Route path="/2048" element={<Game2048 />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/memory" element={<MemoryMatching />} />
            <Route path="/chess" element={<Chess />} />
            <Route path="/checkers" element={<Checkers />} />
            <Route path="/flappy-bird" element={<FlappyBird />} />
            <Route path="/tower-of-hanoi" element={<TowerOfHanoi />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;