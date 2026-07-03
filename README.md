# 🤖 SecretEcho

> A real-time AI companion messaging application built with Next.js, Express.js, MongoDB, Socket.io, and Google Gemini.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)

---

## ✨ Features

- 🔐 JWT Authentication
- 💬 Real-time messaging with Socket.io
- 🤖 Google Gemini AI integration
- 🎤 Voice input (Chrome & Edge)
- 🔊 Voice output
- 💾 Persistent chat history
- 🐳 Docker support
- ✅ 16 Integration Tests

---

## 📸 Screenshots

> Add screenshots here.

| Login | Chat |
|-------|------|
| ![](docs/login.png) | ![](docs/chat.png) |

---

## 🏗️ Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Socket.io Client
- Axios
- Web Speech API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Socket.io
- Google Gemini

---

## 📂 Project Structure

```text
secretecho/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/secretecho.git
cd secretecho
```

### Environment Variables

```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
```

---

## 🐳 Run with Docker

```bash
docker compose up --build
```

Application:

```
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

---

## 💻 Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/messages` | Send Message |
| GET | `/api/messages` | Chat History |

---

## 🔌 Socket Events

| Event | Description |
|--------|-------------|
| new_message | Receive new messages |
| connect_error | Invalid authentication |

---

## 🧠 Architecture

```text
Client
   │
Axios + Socket.io
   │
Express.js
   │
───────────────
│ Auth Service │
│ AI Service   │
│ Message      │
───────────────
   │
MongoDB Atlas
   │
Google Gemini
```

---

## 🧪 Testing

```bash
cd backend
npm test
```

**Tests include**

- Authentication
- JWT Validation
- Message Sending
- Chat History
- User Isolation
- Empty Message Validation

---

## 🔒 Security

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Request Validation

---

## ⚠️ Known Limitations

- JWT stored in localStorage
- Single conversation per user
- In-memory AI context
- No refresh tokens
- Gemini API rate limits

---

## 📈 Future Improvements

- Multiple Conversations
- File Uploads
- Image Generation
- Typing Indicators
- Online Status
- Read Receipts
- Refresh Tokens
- Redis Cache
- BullMQ Queue

---

## 👨‍💻 Author

**Dinesh Singh**

Computer Science Graduate | AI & Full Stack Developer

LinkedIn: YOUR_LINKEDIN

GitHub: https://github.com/YOUR_USERNAME

---

