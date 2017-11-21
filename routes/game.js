const express = require('express');
const ensureLogin = require('connect-ensure-login');
const router = express.Router();

const Game = require('../models/game').Game;

/* GET home page. */
router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('games');
});

router.get(
  '/new',
  ensureLogin.ensureLoggedIn('/auth/login'),
  (req, res, next) => {
    res.render('edit');
  }
);
router.get('/', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('games');
});

router.get('/new', ensureLogin.ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('edit');
});

router.post('/new', (req, res, next) => {
  let location = {
    type: 'Point',
    coordinates: [req.body.cityLat, req.body.cityLng]
  };

  const newGame = new Game({
    name: req.body.name,
    location: location,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
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
      console.log(games);
    }
  });
});

// GET GAME
router.get('/game', (req, res, next) => {
  res.render('/game');
});

router.post('/game', (req, res, next) => {
  res.render('/game/:id/join');
});

module.exports = router;
