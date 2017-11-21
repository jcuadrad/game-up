const express = require("express");
const ensureLogin = require("connect-ensure-login");
const router = express.Router();

const Game = require("../models/game").Game;

/* GET home page. */
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

// CREATE NEW GAME
router.get("/:gameId", (req, res, next) => {
  res.render("game/edit", { title: "Edit Game" });
});

// router.get("/", (req, res, next) => {
//   Team.find({ owner: req.user._id }, (err, result) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     const data = {
//       teams: result,
//       message: req.flash("message")
//     };
//     res.render("team/index", data);
//   });
// });

module.exports = router;
