# 🎮 GameHub

GameHub is a React-based browser game collection with a single UI and multiple classic games.

## 🚀 Tech Stack

- React 19
- React Router
- Tailwind CSS
- CRACO
- Lucide React

## 🕹️ Games Included

- Tic-Tac-Toe
- Checkers
- Chess
- Minesweeper
- Snake
- Flappy Bird
- 2048
- Memory Matching
- Tower of Hanoi

## 📁 Project Structure

```text
GameHub/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── games/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   └── package.json
├── api/
├── tests/
├── package.json
└── README.md
```

## ✅ Prerequisites

- Node.js 18+
- npm

## ⚙️ Setup

From the project root:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix frontend install
```

## 🧪 Scripts

Run from project root:

- Start dev server:

  ```bash
  npm start
  ```

- Build frontend:

  ```bash
  npm run build
  ```

- Run tests:

  ```bash
  npm test
  ```

## 🎮 Controls (Current)

- Snake: `W/A/S/D` to move, `Enter` to start
- Flappy Bird: `W` or click to jump/start
- 2048: Arrow keys
- Other games: Mouse-driven controls

## 🧠 Notes

- The project is currently frontend-focused.
- Keyboard handlers include default-scroll prevention for gameplay keys where needed.

## 🌐 Deployment

This app can be deployed as a static frontend build (for example on Vercel, Netlify, or GitHub Pages).

## 🤝 Contributing

Contributions are welcome through issues and pull requests.

## 📜 License

MIT (or your preferred license if you add one in this repository).
