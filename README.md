# Custom URL Shortener API

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
