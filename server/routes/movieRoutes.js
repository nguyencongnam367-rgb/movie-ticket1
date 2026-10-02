const express = require("express");

const {
    getMovies,
    getShowingMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", getMovies);
router.get("/showing", getShowingMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;