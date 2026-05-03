INSERT INTO Hotel (HotelName, Address, City, PhoneNumber, Email, Rating)
VALUES ('Palm Stay Hotel', 'King Fahd Road', 'Dhahran', '0130000000', 'info@palmstay.com', 4.5);

INSERT INTO Guest (FirstName, LastName, PhoneNumber, Email, NationalIDOrPassport, Address)
VALUES
('Ahmed', 'Ali', '0501234567', 'ahmed@example.com', 'S1234567', 'Dammam'),
('Sara', 'Hassan', '0559876543', 'sara@example.com', 'S7654321', 'Khobar');

INSERT INTO JobType (JobTitle, Department, Description)
VALUES
('Receptionist', 'Front Desk', 'Handles guest bookings and reception'),
('Manager', 'Administration', 'Supervises hotel operations');

INSERT INTO Employee (HotelID, JobTypeID, FirstName, LastName, PhoneNumber, Email, HireDate, Salary)
VALUES
(1, 1, 'Mona', 'Khalid', '0541111111', 'mona@palmstay.com', '2026-05-01', 5000.00),
(1, 2, 'Omar', 'Salem', '0542222222', 'omar@palmstay.com', '2026-05-03', 8500.00);

INSERT INTO RoomType (TypeName, Capacity, PricePerNight, Description)
VALUES
('Single', 1, 200.00, 'Single bed room'),
('Double', 2, 350.00, 'Double bed room');

INSERT INTO Room (HotelID, RoomTypeID, RoomNumber, FloorNumber, RoomStatus)
VALUES
(1, 1, '101', 1, 'Available'),
(1, 2, '102', 1, 'Occupied');

INSERT INTO Booking (GuestID, RoomID, BookingDate, CheckInDate, CheckOutDate, BookingStatus, NumberOfGuests, TotalAmount)
VALUES
(1, 1, '2026-05-03', '2026-05-10', '2026-05-12', 'Confirmed', 1, 400.00),
(2, 2, '2026-05-04', '2026-05-15', '2026-05-18', 'Checked-In', 2, 1050.00);

INSERT INTO Payment (BookingID, PaymentDate, Amount, PaymentMethod, PaymentStatus, TransactionReference)
VALUES
(1, '2026-05-03', 400.00, 'Card', 'Paid', 'TXN1001'),
(2, '2026-05-04', 1050.00, 'Cash', 'Paid', 'TXN1002');
