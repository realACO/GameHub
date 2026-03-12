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

### Vercel (Recommended)

This repository includes a root `vercel.json` configured for the current project layout:

- Install command: `npm --prefix frontend install`
- Build command: `npm run build`
- Output directory: `frontend/build`
- SPA rewrite to `index.html` for React Router routes

#### Deploy from Vercel Dashboard

1. Push your latest code to GitHub.
2. In Vercel, click **Add New Project** and import this repository.
3. Keep the project root as repository root (do not set `frontend` as root).
4. Vercel should automatically use values from `vercel.json`.
5. Click **Deploy**.

#### Deploy with Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

#### If you still see `craco: command not found`

- Ensure **Install Command** is not set to `npm start`.
- Use `npm --prefix frontend install` as install command.
- Re-run deployment after updating project settings.

## 🤝 Contributing

Contributions are welcome through issues and pull requests.

## 📜 License

MIT (or your preferred license if you add one in this repository).
