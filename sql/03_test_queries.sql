SELECT * FROM Hotel;
SELECT * FROM Guest;
SELECT * FROM JobType;
SELECT * FROM Employee;
SELECT * FROM RoomType;
SELECT * FROM Room;
SELECT * FROM Booking;
SELECT * FROM Payment;

SELECT b.BookingID, g.FirstName, g.LastName, r.RoomNumber, b.CheckInDate, b.CheckOutDate, b.BookingStatus
FROM Booking b
JOIN Guest g ON b.GuestID = g.GuestID
JOIN Room r ON b.RoomID = r.RoomID
ORDER BY b.BookingID;

SELECT r.RoomID, r.RoomNumber, r.RoomStatus, rt.TypeName, rt.PricePerNight
FROM Room r
JOIN RoomType rt ON r.RoomTypeID = rt.RoomTypeID
ORDER BY r.RoomNumber;
