var express = require("express");
var router = express.Router();

/* GET home page. */
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
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    owner: req.body.owner,
    playersNeeded: req.body.playersNeeded,
    sport: req.body.sport,
    state: req.body.state,
    playersAttending: req.body.playersAttending
  };
});

//GET GAME
router.get("/game", (req, res, next) => {
  res.render("/game");
});

router.post("/game", (req, res, next) => {
  res.render("/game/:id/join");
});

module.exports = router;
