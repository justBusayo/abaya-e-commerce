import passport from "passport";
import TwitterStrategy from "passport-twitter-oauth1";

import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token
const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

// Twitter OAuth Configuration
passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      scope: ["tweet.read", "users.read", "offline.access"],
      includeEmail: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if profile has required data
        if (!profile || !profile.id || !profile.username) {
          return done(new Error("Invalid Twitter profile data"), null);
        }

        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          // Validate email availability
          const email = profile.emails?.[0]?.value || `${profile.username}@twitter.com`;
          
          user = new User({
            username: profile.username,
            email: email,
            twitterId: profile.id,
            profileImage: profile.photos?.[0]?.value || '',
          });
          await user.save();
        }

        return done(null, { user, token: generateToken(user._id) });
      } catch (error) {
        console.error("Twitter authentication error:", error);
        return done(new Error("Failed to authenticate with Twitter. Please try again."), null);
      }
    }
  )
);

// Google OAuth Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
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

// Facebook OAuth Configuration
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

// Twitter OAuth Routes
export const twitterAuth = passport.authenticate("twitter");
export const twitterAuthCallback = (req, res) => {
  passport.authenticate("twitter", { session: false }, (err, data) => {
    if (err || !data) {
      const errorMessage = err?.message || "Twitter authentication failed";
      return res.status(401).json({ 
        success: false,
        message: errorMessage,
        error: err?.toString() 
      });
    }
    
    // Validate token before redirect
    if (!data.token) {
      return res.status(500).json({
        success: false,
        message: "Authentication token generation failed"
      });
    }

    res.redirect(`${process.env.FRONTEND_URL || PORT}/login-success?token=${data.token}`);
  })(req, res);
};

// Google OAuth Routes
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
export const googleAuthCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    res.redirect(`${PORT}/login-success?token=${data.token}`);
  })(req, res);
};

// Facebook OAuth Routes
export const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });
export const facebookAuthCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Facebook authentication failed" });
    }
    res.redirect(`${PORT}/login-success?token=${data.token}`);
  })(req, res);
};
