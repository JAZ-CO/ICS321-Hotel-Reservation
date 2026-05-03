# Simple Hotel Reservation Backend (Aiven PostgreSQL)

This is a fresh simple project without Firebase.

## What is inside
- `sql/01_schema.sql` -> creates all tables
- `sql/02_sample_data.sql` -> inserts sample data
- `sql/03_test_queries.sql` -> simple test queries
- `src/db.js` -> PostgreSQL connection
- `src/server.js` -> very small Express backend

## 1. Create `.env`
Copy `.env.example` to `.env` and paste your Aiven PostgreSQL connection string:

```env
PORT=3000
DATABASE_URL=postgres://USERNAME:PASSWORD@HOST:PORT/defaultdb?sslmode=require
```

## 2. Create the tables
Run this in terminal:

```bash
psql "$DATABASE_URL" -f sql/01_schema.sql
```

## 3. Insert sample data
Run:

```bash
psql "$DATABASE_URL" -f sql/02_sample_data.sql
```

## 4. Test the data
Run:

```bash
psql "$DATABASE_URL" -f sql/03_test_queries.sql
```

## 5. Start the backend
Install packages:

```bash
npm install
```

Then start the server:

```bash
npm start
```

## Endpoints
- `GET /`
- `GET /health`
- `GET /rooms`
- `GET /guests`
- `GET /bookings`

## Notes
- This project is intentionally simple.
- The frontend can later fetch data from these endpoints.
- If you want to reset the database, drop the tables from Aiven and run the schema again.
