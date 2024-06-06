//pour stratigie de jwt 
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Configuration de la stratégie JWT pour authentifier les utilisateurs with library passport 
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "1234567"; //cle secrete la meme que login 

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
      const user = await User.findById(jwt_payload._id);
      if (!user) {
          return done(null, false);
      }
      return done(null, user);
  } catch (error) {
      return done(error, false);
  }
}));

module.exports = passport;