# a-friggin-weather-app

This is a simple JavaScript + React weather application for Metro Manila (NCR) cities that fetches data directly from the Weather API.

I made this originally using Chef by Convex 'cause I really wanted to have a direct source of Weather in NCR.

## Prerequisites

1. Node.js (version 18 or higher)
2. npm or yarn
3. A Weather API key from weatherapi.com

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_WEATHER_API_KEY=your_weather_api_key
```

### 3. Get Weather API Key
1. Go to https://weatherapi.com
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### 4. Run the Application
```bash
npm run dev
```

This will start the development server on http://localhost:5173

## Features

- Real-time weather data for all NCR cities
- Current weather conditions with air quality
- 5-day weather forecast
- Weather alerts
- Responsive design with Tailwind CSS
- Local storage caching (10 minutes)
- No backend required - direct API calls

## Tech Stack

- **Frontend**: React (JavaScript), Vite, Tailwind CSS
- **Styling**: Tailwind CSS with custom components
- **Weather Data**: Weather API (weatherapi.com)
- **Caching**: Browser localStorage

## Converted from TypeScript

This app was originally built with TypeScript and Convex backend but has been completely refactored to use:
- Pure JavaScript instead of TypeScript
- Direct API calls instead of Convex backend
- localStorage caching instead of database caching

