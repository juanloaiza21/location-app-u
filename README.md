# Location Tracking Application

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red)
![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue)
![Expo](https://img.shields.io/badge/Expo-53.0.12-white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

A full-stack mobile application designed to track the real-time location of users with geofencing capabilities. Built with NestJS backend and React Native (Expo) frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Mobile Application](#mobile-application)
- [Geofencing Features](#geofencing-features)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🔭 Overview

This application allows users to track the location of individuals in real-time and set up geofence alerts. It consists of a NestJS backend with PostgreSQL database and a React Native/Expo frontend, providing a comprehensive solution for location tracking and monitoring.

## ✨ Features

- **User Management**: Registration, authentication, and profile management
- **Real-time Location Tracking**: Track user locations with high accuracy
- **Geofencing**: Create virtual geographical boundaries
- **Notifications**: Receive alerts when users enter or exit geofence areas
- **Telegram Integration**: Notifications via Telegram bot
- **Mobile-friendly UI**: Intuitive mobile interface with maps
- **Secure Authentication**: JWT-based authentication system
- **Location History**: View historical location data with timestamps

## 🏗️ Project Structure

The project is divided into two main components:

```
location-app-u/
├── backend/     # NestJS TypeScript API
│   ├── src/
│   │   ├── prisma/    # Database schema and migrations
│   │   ├── auth/      # Authentication module
│   │   ├── users/     # User management
│   │   ├── location/  # Location tracking
│   │   └── geofence/  # Geofencing functionality
│   └── ...
└── frontend/    # React Native/Expo mobile app
    ├── screens/       # Application screens
    ├── components/    # Reusable UI components
    ├── navigation/    # Navigation configuration
    ├── services/      # API and location services
    └── ...
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or later)
- npm (v6.x or later) or yarn
- PostgreSQL database
- Expo CLI (`npm install -g expo-cli`)
- Git

## 📥 Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/juanloaiza21/location-app-u.git
cd location-app-u
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/location_app_db?schema=public"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

4. Set up the database and run migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (or configure through app.config.js for Expo):

```
API_URL=http://your-backend-url:3000
```

4. Start the Expo development server:

```bash
npm start
```

5. Run on a specific platform:

```bash
# For Android
npm run android

# For iOS
npm run ios

# For web
npm run web
```

## 💾 Database Schema

The application uses PostgreSQL with Prisma ORM. The main models are:

### User
- Personal information (name, email, phone)
- Authentication details
- Linked to locations and geofences

### Location
- Geographic coordinates (latitude, longitude)
- Accuracy information
- Device metadata
- Timestamp

### Geofence
- Named geographic boundaries
- Center coordinates and radius
- Active/inactive status
- Associated with specific users

### GeofenceAlert
- Links locations, users, and geofences
- Records entry/exit events
- Contains timestamps for auditing

## 📱 Mobile Application

The mobile app is built with React Native and Expo, providing features:

### Navigation
- Drawer navigation for main sections
- Stack navigation for detailed screens

### Maps Integration
- Real-time location display
- Geofence visualization
- Route tracking

### Authentication
- Secure login/registration
- Token-based session management
- AsyncStorage for persistence

### UI Components
- Custom toast notifications
- Animations with Lottie
- SwipeListView for interactive lists

## 🌐 Geofencing Features

The geofencing system allows:

1. **Creating Boundaries**: Define circular regions with center point and radius
2. **Real-time Monitoring**: Track when users enter or exit defined zones
3. **Alerting**: Receive immediate notifications of boundary events
4. **Historical Analysis**: Review past geofence violations or entries

## 🔐 Environment Variables

### Backend Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time
- `TELEGRAM_BOT_TOKEN`: API token for Telegram notifications

### Frontend Variables
- `API_URL`: Backend API endpoint

## 👨‍💻 Development Guidelines

### Backend Development
- Use NestJS modules structure
- Follow TypeScript best practices
- Write unit tests with Jest
- Document API endpoints

### Frontend Development
- Utilize React hooks for state management
- Implement responsive design for different devices
- Handle permissions gracefully (location, notifications)
- Cache data for offline capabilities

## 🔧 Troubleshooting

### Common Backend Issues
- Database connection errors: Check PostgreSQL service and connection string
- JWT authentication issues: Verify secret key and token expiration
- Prisma schema sync problems: Run `prisma generate` after schema changes

### Common Frontend Issues
- Location permission denied: Prompt users to enable in device settings
- Map rendering issues: Check API keys and component props
- Authentication errors: Verify backend connectivity and token storage

## 📄 License

This project is licensed under the UNLICENSED license as specified in the package.json.

---

Created by [Juan Loaiza](https://github.com/juanloaiza21)
