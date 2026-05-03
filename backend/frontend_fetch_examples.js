// Change this if your backend runs on another host/port
const API = "http://localhost:3000/api";

// GET all bookings
fetch(`${API}/bookings`)
  .then(res => res.json())
  .then(data => console.log("Bookings:", data));

// GET one room
fetch(`${API}/rooms/1`)
  .then(res => res.json())
  .then(data => console.log("Room 1:", data));

// POST a new booking
fetch(`${API}/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    GuestID: 1,
    RoomID: 1,
    BookingDate: "2026-06-01",
    CheckInDate: "2026-06-10",
    CheckOutDate: "2026-06-12",
    BookingStatus: "Confirmed",
    NumberOfGuests: 1,
    TotalAmount: 400
  })
})
  .then(res => res.json())
  .then(data => console.log("Created booking:", data));

// PUT update guest
fetch(`${API}/guests/1`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    PhoneNumber: "0500000000"
  })
})
  .then(res => res.json())
  .then(data => console.log("Updated guest:", data));

// DELETE room type
fetch(`${API}/roomtypes/2`, {
  method: "DELETE"
})
  .then(res => res.json())
  .then(data => console.log("Deleted room type:", data));
