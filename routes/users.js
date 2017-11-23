var express = require('express');
var router = express.Router();
const User = require('../models/user').User;

// REQUIRE GAME MODEL
const Game = require('../models/game').Game;

// FIND USER FROM USER ARRAY

router.get('/profile/:userId', (req, res, next) => {
  Game.find({ owner: req.user._id }, (err, result) => {
    console.log(result.owner);
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

    Game.find(
      { playersAttending: { $in: [req.params.userId] } },
      (err, allGames) => {
        if (err) {
          next(err);
          return;
        }

        console.log(allGames);
        const upcomingGames = allGames.filter(elem => {
          return elem.state == 'Coming Up';
        });
        const data = {
          user: req.user,
          gamesCreated: gamesComingUp,
          gamesAttended: gamesEnded,
          upcomingGames: upcomingGames
        };

        res.render('profile', data);
      }
    );
  });
});

router.post('/profile/:id/delete/:gameId', (req, res, next) => {
  // delete da gameid
  Game.remove({ _id: req.params.gameId }, (err, game) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`/users/profile/${req.user._id}`);
  });
});

module.exports = router;
