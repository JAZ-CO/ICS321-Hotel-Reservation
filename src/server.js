const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    project: 'Hotel Reservation Backend',
    message: 'Simple Aiven PostgreSQL backend is running.'
  });
});

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({ ok: true, databaseTime: result.rows[0].current_time });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.roomid AS "RoomID",
             r.roomnumber AS "RoomNumber",
             r.floornumber AS "FloorNumber",
             r.roomstatus AS "RoomStatus",
             rt.typename AS "TypeName",
             rt.pricepernight AS "PricePerNight"
      FROM room r
      JOIN roomtype rt ON r.roomtypeid = rt.roomtypeid
      ORDER BY r.roomnumber;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.get('/guests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guest ORDER BY guestid;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.bookingid AS "BookingID",
             g.firstname || ' ' || g.lastname AS "GuestName",
             r.roomnumber AS "RoomNumber",
             b.checkindate AS "CheckInDate",
             b.checkoutdate AS "CheckOutDate",
             b.bookingstatus AS "BookingStatus",
             b.totalamount AS "TotalAmount"
      FROM booking b
      JOIN guest g ON b.guestid = g.guestid
      JOIN room r ON b.roomid = r.roomid
      ORDER BY b.bookingid;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
