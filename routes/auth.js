'use strict';

const express = require('express');
const passport = require('passport');
const bcrypt = require("bcrypt");
const ensureLogin = require("connect-ensure-login");
const router = express.Router();

const User = require("../models/user").User;

const bcryptSalt = 10;

// router.use((req, res, next) => {
//     if (req.user) {
//       res.send("NICE!"); //@todo REPLACE WITH /GAME PAGE
//       return;
//     }
//     next();
//   });

//-- login

router.get("/login", function(req, res, next) {
    const data = {
      message: req.flash("error")
    };
    res.render("auth/login", data);
  });
  
  router.post("/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
      passReqToCallback: true
    })
  );

/* GET home page. */
router.get('/signup', function (req, res, next) {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === ' || password === ') {
      const data = {
        message: 'Please provide username and password'
      };
      res.render('auth/signup', data);
      return;
    }
  
    User.findOne({ username }, 'username', (err, user) => {
      if (err) {
        next(err);
        return;
      }
  
      if (user) {
        const data = {
          message: 'The username already exists'
        };
        res.render('auth/signup', data);
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const newUser = new User({
        username,
        password: hashPass
      });
  
      newUser.save(err => {
        if (err) {
          next(err);
          return;
        }
  
        req.login(newUser, () => {
          res.redirect('/');
        });
      });
    });
  });

router.get('/test', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('games', { user: req.user });
  });

module.exports = router;
