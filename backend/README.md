# Simple Hotel Reservation Backend (Aiven PostgreSQL)

## Do I need to keep my laptop running?
- **For the Aiven database:** no. Aiven is hosted in the cloud.
- **For this backend API:** yes, **if** your partner is using the API running on *your* laptop.
- Best development option: each of you can run the same backend locally with the same `DATABASE_URL`.
- Best long-term option: later deploy this backend to a cloud host.

## Where to put this folder
Put the `backend` folder **inside your main project folder**, next to your `sql` folder.

Example:
```text
ICS321/
  sql/
    01_schema.sql
    02_sample_data.sql
    03_test_queries.sql
  backend/
    package.json
    .env.example
    src/
```

## Setup
1. Open terminal inside the `backend` folder
2. Copy `.env.example` to `.env`
3. Paste your Aiven connection string into `.env`
4. Run:
```bash
npm install
npm start
```

## Base URL
```text
http://localhost:3000
```

## Main endpoints
- `GET /api/health`
- `GET /api/hotels`
- `GET /api/guests`
- `GET /api/jobtypes`
- `GET /api/roomtypes`
- `GET /api/employees`
- `GET /api/rooms`
- `GET /api/bookings`
- `GET /api/payments`

Each resource also supports:
- `GET /api/<resource>/:id`
- `POST /api/<resource>`
- `PUT /api/<resource>/:id`
- `DELETE /api/<resource>/:id`

## Example frontend fetch requests

### 1. Fetch all rooms
```js
fetch("http://localhost:3000/api/rooms")
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Fetch one guest
```js
fetch("http://localhost:3000/api/guests/1")
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. Insert a guest
```js
fetch("http://localhost:3000/api/guests", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    FirstName: "Nora",
    LastName: "Saad",
    PhoneNumber: "0501112233",
    Email: "nora@example.com",
    NationalIDOrPassport: "S8899001",
    Address: "Riyadh"
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### 4. Update a room
```js
fetch("http://localhost:3000/api/rooms/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    RoomStatus: "Occupied"
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### 5. Delete a payment
```js
fetch("http://localhost:3000/api/payments/2", {
  method: "DELETE"
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Notes
- The frontend should **never** connect directly to Aiven/PostgreSQL.
- The frontend should only call this backend API.
- Keep your `DATABASE_URL` private and never put it in frontend code.
