const express = require('express');
const ensureLogin = require('connect-ensure-login');
const moment = require('moment');
const router = express.Router();

const Game = require('../models/game').Game;

/* GET home page. */
router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const data = {
    user: req.user,
    moment
  };
  res.render('games', data);
});

// LOGIN
router.get(
  '/new',
  ensureLogin.ensureLoggedIn('/auth/login'),
  (req, res, next) => {
    res.render('edit');
  }
);

router.post('/new', (req, res, next) => {
  let location = {
    type: 'Point',
    coordinates: [req.body.cityLat, req.body.cityLng]
  };

  const newGame = new Game({
    name: req.body.name,
    location: location,
    startTime: Date(req.body.startTime),
    endTime: Date(req.body.endTime),
    owner: req.user._id,
    playersNeeded: req.body.playersNeeded,
    sport: req.body.sport
  });

  // Save the game to the Database
  newGame.save(error => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/');
    }
  });
});

router.get('/games/json', (req, res, next) => {
  Game.find({}, (error, games) => {
    games.forEach(function (game) {
      console.log(typeof game.name);
    });
    if (error) {
      console.log('error', error);
      res.status(500).json({ error: 'FUUUUUUU!' });
    } else {
      res.json(games);
    }
  });
});

// GET GAME
router.get('/game/:gameId', (req, res, next) => {
  Game.findOne({_id: req.params.gameId}, (err, game) => {
    if (err) {
      next(err);
      return;
    }

    if (!game) {
      res.render('not-found');
      return;
    }

    const data = {
      game: game
    };

    res.render('game', data);
  });
});

router.post('/game/:gameId', (req, res, next) => {
  Game.findOne({_id: req.params.gameId}, (err, game) => {
    let alreadyJoined = game.playersAttending.some((el) => {
      return el.equals(req.user._id);
    });
    if (err) {
      next(err);
      return;
    }
    console.log(alreadyJoined);

    if (alreadyJoined) {
      game.playersAttending.splice(game.playersAttending.indexOf(req.user._id), 1);
    } else {
      game.playersAttending.push(req.user._id);
    }
    game.save(error => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    });

  // Game.findOneAndUpdate({_id: req.params.gameId},
  //   {$push: {playersAttending: req.user._id}}, (err) => {
  //     if (err) {
  //       next(err);
  //       return;
  //     }
  //     res.redirect('/');
  //   });

  // Game.find({ playersAttending: { $elemMatch: { $eq: req.user._id } } }, (err, game) => {
  //   if (err) {
  //     next(err);
  //     return;
  //   }
  //   if (game) {
  //     res.render('error');
  //   } else {
  //     game.playersAttending.push(req.user_id);
  //     game.save(function (err) {
  //       if (err) {
  //         next(err);
  //         return;
  //       }
  //       res.redirect('/');
  //     });
  //   }
  // });
  // Game.find({ playersAttending: { $elemMatch: { $eq: req.user._id} } }, function(err, game){
  //   if(err){return next(err);}
  //   if(game){
  //       sendJSONresponse(res, 400, {
  //           "message": "Device already assigned to a user"
  //       });
  //       return;
  //   } else {
  //       game.playersAttending.push(device._id);
  //       game.save(function(err) {
  //           if(err){return next(err);}
  //           sendJSONresponse(res, 200, game);
  //       })
  //   }
  // )}
  });
});

// DELETE GAME - under construction

// router.get('/game/:gameid', (req, res, next) => {
//   Game.findOne({_id: req.params.gameId}, (err, game) => {
//     if (err) {
//       next(err);
//       return;
//     }

//       res.render('team/edit', data);
//     );
//   });
// });

module.exports = router;
