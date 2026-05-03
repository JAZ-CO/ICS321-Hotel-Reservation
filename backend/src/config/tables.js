module.exports = {
  hotels: {
    tableName: "hotel",
    primaryKey: "hotelid",
    defaultOrderBy: "hotelid",
    fields: ["hotelname", "address", "city", "phonenumber", "email", "rating"],
    requiredOnCreate: ["hotelname", "address", "city", "phonenumber", "email"]
  },
  guests: {
    tableName: "guest",
    primaryKey: "guestid",
    defaultOrderBy: "guestid",
    fields: ["firstname", "lastname", "phonenumber", "email", "nationalidorpassport", "address"],
    requiredOnCreate: ["firstname", "lastname", "phonenumber", "email", "nationalidorpassport"]
  },
  jobtypes: {
    tableName: "jobtype",
    primaryKey: "jobtypeid",
    defaultOrderBy: "jobtypeid",
    fields: ["jobtitle", "department", "description"],
    requiredOnCreate: ["jobtitle", "department"]
  },
  roomtypes: {
    tableName: "roomtype",
    primaryKey: "roomtypeid",
    defaultOrderBy: "roomtypeid",
    fields: ["typename", "capacity", "pricepernight", "description"],
    requiredOnCreate: ["typename", "capacity", "pricepernight"]
  },
  employees: {
    tableName: "employee",
    primaryKey: "employeeid",
    defaultOrderBy: "employeeid",
    fields: ["hotelid", "jobtypeid", "firstname", "lastname", "phonenumber", "email", "hiredate", "salary"],
    requiredOnCreate: ["hotelid", "jobtypeid", "firstname", "lastname", "phonenumber", "email", "hiredate"]
  },
  rooms: {
    tableName: "room",
    primaryKey: "roomid",
    defaultOrderBy: "roomid",
    fields: ["hotelid", "roomtypeid", "roomnumber", "floornumber", "roomstatus"],
    requiredOnCreate: ["hotelid", "roomtypeid", "roomnumber", "floornumber", "roomstatus"]
  },
  bookings: {
    tableName: "booking",
    primaryKey: "bookingid",
    defaultOrderBy: "bookingid",
    fields: ["guestid", "roomid", "bookingdate", "checkindate", "checkoutdate", "bookingstatus", "numberofguests", "totalamount"],
    requiredOnCreate: ["guestid", "roomid", "bookingdate", "checkindate", "checkoutdate", "bookingstatus", "numberofguests", "totalamount"]
  },
  payments: {
    tableName: "payment",
    primaryKey: "paymentid",
    defaultOrderBy: "paymentid",
    fields: ["bookingid", "paymentdate", "amount", "paymentmethod", "paymentstatus", "transactionreference"],
    requiredOnCreate: ["bookingid", "paymentdate", "amount", "paymentmethod", "paymentstatus"]
  }
};