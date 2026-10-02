const express = require("express");
const controller = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", controller.getDashboard);
router.get("/cinemas", controller.getCinemas);
router.post("/cinemas", controller.createCinema);
router.delete("/cinemas/:id", controller.deleteCinema);
router.get("/rooms", controller.getRooms);
router.post("/rooms", controller.createRoom);
router.delete("/rooms/:id", controller.deleteRoom);
router.get("/showtimes", controller.getAdminShowtimes);
router.post("/showtimes", controller.createShowtime);
router.delete("/showtimes/:id", controller.deleteShowtime);
router.get("/users", controller.getUsers);
router.delete("/users/:id", authenticateAdmin, controller.deleteUser);
router.get("/revenue", controller.getRevenue);

module.exports = router;
