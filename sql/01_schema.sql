CREATE TABLE Hotel (
    HotelID SERIAL PRIMARY KEY,
    HotelName VARCHAR(100) NOT NULL,
    Address VARCHAR(200) NOT NULL,
    City VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Rating DECIMAL(2,1)
);

CREATE TABLE Guest (
    GuestID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    NationalIDOrPassport VARCHAR(50) UNIQUE NOT NULL,
    Address VARCHAR(200)
);

CREATE TABLE JobType (
    JobTypeID SERIAL PRIMARY KEY,
    JobTitle VARCHAR(50) UNIQUE NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Description VARCHAR(200)
);

CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL,
    JobTypeID INT NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    HireDate DATE NOT NULL,
    Salary DECIMAL(10,2),
    CONSTRAINT fk_employee_hotel FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID),
    CONSTRAINT fk_employee_jobtype FOREIGN KEY (JobTypeID) REFERENCES JobType(JobTypeID)
);

CREATE TABLE RoomType (
    RoomTypeID SERIAL PRIMARY KEY,
    TypeName VARCHAR(50) UNIQUE NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity > 0),
    PricePerNight DECIMAL(10,2) NOT NULL CHECK (PricePerNight >= 0),
    Description VARCHAR(200)
);

CREATE TABLE Room (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT NOT NULL,
    RoomTypeID INT NOT NULL,
    RoomNumber VARCHAR(10) NOT NULL,
    FloorNumber INT NOT NULL,
    RoomStatus VARCHAR(20) NOT NULL,
    CONSTRAINT fk_room_hotel FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID),
    CONSTRAINT fk_room_roomtype FOREIGN KEY (RoomTypeID) REFERENCES RoomType(RoomTypeID),
    CONSTRAINT uq_room_per_hotel UNIQUE (HotelID, RoomNumber),
    CONSTRAINT chk_room_status CHECK (RoomStatus IN ('Available', 'Occupied', 'Maintenance', 'Cleaning'))
);

CREATE TABLE Booking (
    BookingID SERIAL PRIMARY KEY,
    GuestID INT NOT NULL,
    RoomID INT NOT NULL,
    BookingDate DATE NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    BookingStatus VARCHAR(20) NOT NULL,
    NumberOfGuests INT NOT NULL CHECK (NumberOfGuests > 0),
    TotalAmount DECIMAL(10,2) NOT NULL CHECK (TotalAmount >= 0),
    CONSTRAINT fk_booking_guest FOREIGN KEY (GuestID) REFERENCES Guest(GuestID),
    CONSTRAINT fk_booking_room FOREIGN KEY (RoomID) REFERENCES Room(RoomID),
    CONSTRAINT chk_booking_dates CHECK (CheckOutDate > CheckInDate),
    CONSTRAINT chk_booking_status CHECK (BookingStatus IN ('Pending', 'Confirmed', 'Cancelled', 'Checked-In', 'Checked-Out'))
);

CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    BookingID INT NOT NULL,
    PaymentDate DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    PaymentMethod VARCHAR(20) NOT NULL,
    PaymentStatus VARCHAR(20) NOT NULL,
    TransactionReference VARCHAR(100) UNIQUE,
    CONSTRAINT fk_payment_booking FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
    CONSTRAINT chk_payment_method CHECK (PaymentMethod IN ('Cash', 'Card', 'Online')),
    CONSTRAINT chk_payment_status CHECK (PaymentStatus IN ('Pending', 'Paid', 'Failed', 'Refunded'))
);
