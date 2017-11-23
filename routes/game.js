const express = require('express');
const ensureLogin = require('connect-ensure-login');
const router = express.Router();

const Game = require('../models/game').Game;

/* GET home page. */
router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  const data = {
    user: req.user
  };
  res.render('games', data);
});

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
  Game.find((error, games) => {
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
  Game.findOneAndUpdate({_id: req.params.gameId},
    {$push: {playersAttending: req.user._id}}, (err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    });
});

module.exports = router;
