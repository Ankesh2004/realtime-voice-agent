# 🎙️ Real-Time Voice Agent  

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)](https://nodejs.org/)  
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime-orange?logo=openai)](https://platform.openai.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

A **React + OpenAI Realtime Agents** demo that enables live conversational AI sessions using ephemeral tokens.  
The app provides a **start/stop session** interface, status indicators, and manages connection lifecycles seamlessly.  

---

## ✨ Features  

- ✅ Real-time AI voice sessions with OpenAI’s `@openai/agents/realtime`  
- ✅ Secure ephemeral token fetching via backend (`server/server.js`)  
- ✅ Graceful session cleanup on reconnect/unmount  
- ✅ Simple UI with **status indicator** + **connect button**  
- ✅ Fully customizable assistant instructions  

---

## 📂 Project Structure  

```
.
├── client/               # Frontend (React)
│   ├── App.jsx           # React app with realtime session handling
│   ├── App.css           # Styling
│   └── ...
├── server/               # Backend (Express)
│   └── server.js         # API endpoint for ephemeral token
├── package.json
└── README.md             # You are here
```

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/realtime-voice-agent.git
cd realtime-voice-agent
```

### 2️⃣ Install Dependencies  
For both **client** and **server**:  
```bash
cd client && npm install
cd ../server && npm install
```

### 3️⃣ Setup Environment Variables  
In `server/.env`, add your **OpenAI API key**:  
```env
OPENAI_API_KEY=sk-xxxxxx
```

### 4️⃣ Start the Backend  
```bash
cd server
npm start
```

### 5️⃣ Start the Frontend  
```bash
cd client
npm start
```

The app will be available at:  
👉 [http://localhost:3000](http://localhost:3000)  

---

## 🛠️ How It Works  

1. **Frontend (`client/App.jsx`)**  
   - Requests an **ephemeral token** from the backend.  
   - Creates a `RealtimeAgent` with concise, helpful instructions.  
   - Spins up a `RealtimeSession` using `gpt-4o-mini-realtime-preview`.  
   - Manages connection, error handling, and cleanup gracefully.  

2. **Backend (`server/server.js`)**  
   - Hosts an API endpoint: `/api/get-token`.  
   - Fetches **ephemeral keys** from OpenAI using your permanent API key.  
   - Returns the token to the frontend securely.  

---

## ⚡ Tech Stack  

- **Frontend**: React, CSS  
- **Backend**: Node.js, Express  
- **AI**: OpenAI Realtime API (`gpt-4o-mini-realtime-preview`)  

---

## 🧩 Possible Improvements  

- Voice Activity Visualizer
- Display live transcripts in the UI.  
- Support multiple models (selection option) (`gpt-4o-realtime`, `whisper-realtime`).  
- Save custom agents and just select one of them before starting the convo
- Let user use their own api key
---

## 🤝 Contributing  

Pull requests are welcome!  
For major changes, please open an issue first to discuss what you’d like to improve.  

---

## 📜 License  

This project is licensed under the **MIT License**.  
