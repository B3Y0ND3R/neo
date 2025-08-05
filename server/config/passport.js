// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 

passport.use(
  new GoogleStrategy(
    {
      clientID: '496428436631-st1fhj1ri7hugidg83tbjfsf9c96tb5t.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user with userName based on email
          const userName = `google_${profile.emails[0].value.split('@')[0]}`;
          user = new User({
            googleId: profile.id,
            userName: userName,
            email: profile.emails[0].value,
            role: 'user'
          });
          await user.save();
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId, add it
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, {
          id: user._id,
          name: user.userName,
          email: user.email,
          role: user.role,
          accessToken: accessToken
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || false); 
  } catch (error) {
    done(error, false); 
  }
});

