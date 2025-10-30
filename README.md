🏦 Finsight — Modern Fintech Application

Finsight is a full-stack fintech platform designed to help users manage their finances with clarity, security, and insight. It provides a clean, modern dashboard where users can track transactions, monitor balances, visualize spending patterns, and securely manage their accounts — powered by a scalable backend and a responsive frontend.

🚀 Tech Stack

Backend (finsight-server)

Node.js + Express + TypeScript

MongoDB + Mongoose

JWT authentication with secure cookie storage

Repository and DTO design patterns for clean architecture

Cloudinary integration for image upload (user profiles, receipts)

Multer middleware for file handling

Dotenv for environment configuration

Frontend (finsight-client)

React + TypeScript + Vite

Tailwind CSS for modern UI design

Redux Toolkit for global state management

Axios for API communication

JWT persistence via cookies

Multi-page responsive layout

💡 Core Features

🔐 Authentication: Secure user registration, login, and JWT session management.

👤 Profile Management: Upload and manage user profile images using Cloudinary.

💸 Transactions: Record deposits, withdrawals, and track transaction history.

📊 Dashboard Analytics: Visual insights into income and expenses.

🧩 Admin Role: Administrative access to user and transaction management.

☁️ Scalable Architecture: Repository pattern ensures maintainability and easy expansion.

🧱 Project Structure
finsight/
│
├── finsight-server/     # Backend API (Node + Express + TypeScript)
│   ├── src/
│   ├── .env
│   ├── package.json
│
├── finsight-client/     # Frontend UI (React + Vite + Tailwind)
│   ├── src/
│   ├── index.html
│   ├── package.json
│
└── README.md

⚙️ Setup

Backend

cd finsight-server
npm install
npm run dev


Frontend

cd finsight-client
npm install
npm run dev

🧠 Vision

Finsight is built as a career-ready full-stack portfolio project, showcasing industry best practices like modular architecture, state management, authentication, file uploads, and modern UI design — a perfect demonstration of full-stack proficiency.
