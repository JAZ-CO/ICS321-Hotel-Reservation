const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1)
            return callback(new Error('CORS policy violation'), false);
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');
        res.json({ ok: true, databaseTime: result.rows[0].current_time });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.roomid         AS "RoomID",
                   r.roomnumber     AS "RoomNumber",
                   r.floornumber    AS "FloorNumber",
                   r.roomstatus     AS "RoomStatus",
                   rt.typename      AS "TypeName",
                   rt.pricepernight AS "PricePerNight",
                   rt.capacity      AS "Capacity",
                   rt.description   AS "Description"
            FROM room r
            JOIN roomtype rt ON r.roomtypeid = rt.roomtypeid
            ORDER BY r.roomnumber;
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/guests', async (req, res) => {
    const { FirstName, LastName, PhoneNumber, Email, NationalID, Address } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO guest (firstname, lastname, phonenumber, email, nationalid, address)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING guestid AS "GuestID";`,
            [FirstName, LastName, PhoneNumber, Email, NationalID, Address]
        );
        res.status(201).json({ id: result.rows[0].GuestID });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `SELECT guestid   AS "GuestID",
                    firstname AS "FirstName"
             FROM guest
             WHERE email = $1
               AND (firstname || ' ' || lastname = $2 OR firstname = $2)`,
            [email, name]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).send("Invalid name or email.");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.bookingid       AS "BookingID",
                   b.guestid        AS "GuestID",
                   b.roomid         AS "RoomID",
                   g.firstname || ' ' || g.lastname AS "GuestName",
                   r.roomnumber     AS "RoomNumber",
                   b.checkindate    AS "CheckInDate",
                   b.checkoutdate   AS "CheckOutDate",
                   b.bookingstatus  AS "BookingStatus",
                   b.totalamount    AS "TotalAmount",
                   b.numberofguests AS "NumberOfGuests"
            FROM booking b
            JOIN guest g ON b.guestid = g.guestid
            JOIN room r  ON b.roomid  = r.roomid
            ORDER BY b.bookingid DESC;
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    const { guestid, roomid, checkindate, checkoutdate,
            bookingstatus, totalamount, numberofguests } = req.body;

    const bookingdate = new Date().toISOString().split('T')[0];

    try {
        const result = await pool.query(
            `INSERT INTO booking
               (guestid, roomid, bookingdate, checkindate, checkoutdate, bookingstatus, totalamount, numberofguests)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING bookingid AS "BookingID";`,
            [guestid, roomid, bookingdate, checkindate, checkoutdate, bookingstatus, totalamount, numberofguests]
        );
        res.status(201).json({ ok: true, bookingId: result.rows[0].BookingID });
    } catch (error) {
        console.error("Booking insert error:", error);
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.patch('/api/bookings/:id', async (req, res) => {
    const { BookingStatus } = req.body;
    try {
        await pool.query(
            'UPDATE booking SET bookingstatus = $1 WHERE bookingid = $2',
            [BookingStatus, req.params.id]
        );
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/api/rooms/:id', async (req, res) => {
    const { RoomStatus } = req.body;
    try {
        await pool.query(
            'UPDATE room SET roomstatus = $1 WHERE roomid = $2',
            [RoomStatus, req.params.id]
        );
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function seedData() {
    try {
        // Step 1: Insert room types
        await pool.query(
            "INSERT INTO roomtype (typename, capacity, pricepernight, description) " +
            "VALUES " +
            "('Single', 1, 200.00, 'Single bed room'), " +
            "('Double', 2, 350.00, 'Double bed room'), " +
            "('Suite',  2, 600.00, 'Luxury suite with living area'), " +
            "('Deluxe', 3, 450.00, 'Spacious deluxe room with sea view'), " +
            "('Family', 4, 500.00, 'Family room with two queen beds') " +
            "ON CONFLICT (typename) DO NOTHING"
        );

        // Step 2: Fetch actual IDs
        const types = await pool.query(
            "SELECT roomtypeid, typename FROM roomtype ORDER BY roomtypeid"
        );

        const getId = (name) => types.rows.find(r => r.typename === name).roomtypeid;

        const single = getId('Single');
        const double = getId('Double');
        const suite  = getId('Suite');
        const deluxe = getId('Deluxe');
        const family = getId('Family');

        // Step 3: Insert rooms using real IDs
        await pool.query(
            "INSERT INTO room (hotelid, roomtypeid, roomnumber, floornumber, roomstatus) " +
            "VALUES " +
            "(1, $1, '101', 1, 'Available'), " +
            "(1, $2, '102', 1, 'Occupied'),  " +
            "(1, $3, '201', 2, 'Available'), " +
            "(1, $4, '202', 2, 'Available'), " +
            "(1, $5, '203', 2, 'Occupied'),  " +
            "(1, $1, '301', 3, 'Available'), " +
            "(1, $2, '302', 3, 'Available')  " +
            "ON CONFLICT (hotelid, roomnumber) DO NOTHING",
            [single, double, suite, deluxe, family]
        );

        console.log('Seed data ready.');
    } catch (error) {
        console.error('Seed error:', error.message);
    }
}

seedData();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});