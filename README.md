# Expert Session Booking System

## Setup Instructions

### Backend
1. `cd server`
2. Update `.env` with your MongoDB URI
3. `npm run seed` - to populate sample experts
4. `npm run dev` - start backend on port 5000

### Frontend
1. `cd client`
2. `npm start` - start Expo app
3. Use Expo Go app to run on phone or run `npm run android/ios/web`

## Features
- Expert listing with search, filter, pagination
- Real-time slot updates via Socket.io
- Booking form with validation
- My bookings view by email
- Prevents double booking with DB unique index
