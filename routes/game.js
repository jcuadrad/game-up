const express = require("express");
const ensureLogin = require("connect-ensure-login");
const router = express.Router();

const Game = require("../models/game").Game;

/* GET home page. */
<<<<<<< HEAD
router.get("/new", (req, res, next) => {
  res.render("game/new");
});

//NEW GAME

// router.get("/:gameId", (req, res, next) => {
//   res.render("game/edit", { title: "Edit Game" });
// });

router.post("/new/:id", (req, res, next) => {
  const newGame = {
    location: req.body.location,
=======
router.get('/',ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('games');
});


router.get("/new", ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
 res.render("edit");
});

router.post("/new", (req, res, next) => {
  let location = {
    type: "Point",
    coordinates: [req.body.cityLat, req.body.cityLng]
  };

  const newGame = new Game ({
    name: req.body.name,
    location: location,
>>>>>>> c5a0663267641970b80862ea405cffea30e15b63
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    owner: req.user._id,
    playersNeeded: req.body.playersNeeded,
    sport: req.body.sport,
  });

    // Save the game to the Database
    newGame.save(error => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/");
      }
    });
});

//GET GAME
router.get("/game", (req, res, next) => {
  res.render("/game");
});

router.post("/game", (req, res, next) => {
  res.render("/game/:id/join");
});

module.exports = router;
