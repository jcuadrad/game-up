var express = require('express');
var router = express.Router();
const User = require('../models/user').User;

// REQUIRE GAME MODEL
const Game = require('../models/game').Game;

// FIND USER FROM USER ARRAY

// User.find({ username: { $in: User } }, (err, user) => {
//   if (err) {
//     next(err);
//     return;
//   }
//   const data = user;
//   res.render("profile", data);
// });

/* GET users listing. */
router.get('/profile', (req, res, next) => {
  Game.find({ owner: req.user._id }, (err, result) => {
    console.log(Game.owner);
    if (err) {
      next(err);
      return;
    }
    const gamesComingUp = result.filter(elem => {
      return elem.state === 'Coming Up';
    });

    const gamesEnded = result.filter(elem => {
      return elem.state === 'Ended';
    });

    const data = {
      gamesCreated: gamesComingUp,
      gamesAttended: gamesEnded,
      upcomingGames: gamesComingUp
    };

    res.render('profile', data);
  });
});

module.exports = router;
