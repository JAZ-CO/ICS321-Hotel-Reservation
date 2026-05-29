# 🏨 Hotel Reservation & Room Management System

A full-stack hotel reservation application built with a normalized **PostgreSQL** relational database, a **Node.js/Express** REST API backend, and a polished **HTML/Tailwind CSS/JavaScript** frontend. Developed as a database systems course project at **King Fahd University of Petroleum & Minerals (KFUPM)**.

---

## ✨ Features

- **Guest registration & login** — credential verification against the live database
- **Room browsing** — real-time availability cards with room type, price, floor, and status
- **Booking flow** — date selection with automatic cost calculation (including member discount & service fee)
- **Reservation history** — view all past and current stays per guest
- **Cancellation** — one-click cancel that updates both booking status and room availability
- **Enforced business rules** — check constraints, foreign keys, and unique constraints at the database level
- **Cloud-hosted database** — PostgreSQL instance managed via **Aiven**, accessible from any device

---

## 🗄️ Database Schema

The schema follows a fully normalized relational model with **8 tables** and strict referential integrity:

| Table | Description |
|---|---|
| `Hotel` | Hotel details (name, address, city, rating) |
| `Guest` | Guest personal and contact information |
| `RoomType` | Room categories (Single, Double, Suite) with pricing |
| `Room` | Individual rooms linked to a hotel and room type |
| `JobType` | Employee job categories (Receptionist, Manager, etc.) |
| `Employee` | Staff records linked to a hotel and job type |
| `Booking` | Reservations linking a guest to a room with dates and status |
| `Payment` | Payment transactions linked to bookings |

### Entity Relationships

```
Hotel ──< Room >── RoomType
Hotel ──< Employee >── JobType
Guest ──< Booking >── Room
Booking ──< Payment
```

### Business Rules Enforced by the Database

- `RoomStatus` must be one of: `Available`, `Occupied`, `Maintenance`, `Cleaning`
- `BookingStatus` must be one of: `Pending`, `Confirmed`, `Cancelled`, `Checked-In`, `Checked-Out`
- `PaymentMethod` must be one of: `Cash`, `Card`, `Online`
- `PaymentStatus` must be one of: `Pending`, `Paid`, `Failed`, `Refunded`
- `CheckOutDate` must be strictly after `CheckInDate`
- `NumberOfGuests` and `Amount` must be greater than zero
- Room numbers are unique per hotel (`UNIQUE (HotelID, RoomNumber)`)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Database | PostgreSQL (hosted on Aiven) |
| Backend | Node.js, Express, `pg` (node-postgres) |
| Frontend | HTML5, Tailwind CSS, Vanilla JavaScript |
| DB Client | psql CLI, Aiven PG Studio |

---

## 📁 Project Structure

```
├── sql/
│   ├── 01_schema.sql        # Table definitions with all constraints
│   ├── 02_sample_data.sql   # Sample hotels, guests, rooms, bookings, payments
│   └── 03_test_queries.sql  # Verification queries including joins
├── src/
│   ├── db.js                # PostgreSQL connection (via DATABASE_URL)
│   └── server.js            # Express REST API
├── frontend/                # HTML/Tailwind/JS pages
│   ├── index.html           # Home page
│   ├── rooms.html           # Room browsing
│   ├── booking.html         # Reservation flow
│   ├── reservations.html    # Booking history
│   └── login.html           # Login & registration
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- `psql` CLI installed
- An [Aiven](https://aiven.io) PostgreSQL instance (or any PostgreSQL server)

### 1. Clone the repository

```bash
git clone https://github.com/JAZ-CO/ICS321-Hotel-Reservation.git
cd ICS321-Hotel-Reservation
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your PostgreSQL connection string:

```env
PORT=3000
DATABASE_URL=postgres://USERNAME:PASSWORD@HOST:PORT/defaultdb?sslmode=require
```

### 3. Create the database tables

```bash
psql "$DATABASE_URL" -f sql/01_schema.sql
```

### 4. Insert sample data

```bash
psql "$DATABASE_URL" -f sql/02_sample_data.sql
```

### 5. (Optional) Run test queries

```bash
psql "$DATABASE_URL" -f sql/03_test_queries.sql
```

### 6. Install dependencies and start the backend

```bash
npm install
npm start
```

The server runs at `http://localhost:3000`.

### 7. Launch the frontend

Open any HTML file in the `frontend/` folder using a local development server (e.g. VS Code Live Server).

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API root / status |
| `GET` | `/health` | Health check |
| `GET` | `/rooms` | Fetch all rooms with type and status |
| `GET` | `/guests` | Fetch all guests |
| `GET` | `/bookings` | Fetch all bookings with guest and room details |
| `POST` | `/bookings` | Create a new booking and update room status |
| `PATCH` | `/bookings/:id/cancel` | Cancel a booking and restore room availability |
| `POST` | `/guests/login` | Authenticate a guest by name and email |
| `POST` | `/guests/register` | Register a new guest |

---

## 🗃️ Resetting the Database

To start fresh, drop all tables from your Aiven dashboard (or via `psql`) and re-run the schema:

```bash
psql "$DATABASE_URL" -f sql/01_schema.sql
psql "$DATABASE_URL" -f sql/02_sample_data.sql
```

---

## 👥 Authors

| Name | Contributions |
|---|---|
| **Jalal Zainaddin** | ER diagram, relational model, SQL schema & constraints, sample data, test queries, Aiven setup |
| **Hassan AlMarhoon** | Frontend (HTML/Tailwind/JS), backend Node.js queries, API-database integration |

---

## 📚 Course

**ICS321 — Database Management Systems**
King Fahd University of Petroleum & Minerals (KFUPM) — Spring 2026