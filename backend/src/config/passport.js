const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../models'); // Update with the correct path to your User model

const localOptions = { usernameField: 'username', passwordField: 'password' };

const localLogin = new LocalStrategy(localOptions, async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    // Replace the following with your method for password validation
    const isMatch = await user.validatePassword(password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET // Make sure to define this in your .env file
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id);
    
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);
