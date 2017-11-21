var express = require("express");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('games');
});


router.get("/new", (req, res, next) => {
 res.render("edit");
});

router.post("/new", (req, res, next) => {
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
