const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
} = require("../controllers/bookingController");

const router = express.Router();


router.post("/", createBooking);



router.get("/user/:userId", getMyBookings);



router.get("/:id", getBookingById);


module.exports = router;