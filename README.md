# E-Learning Backend API

This is a Node.js backend API built with Express.js, MongoDB, and other essential libraries. It provides the backend for managing authentication, courses, instructors, and students in an e-learning system.

## Table of Contents
- [Project Setup](#project-setup)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Development Tools](#development-tools)
- [Deployment](#deployment)


## Project Setup

### 1. Install Dependencies

To install all necessary dependencies for the project, run:

```bash
npm install
```

### 2. Environment Variables

Make sure to set up a `.env` file in the root directory with the following environment variables:

```env
# Server
PORT=
ENVIRONMENT_MODE=

# Database
USER=
PASSWORD=
DATABASE_NAME=
DATABASE_CONNECTION_STRING=

# JWT Tokens
JWT_ACCESS_SECRET_KEY=
JWT_REFRESH_SECRET_KEY=
JWT_RESET_PASSWORD_KEY=

# Email Configuration
USEREMAIL=
USERPASSWORD=
SERVICE=
HOST=
EMAILPORT=

WEBSITE_HOST=
```

### 3. Run the Server

To start the development server:

```bash
npm start
```

This command uses `nodemon` to restart the server automatically when changes are detected.

### 4. Linting

Run the linter to check for code quality:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint -- --fix
```

### 5. API Endpoints

The backend exposes a variety of endpoints under the `/api/v1` prefix. Here’s an overview:

- **Authentication**:
  - `POST /api/v1/auth/register`: Register a new user.
  - `POST /api/v1/auth/login`: Log in as a user.
  - `POST /api/v1/auth/logout`: Log out of the system.

- **Instructor Management**:
  - `GET /api/v1/instructors`: Get all instructors.
  - `POST /api/v1/instructors`: Add a new instructor.

- **Course Management**:
  - `GET /api/v1/courses`: Get all courses.
  - `POST /api/v1/courses`: Create a new course.
  - `GET /api/v1/courses/:id`: Get a course by ID.
  - `PUT /api/v1/courses/:id`: Update a course.
  - `DELETE /api/v1/courses/:id`: Delete a course.

- **Lesson Management**:
  - `POST /api/v1/lessons`: Add a lesson to a course.

- **Reviews**:
  - `POST /api/v1/reviewCourse`: Add a review for a course.
  - `POST /api/v1/reviewInstructor`: Add a review for an instructor.

- **Wishlist**:
  - `GET /api/v1/wishlist`: Get the user's wishlist.
  - `POST /api/v1/wishlist`: Add to wishlist.

- **Cart and Order Management**:
  - `GET /api/v1/cart`: View cart items.
  - `POST /api/v1/order`: Place an order.

### 6. Error Handling

The API uses centralized error handling, including handling common errors like `404` (not found) and custom errors via the `AppError` class. Middleware like `ErrorHandleMiddleware` is used to ensure consistent error responses.

### 7. Development Tools

This project leverages several important tools and libraries for development, including:

- `express-async-handler` for handling asynchronous operations.
- `express-validator` for input validation.
- `bcrypt` for password hashing.
- `jsonwebtoken` for managing JSON Web Tokens.
- `Mongoose` for MongoDB object modeling.
- `multer` for handling file uploads.
- `nodemailer` for sending emails.

### 8. Deployment

To deploy the app, make sure to:

- Set `NODE_ENV=production` in the environment.
- Use a process manager like `PM2` to run the app in production.
- Configure all environment variables for production (such as database connection strings, email settings, etc.).
- Consider deploying via cloud platforms such as Heroku, AWS, or DigitalOcean.

