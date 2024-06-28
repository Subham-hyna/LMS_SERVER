# Library Management System Server

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contact](#contact)

## Introduction
The Library Management System Server is a backend application designed to manage library operations, including book inventory, user accounts, borrowing, and returning books. This server provides a RESTful API for interacting with the system.

## Features
- User authentication and authorization
- Manage books (add, update, delete, search)
- User management (registration, profile updates)
- Borrow and return books
- Track borrowing history
- Fine calculation for overdue books

## Requirements
- Node.js (v14 or later)
- MongoDB (v4.0 or later)

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/LMS_SERVER.git
   cd library-management-system-server

2. **Install dependencies:**
   ```sh
   npm install

3. **Set up environment variables:**
   Create a .env file in the root directory and add the following:
   ```sh
   MONGO_URI=mongodb://localhost:27017/library
   CORS_ORIGIN=*
   PORT=8000
   ACCESS_TOKEN_SECRET = your_jwt_secret b70052d5e2b7085c34
   ACCESS_TOKEN_EXPIRY = 1d
   REFRESH_TOKEN_SECRET = your_jwt_secret   9292c48a354a25cec3
   REFRESH_TOKEN_EXPIRY = 10d
   CLOUDINARY_CLOUD_NAME = your_cloudinary_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET =    your_cloudinary_api_secret
   SMPT_SERVICE = gmail
   SMPT_SERVICE = gmail
   SMPT_MAIL = your_email
   SMPT_PASSWORD = your_email_password
   SMPT_HOST = smtp.gmail.com
   SMPT_PORT = 465
   FRONTEND_URL = frontend_url
   COOKIE_EXPIRE = 1


3. **Start the server:**   
   ```sh
   npm start

## Configuration
- **Database:** Ensure MongoDB is running and the connection string in the `.env` file is correct.
- **Environment Variables:** Modify the `.env` file as needed for your setup.

## Usage
Once the server is running, you can interact with the API using tools like Postman or cURL. The server will be accessible at `http://localhost:8000/api/v1`.

## API Endpoints

### Authentication
- **POST /api/v1/users/register:** Register a new user
- **POST /api/v1/users/login:** Login a user
- **PUT /api/v1/users/verify/:token:** Verify user
- **GET /api/v1/users/logout:** Logout user
- **POST /api/v1/users/forgot-password:** Forgot Password
- **PUT /api/v1/users/reset-password/:token:** Reset Password
- **PUT /api/v1/users/change-password:** Change Password
- **PUT /api/v1/users/update-avatar:** Update Avatar

### Books
- **GET /api/v1/book/get-books:** Get all books
- **POST /api/v1/book/add-book":** Add a new book
- **PUT /api/v1/book/edit-book/:id:** Update a book by ID

### Users
- **GET /api/v1/users/current-user:** Get current login user
- **GET /api/v1/users/get-users:** Get all users
- **GET /api/v1/users/get-user/:id:** Get a user by ID
- **PUT /api/v1/users/change-membershipStatus/:id:** Change Membership Status of a user

### Borrowing
- **POST /api/v1/issue/issue-request:** Generate a Borrow Request
- **GET /api/v1/issue/get-currentUser-issues:** Get borrowing history of current login user
- **GET /api/v1/issue/get-allIssues:** Get borrowing history
- **GET /api/v1/issue/get-singleUser/:userId:** Get borrowing history of a single user
- **DELETE /api/v1/issue/delete-issueRequest/:issueId:** Delete borrow request by issue ID
- **DELETE /api/v1/issue/delete-myIssueRequest/:issueId:** Delete current user borrow request
- **PUT /api/v1/issue/approve-issueRequest:** Approve Borrow Issue Request 
- **PUT /api/v1/issue/renew-issue:** Renew a book
- **PUT /api/v1/issue/return:** Return a book

## Contact
For questions or support, please contact [subhamdutta460@gmail.com](mailto:subhamdutta460@gmail.com).
