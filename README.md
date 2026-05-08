# Expert Session Booking System

A real-time expert session booking system built with React Native (Expo) + Node.js/Express + MongoDB.

https://github.com/user-attachments/assets/019528e5-77e7-4e59-8dfd-9699cfe079f4

## Architecture

- **Backend:** Node.js + Express + Mongoose + Socket.io
- **Frontend:** Expo React Native (TypeScript) with state-based navigation
- **Database:** MongoDB (Atlas or local)

## Setup Instructions

### Backend

```bash
cd server
cp .env.example .env   # if exists, otherwise create .env
```

Edit `server/.env`:

| Variable     | Atlas (default)                                                          | Local                                 |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------- |
| `MONGO_URI`  | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/expert-booking`      | `mongodb://localhost:27017/expert-booking` |
| `PORT`       | `5000`                                                                   | `5000`                                |
| `CLIENT_URL` | `http://localhost:8081` (Expo dev) or your deployed frontend URL         | same                                  |

Then:

```bash

npm install
npm run seed      # populate 3 sample experts
npm run dev       # start backend on port 5000
```

### Frontend

```bash
cd client
cp .env.example .env   # if exists, otherwise create .env
```

Set `EXPO_PUBLIC_API_URL` in `client/.env` to your backend URL (default: `http://192.168.1.11:5000`).

```bash
npm install
npm start              # start Expo dev server
```

Scan QR code with Expo Go, or run `npm run android` / `npm run ios` / `npm run web`.

## Features

- Expert listing with search, filter (by category), and pagination
- Expert detail view with available time slots
- Booking form with name, email, phone, notes
- Automatic device ID generation on first launch — tracks bookings without requiring email login
- My Bookings screen auto-loads the current device's bookings
- Refresh button to fetch latest bookings
- Real-time slot availability updates via Socket.io (`slot-booked` event)
- Double booking prevention via MongoDB unique compound index (`{ expertId, date, timeSlot }`)
- Booking status management (pending → confirmed → completed)

## Deployment

### Render (Backend)

A `render.yaml` is included. The server auto-deploys with:

- Root directory: `server`
- Build: `npm install && npm run build`
- Start: `npm start`

After deployment, update `EXPO_PUBLIC_API_URL` in the client to `https://<your-service>.onrender.com`.

## API Endpoints

Base URL: `http://<host>:5000`

### REST

| Method | Endpoint | Query / Body | Description |
|--------|----------|--------------|-------------|
| `GET` | `/experts` | `?page=1&search=&category=` | List experts (paginated, searchable, filterable) |
| `GET` | `/experts/:id` | — | Get expert details with available/booked slots |
| `POST` | `/bookings` | `{ expertId, userId, userName, email, phone, date, timeSlot, notes }` | Create a booking |
| `PATCH` | `/bookings/:id/status` | `{ status }` | Update booking status |
| `GET` | `/bookings` | `?userId=xxx` or `?email=xxx` | Get bookings by device ID or email |

### Socket.io

| Event | Direction | Payload | Trigger |
|-------|-----------|---------|---------|
| `slot-booked` | server → client | `{ expertId, date, timeSlot }` | Emitted when a booking is created |

## Project Structure

```
server/
  src/
    models/Expert.ts         # Mongoose schema (name, category, slots, etc.)
    models/Booking.ts        # Mongoose schema (expertId, userId, date, timeSlot, etc.)
    controllers/             # expertController, bookingController
    routes/                  # Express route definitions
    utils/db.ts              # Mongoose connection
    server.ts                # Express + Socket.io entry point
    seed.ts                  # Sample data seeder

client/
  src/
    screens/                 # ExpertsScreen, ExpertDetailScreen, BookingScreen, MyBookingsScreen
    services/api.ts          # Axios API client
    services/socket.ts       # Socket.io client
    utils/deviceId.ts        # Device ID generation & persistence
    types/index.ts           # TypeScript interfaces
  App.tsx                    # Root component with state-based navigation
```
