const express = require("express");

const {
    getShowtimes,
    getSeatsByShowtime
} = require("../controllers/showtimeController");

const router = express.Router();

router.get("/", getShowtimes);
router.get("/:id/seats", getSeatsByShowtime);

module.exports = router;