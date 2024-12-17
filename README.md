# Secure File Management Backend

This project provides a secure backend for user authentication and multimedia file management using Node.js, Express, and MongoDB.

## Features
- Secure user authentication with JWT.
- Multimedia file upload with type and size restrictions.
- File sharing between users.
- Rate limiting to prevent abuse.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS
- **Validation**: express-validator

## Installation

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    - Rename `.env.example` to `.env`.
    - Update the following:
        ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/your_database_name
        JWT_SECRET=your_secret_key
        ```

4. Start the server:
    ```bash
    npm run dev
    ```

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login to get a JWT token.

### File Management
- **POST** `/api/files/upload`: Upload files (Authenticated).
- **GET** `/api/files/my-files`: Retrieve user's files (Authenticated, paginated).
- **DELETE** `/api/files/delete/:id`: Delete a file by ID (Authenticated).
- **POST** `/api/files/share`: Share a file with another user (Authenticated).
- **GET** `/api/files/shared-with-me`: Retrieve files shared with the user (Authenticated, paginated).
- **POST** `/api/files/generate-link/:fileId`: Generate a public link for a file (Authenticated).
- **GET** `/api/files/public/:token`: Access a file via its public link.


### Testing
- **GET** `/api/test/protected`: Test a protected route (Authenticated).

## Scripts
- `npm run start`: Start the server in production mode.
- `npm run dev`: Start the server in development mode with hot-reloading.

## Future Enhancements
- Add cloud storage support for file uploads.
- Implement unit and integration tests.
- Enhance error logging and monitoring.
