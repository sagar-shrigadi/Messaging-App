# Messaging-App

A full-stack messaging app built with Node, Express, Postgres and Socket.io for real time messaging.
This repository is the backend for the project and serves as documentation for the REST API.

## 🔗 Links

- Live site can be found [here](https://messaging-client.pages.dev/).
- The frontend repo for this, can be found [here](https://github.com/sagar-shrigadi/Messaging-App-Client)

## 🚀 Features

- Global and private User-to-User chats using socket.io rooms to ensure messages are isolated in their specified contexts.
- Authentication via JWTs
- CRUD operations for messages and users

## ⚙️ Setup Instructions

### Prerequisite

Ensure you have Node.js and a PostgreSQL instance running.

### 1. Clone the repository

```bash
git clone git@github.com:sagar-shrigadi/Messaging-App.git
cd Messaging-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

- Create a .env file in the root directory. Copy all the variables from .env.example and fill in your values:
- When using a local instance of postgres ensure both of the following are the same!
- When using a cloud based db, enter the connection strings as in .env.example file.

```env
DATABASE_URL
```

and

```env
DIRECT_URL
```

### 4. Database Migrations

Run Prisma migrations to create database tables and generate the client.

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Server

```bash
npm start
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account.
- `POST /api/auth/login` - Login

### Global Chat

- `GET /api/chats/global` - Fetch all messages from global chat.
- `POST /api/chats/global` - Post a new message to global chat. (Protected)

### Private Chat (User-to-User)

- `GET /api/chats/users/:toUserId` - Fetch all messages between a specified user. (Protected)
- `POST /api/chats/users/:toUserId` - Post a new message to a specified user. (Protected)

### Messages

- `PATCH /api/messages/:messageId` - Update a message (Protected).
- `DELETE /api/messages/:messageId` - Delete a comment (Protected).

### User

- `GET /api/users` - Fetch all Users.
- `GET /api/users/me` - Fetch a specific user (Protected).
- `PATCH /api/users/me` - Update the user bio (Protected).
