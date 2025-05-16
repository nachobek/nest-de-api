# NestJS API Application

A REST API built with NestJS, PostgreSQL and Sequelize ORM to load data from csv files into the database tables.

## Prerequisites

- Node.js (v22.12.0 or higher)
- npm (v6 or higher)
- PostgreSQL (v17 or higher)

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Install Dependencies

Clone the repository and install the npm packages:

```bash
npm install
```

### 2. Set Up PostgreSQL Database

Ensure you have PostgreSQL installed and running. You can:

- Install PostgreSQL directly on your machine, or
- Use Docker to spin up a PostgreSQL instance:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# App
NODE_ENV='' # [local, development, staging, prod]
PORT='3000'

# DB
DB_USERNAME=''
DB_PASSWORD=''
DB_DATABASE=''
DB_HOST=''
DB_PORT='5432'

# Auth
API_KEY=''
```

### 4. Run the Application

Start the application in development mode:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running locally, you can access the Swagger API documentation at:

http://localhost:3000/api-docs

## Project Structure

```
src/
├── auth/              # Authentication logic
├── common/            # Shared code (filters, guards, base model, etc.)
├── config/            # Application configuration
├── sync/              # Syncronization endpoint to manually execute the data load process
├── app.controller.ts  # Main application controller
├── app.module.ts      # Main application module
└── main.ts            # Application entry point
```

## Features

- RESTful API endpoints
- Modular approach
- Light weight Api key based Authentication
- PostgreSQL with Sequelize ORM
- OpenAPI/Swagger documentation
