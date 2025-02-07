import passport from "passport";
import TwitterStrategy from "passport-twitter-oauth2";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// 🔹 Generate JWT Token
const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

// 🔹 Twitter OAuth Configuration
passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      scope: ["tweet.read", "users.read", "offline.access"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          user = new User({
            username: profile.username,
            email: profile.emails ? profile.emails[0].value : null,
            twitterId: profile.id,
            profileImage: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, { user, token: generateToken(user._id) });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 Google OAuth Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, { user, token: generateToken(user._id) });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 Facebook OAuth Configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            facebookId: profile.id,
            profileImage: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, { user, token: generateToken(user._id) });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 Twitter OAuth Routes
export const twitterAuth = passport.authenticate("twitter");
export const twitterAuthCallback = (req, res) => {
  passport.authenticate("twitter", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Twitter authentication failed" });
    }
    res.redirect(`${PORT}/login-success?token=${data.token}`);
  })(req, res);
};

// 🔹 Google OAuth Routes
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
export const googleAuthCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    res.redirect(`${PORT}/login-success?token=${data.token}`);
  })(req, res);
};

// 🔹 Facebook OAuth Routes
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });
export const facebookAuthCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Facebook authentication failed" });
    }
    res.redirect(`${PORT}/login-success?token=${data.token}`);
  })(req, res);
};
