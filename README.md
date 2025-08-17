#  Cloud Storage System

A full-stack cloud storage application built with the MERN stack (MongoDB, Express, React, Node.js). This project allows users to register, log in, and manage their personal files through a secure and intuitive web interface.

---

## ##  Features

* **User Authentication**: Secure user registration and login system using JWT (JSON Web Tokens).
* **File Uploads**: Users can upload files to their personal, protected storage space.
* **File Management Dashboard**: A central dashboard for authenticated users to view, download, and delete their files.
* **Protected Routes**: The dashboard and file management features are only accessible to logged-in users.
* **Responsive Design**: The user interface is designed to work on various screen sizes.

---

## ##  Tech Stack

* **Frontend**: React, React Router, Axios, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT, bcryptjs
* **File Handling**: Multer for handling multipart/form-data

---

## ## Live Demo

You can access the live, deployed version of the project at the following URL:

**Public URL**: (https://github.com/unlimited076/Cloud-Storage-System)

---

## ##  Dashboard Access

Here is the public account and password

* **Username**: kokodayo076@gmail.com
* **Password**: 123

---

## ## Project Setup Instructions (Local)

To run this project on your local machine, please follow these steps:

### ### Prerequisites

* [Node.js](https://nodejs.org/) (v20 or newer)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)
* A running MongoDB instance (either local or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### ### 1. Clone the Repository
Please run the following code in your terminal

git clone https://github.com/unlimited076

cd backend

npm install

### 2. create a .env file in the backend folder and add following code

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5001 # Or any port you prefer

### Then, you can use the code to run developing mode

npm run dev

### 3. Frontend Setup

cd frontend

npm install

npm start
