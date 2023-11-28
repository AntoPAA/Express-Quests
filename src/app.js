const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const userControllers = require("./controllers/userControllers");
const movieControllers = require("./controllers/movieControllers");

const validateMovie = require("./middlewares/validateMovie");
const validateUser = require("./middlewares/validateUser");

app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", userControllers.updateUser);

app.post("/api/movies", validateMovie, movieControllers.postMovie);
app.post("/api/users", validateUser, userControllers.postUsers);

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUsersById);

module.exports = app;
