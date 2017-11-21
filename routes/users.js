var express = require("express");
var router = express.Router();

//REQUIRE GAME MODEL
const Game = require("../models/game").Game;

/* GET users listing. */
router.get("/profile", (req, res, next) => {
  console.log(req);
  const data = {
    gamesCreated: ["game1", "game2"],
    gamesAttended: ["my first game"]
  };
  res.render("profile", data);
});

module.exports = router;
