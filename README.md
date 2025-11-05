# 🖌️ Real-Time Collaborative Drawing Canvas

## 📋 Project Overview

A multi-user drawing application where multiple users can draw simultaneously on a shared canvas in real-time.

This project demonstrates **real-time synchronization**, **vanilla JavaScript Canvas drawing**, and **WebSocket communication** using **Socket.io**.

---

## 🚀 Features

### 🎨 Frontend

* Brush tool with adjustable size
* Color picker
* Eraser tool
* Real-time synchronization across users
* Clear canvas (global)
* Responsive, modern UI

### ⚙️ Backend

* Node.js with Express.js
* Real-time communication with Socket.io
* Broadcast-based event handling for draw, clear, and sync

---

## 🧠 Architecture

### **Frontend → Backend → Other Clients**

```text
User Action (mouse move/draw)
       ↓
Socket.emit('draw', { x, y, color, type })
       ↓
Server receives event and broadcasts to all other clients
       ↓
Each client updates its canvas in real time
```

### **Data Flow Diagram**

```
┌───────────────┐        draw event         ┌───────────────┐
│   Client A    │ ───────────────────────▶ │    Server     │
└───────────────┘                          └───────────────┘
        ▲                                           │
        │                                           ▼
┌───────────────┐        broadcast event     ┌───────────────┐
│   Client B    │ ◀──────────────────────── │   All Users   │
└───────────────┘                           └───────────────┘
```

---

## 🧩 Undo/Redo Strategy (Planned)

Each draw operation will be stored as a stroke object in a stack:

```js
{ type: 'draw', color: '#000', width: 4, path: [ {x, y}, ... ] }
```

* Undo: Pop last stroke and redraw all remaining
* Redo: Push back last removed stroke
* Broadcast undo/redo to all users to maintain global consistency

---

## 🧠 Conflict Resolution

* Each stroke is treated as an atomic operation.
* New users joining receive the latest canvas state.
* Simultaneous draws are simply layered on top (non-blocking approach).

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ag1514/Real-time-Collaborative-Drawing-Canvas.git
cd Real-time-Collaborative-Drawing-Canvas
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the server

```bash
npm start
```

### 4️⃣ Open the app

Visit **[http://localhost:3000](http://localhost:3000)** in multiple browsers or tabs to test real-time sync.

---

## 🧪 Testing Multi-User Drawing

1. Open the app in two different browsers (e.g., Chrome and Edge)
2. Draw on one canvas — strokes should appear live on the other
3. Try color changes, eraser, and clear actions

---

## 🐞 Known Limitations

* Undo/Redo not yet implemented
* No user cursor indicators
* Canvas state not persistent on refresh
* Basic eraser (acts as white brush)

---

## ⏰ Time Spent

| Phase             | Feature                             | Time         |
| ----------------- | ----------------------------------- | ------------ |
| Phase 1           | Canvas setup and local drawing      | 2 hrs        |
| Phase 2           | Real-time synchronization           | 3 hrs        |
| Phase 3           | UI improvements, color/eraser tools | 2 hrs        |
| Phase 4 (planned) | Undo/Redo, user cursors             | 3 hrs (est.) |

---

## 🧑‍💻 Author

**Ansh Goyal**
Built using Vanilla JS, Node.js, and Socket.io ✨
