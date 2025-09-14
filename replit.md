# Weather News App

## Overview

A mobile-first weather and news application that provides location-based weather information with intelligent news filtering. The app displays current weather conditions, 5-day forecasts, and curates news content based on weather conditions to create a contextual user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and builds
- **Styling**: Tailwind CSS with CSS variables for theming, supporting light/dark modes
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **State Management**: React Context for global state (settings, location) and TanStack React Query for server state
- **Mobile-First Design**: Bottom navigation pattern optimized for mobile devices with responsive layouts

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Structure**: RESTful endpoints for weather and news data
- **Data Validation**: Zod schemas for type-safe data validation across client and server
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with Vite middleware integration for seamless development experience

### Data Storage Solutions
- **Primary Storage**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage for user settings (MemStorage class)
- **Schema Management**: Shared TypeScript schemas between frontend and backend using Zod
- **Database Migrations**: Drizzle Kit for database schema migrations and management

### Authentication and Authorization
- **Session-Based**: Uses session cookies for user identification
- **Default User**: Currently implements a default user system for MVP functionality
- **Location Services**: Browser geolocation API with permission handling and fallback options

### Weather Intelligence System
- **Weather-Based News Filtering**: Intelligent content curation based on current weather conditions
  - Cold weather (< 50°F): Shows challenging/serious news
  - Hot weather (> 80°F): Shows cautionary/warning news  
  - Moderate weather: Shows positive/uplifting news
- **User Preferences**: Configurable filtering with ability to disable weather-based curation
- **Temperature Units**: Support for both Celsius and Fahrenheit with real-time conversion

## External Dependencies

### Weather Services
- **OpenWeatherMap API**: Provides current weather conditions and 5-day forecasts
- **Geolocation Services**: Browser native geolocation with coordinate-based weather lookup
- **Weather Icons**: Font Awesome icons mapped to OpenWeatherMap weather codes

### News Services  
- **NewsAPI**: Primary news content provider with category-based filtering
- **Content Categories**: Support for general, technology, health, sports, and entertainment news
- **Article Management**: Infinite scroll pagination with article deduplication

### UI and Styling
- **Radix UI**: Accessible headless UI components for complex interactions
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Font Awesome**: Icon library for weather conditions and navigation elements
- **Google Fonts**: Custom typography with Inter font family

### Development and Build Tools
- **Vite**: Fast build tool with TypeScript support and hot module replacement
- **ESBuild**: High-performance bundling for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **Replit Integration**: Development environment optimizations and error handling