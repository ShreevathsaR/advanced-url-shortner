# Custom URL Shortener API

Deployed app: https://advanced-url-shortner.onrender.com

This project implements a scalable URL shortener API with advanced analytics, user authentication via Google Sign-In, rate limiting, and topic-based grouping of URLs. It provides detailed insights into the performance of shortened URLs and allows users to create, track, and analyze their short links. The solution is dockerized for deployment on a cloud hosting service and designed with scalability in mind.

## Features

### User Authentication
- **Google Sign-In**: Utilizes `passport.js` for seamless user registration and login.

### Short URL Creation
- Users can create short URLs for long URLs with optional custom aliases and topic categorization.

### URL Redirection
- Redirects users from a short URL to the original long URL, with detailed analytics tracking.

### Analytics
- View total clicks, unique users, and detailed analytics by date, OS type, and device type.
- Topic-based analytics to track the performance of URLs grouped under specific topics (e.g., acquisition, retention).
- Overall analytics for all URLs created by the user.

### Rate Limiting
- Restricts the number of short URLs a user can create within a given timeframe.

### Caching
- Implemented caching with **Redis** for better performance and reduced database load.

### Dockerization
- The application is containerized for easy deployment and scalability.

### Cloud Deployment
- Deployed on a cloud hosting service using **Render**.

### Swagger Documentation
- Provides detailed API documentation for easy integration and understanding.

## API Endpoints

### 1. **POST /shorten**
Link: https://advanced-url-shortner.onrender.com/shorten

This is a secured route connect.sid (sessionId) has to be added as a value to the Cookie header for this call

- **Description**: Creates a shortened URL for a provided long URL.
- **Authentication**: Requires Google Sign-In (`isAuthenticated` middleware).
- **Rate Limiting**: Implemented to restrict the number of short URLs a user can create within a given timeframe (`urlCreationLimiter`).
- **Body Parameters**:
  - `longUrl` (required): The original long URL to shorten.
  - `alias` (optional): Custom alias for the short URL.
  - `topic` (optional): Topic to categorize the URL under (e.g., "acquisition", "retention").
  
### 2. **GET /:shortUrl**
Link: https://advanced-url-shortner.onrender.com/:shortUrl
- **Description**: Redirects the user to the original long URL using the short URL.
- **Parameters**: 
  - `shortUrl`: The short URL to redirect to the original URL.
  
### 3. **GET /analytics/:shortUrlId**
Link: https://advanced-url-shortner.onrender.com/analytics/:shortUrlId

This is a secured route connect.sid (sessionId) has to be added as a value to the Cookie header for this call

- **Description**: Retrieves detailed analytics for a specific short URL.
- **Parameters**:
  - `shortUrlId`: The ID of the shortened URL.
- **Analytics Data**: Provides insights such as total clicks, unique users, date-wise performance, OS type, and device type.

### 4. **GET /analytics/topic/:topic**
Link: https://advanced-url-shortner.onrender.com/topic/:topic

This is a secured route connect.sid (sessionId) has to be added as a value to the Cookie header for this call

- **Description**: Retrieves analytics for URLs grouped under a specific topic.
- **Parameters**:
  - `topic`: The topic name (e.g., "acquisition", "retention") for which analytics are to be fetched.
  
### 5. **GET /overall/analytics**
Link: https://advanced-url-shortner.onrender.com/overall/analytics

This is a secured route connect.sid (sessionId) has to be added as a value to the Cookie header for this call

- **Description**: Retrieves overall analytics for all URLs created by the authenticated user.
- **Authentication**: Requires Google Sign-In (`isAuthenticated` middleware).
- **Analytics Data**: Provides a summary of overall URL performance, including clicks, unique users, and other key metrics.
