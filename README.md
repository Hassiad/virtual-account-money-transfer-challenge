# Money Transfer Application

## Description

A full-stack money transfer application built with NestJS, TypeORM, PostgreSQL, and React.

## Features

- User Registration and Authentication
- Virtual Account Creation
- Money Transfers Between Users
- Transaction History
- Transaction Search

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

## Backend Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=money_transfer_db
   JWT_SECRET=your_jwt_secret
   ```
4. Run migrations:
   ```bash
   npm run migrate
   ```
5. Start the server:
   ```bash
   npm run start:dev
   ```

## Frontend Setup

1. Navigate to frontend directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Testing

Run backend tests:

```bash
npm run test
```

## API Documentation

Access Swagger documentation at `http://localhost:3000/api-docs`

## Deployment

- Backend: AWS/Heroku/DigitalOcean
- Frontend: Netlify/Vercel
- Database: ElephantSQL/AWS RDS
