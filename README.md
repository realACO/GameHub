
# 🎮 GameHub

**GameHub** is a full-stack web application built with FastAPI (backend) and React (frontend) that brings together a variety of classic browser games into a single interface.

---

## 📁 Project Structure

```
GameHub/
│
├── backend/                # FastAPI backend
│   ├── server.py           # Main server file
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment config
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Main frontend codebase
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts (e.g., theme)
│   │   ├── games/          # Game components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page-level components
│   │   └── App.js, index.js, etc.
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── craco.config.js     # Craco configuration
│   └── .env                # Frontend environment config
│
├── tests/                  # Test results or files
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

---

## 🕹️ Games Included

- ✅ Tic Tac Toe  
- ✅ Checkers  
- ✅ Chess  
- ✅ Minesweeper  
- ✅ Snake  
- ✅ Tower of Hanoi  
- ✅ Flappy Bird  
- ✅ 2048  
- ✅ Memory Matching  

---

## 💡 Features

- Built with **FastAPI** for a fast and modern Python backend.
- Uses **React** and **TailwindCSS** for a responsive, modern frontend.
- Includes **multiple classic games**, all under one UI.
- Uses **context and hooks** for state management and user experience.
- **Modular structure** for scalability and easy maintenance.

---

## ⚙️ Installation & Setup

## 🚀 Getting Started

                ### 🧰 Prerequisites

                - [Python 3.10+](https://www.python.org/)
                - [Node.js](https://nodejs.org/) and npm
                - [Git](https://git-scm.com/)

                ---

                ## 🔧 Backend Setup (FastAPI)

                1. **Navigate to the backend folder:**

                ```bash
                cd backend
                ```

                2. **Create and activate a virtual environment:**

                ```bash
                # Windows
                python -m venv venv
                venv\Scripts\activate

                # macOS/Linux
                python3 -m venv venv
                source venv/bin/activate
                ```

                3. **Install dependencies:**

                ```bash
                pip install -r requirements.txt
                ```

                > If `requirements.txt` is missing, install manually:
                > ```bash
                > pip install fastapi uvicorn
                > ```

                4. **Start the FastAPI server:**

                ```bash
                uvicorn server:app --reload
                ```

                - Server will be live at: `http://127.0.0.1:8000`
                - API Docs: `http://127.0.0.1:8000/docs`

                ---

                ## 🎨 Frontend Setup (React)

                1. **Navigate to the frontend folder:**

                ```bash
                cd ../frontend
                ```

                2. **Install dependencies:**

                ```bash
                npm install
                ```

                3. **Start the React development server:**

                ```bash
                npm start
                ```

                - The frontend will run at: `http://localhost:3000`

                ---

                ## 🔁 Connecting Frontend to Backend

                Make sure the React app sends requests to the correct backend URL.  
                Example in `App.jsx`:

                ```js
                fetch("http://127.0.0.1:8000/api/hello")
                ```

                ----

## 📦 Dependencies

### Backend

- Python 3.x
- FastAPI
- Uvicorn
- (See `requirements.txt`)

### Frontend

- React
- TailwindCSS
- Craco
- (See `package.json`)

---

## 🧪 Testing

- No formal testing suite is included yet.
- Placeholder directory `/tests` exists for future expansion.

---

## 🌐 Deployment

This project is currently optimized for **local development**. For production deployment, consider:

- Hosting the backend on platforms like **Render**, **Heroku**, or **AWS EC2**.
- Deploying the frontend using **Vercel**, **Netlify**, or **GitHub Pages**.
- Adding CI/CD and Docker support for streamlined deployment.

---

## 🤝 Contribution

Feel free to fork the repo, submit issues, or create PRs. All contributions are welcome to make GameHub even better.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
