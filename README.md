Here’s a structured breakdown of your `package.json`, server setup, routes, and a draft for the README file:

### 1. `package.json`

Your current `package.json` file looks well-structured, with both dependencies and dev dependencies clearly defined. You’re using tools for code formatting (`prettier`, `eslint`), and important libraries for your backend like `express`, `mongoose`, and `dotenv`.

### 2. App Setup (from `app.js`)

You've created an Express-based Node.js backend that sets up middleware for logging (`morgan`), CORS, request compression, cookie parsing, and static files. The code also includes routing for various services and error handling, with graceful shutdown on unhandled rejections.

### 3. Routes

You're grouping routes under an `amountRoutes` function that registers various RESTful API endpoints. Each route appears to be organized around resources like authentication, instructors, courses, lessons, reviews, etc.

### 4. Draft of `README.md`

Here's a sample `README.md` file that you can use for your project:

---

# Backend API

This is a Node.js backend API built with Express.js, MongoDB, and several other essential libraries. The project is structured to provide a scalable backend for managing authentication, courses, instructors, and more.

## Project Setup

### 1. Install Dependencies

Make sure to install the required dependencies for both development and production:

```bash
npm install
```

### 2. Environment Variables

Set up your environment variables in a `.env` file in the root directory. The following variables should be included:

```env
# server
PORT =
ENVIRONMENT_MODE=


# database
USER =
PASSWORD =
DATABASE_NAME =
DATABASE_CONNECTION_STRING  =

# token
JWT_ACCESS_SECRET_KEY =
JWT_REFRESH_SECRET_KEY =
JWT_RESET_PASSWORD_KEY =


# email config
USEREMAIL  =
USERPASSWORD =
SERVICE=Gmail
HOST =
EMAILPORT =

WEPSIT_HOST =
```

### 3. Run the Server

You can run the development server using:

```bash
npm start
```

This command uses `nodemon` to automatically restart the server when code changes are detected.

### 4. API Endpoints

The backend exposes several API endpoints under the `/api/v1` path. These are organized by resource:

- **Auth Routes**: `/api/v1/auth` — For user authentication (register, login, logout).
- **Instructor Routes**: `/api/v1/instructors` — For managing instructors.
- **Education Routes**: `/api/v1/education` — Education-related content.
- **Social Media Links Routes**: `/api/v1/socialMediaLinks` — Managing social media links.
- **Category Routes**: `/api/v1/category` — For managing categories.
- **Subcategory Routes**: `/api/v1/subCategory` — For managing subcategories.
- **Course Routes**: `/api/v1/courses` — Managing courses.
- **Lesson Routes**: `/api/v1/lessons` — Managing lessons within courses.
- **Review Routes**:
  - `/api/v1/reviewCourse` — Course reviews.
  - `/api/v1/reviewInstructor` — Instructor reviews.
- **Wishlist Routes**: `/api/v1/wishlist` — Managing user wishlists.
- **Cart Routes**: `/api/v1/cart` — Managing the shopping cart.
- **Order Routes**: `/api/v1/order` — Managing orders.

### 5. Error Handling

The server handles common errors such as 404 (not found) and uses centralized error handling for other types of errors via the `AppError` class and `ErrorHandelMiddleware`.

### 6. Development Tools

The project includes `ESLint` and `Prettier` for code quality and formatting, adhering to the Airbnb JavaScript style guide.

Run the linter using:

```bash
npm run lint
```

You can also run the linter in fix mode:

```bash
npm run lint -- --fix
```

### 7. Deployment

When deploying, ensure the `NODE_ENV` variable is set to `production` and all necessary environment variables are properly configured. Use a process manager like `PM2` or deploy via cloud services like Heroku or AWS.

---
