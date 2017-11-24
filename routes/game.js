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
  Game.find({}, (error, games) => {
    let data = [];
    let currentMonth = new Date().getMonth();
    let currentDay = new Date().getDate();
    let currentHour = new Date().getHours();

    games.forEach(function (game) {
      console.log(game.startTime);
      console.log(game.startTime.getDay());
      let gameHour = game.startTime.getHours();
      let gameDay = game.startTime.getDate();
      let gameMonth = game.startTime.getMonth();

      if (game.state === 'Coming Up') {
        if (gameMonth < currentMonth) {
          game.state = 'Ended';
          game.save((err) => { if (err) { next(err); } });
          console.log(game, 'ENDED BECAUSE OF MONTH!');
        } else if (gameMonth === currentMonth) {
          if (gameDay < currentDay) {
            game.state = 'Ended';
            game.save((err) => { if (err) { next(err); } });
            console.log(game, 'ENDED BECAUSE OF DAY!');
          } else if (gameDay === currentDay) {
            if (gameHour < currentHour) {
              game.state = 'Ended';
              game.save((err) => { if (err) { next(err); } });
              console.log(game, 'ENDED BECAUSE OF HOUR!');
            } else {
              data.push(game);
            }
          } else {
            data.push(game);
          }
        } else {
          data.push(game);
        }
      }
    });

    if (error) {
      console.log('error', error);
      res.status(500).json({ error: 'FUUUUUUU!' });
    } else {
      res.json(data);
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
      game.playersNeeded += 1;
    } else if (game.playersNeeded > 0) {
      game.playersAttending.push(req.user._id);
      game.playersNeeded -= 1;
    } else {
      console.log('Bro its full');
    }
    game.save(error => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    });
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

function _dateFormatedHour (date) {
  var arrWithDateAndHour = date.split('T');
  var hour = _getHour(arrWithDateAndHour[1]);

  return hour;
}

function _dateFormatedDay (date) {
  var arrWithDateAndHour = date.split('T');
  var day = _getDay(arrWithDateAndHour[0]);

  return day;
}

function _dateFormatedMonth (date) {
  var arrWithDateAndHour = date.split('T');
  var month = _getMonth(arrWithDateAndHour[0]);

  return month;
}
function _getMonth (date) {
  // pre:- format of date AAAA-MM-DD
  return date.split('-')[1];
}

function _getDay (date) {
  // pre:- format of date AAAA-MM-DD
  return date.split('-')[2];
}

function _getHour (date) {
  return date.split(':')[0];
}

function _getMinutes (date) {
  return date.split(':')[1];
}

module.exports = router;
