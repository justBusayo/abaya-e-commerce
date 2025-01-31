import passport from "passport";
import TwitterStrategy from "passport-twitter-oauth2";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 🔹 Twitter OAuth Redirect
export const twitterAuth = passport.authenticate("twitter");

// 🔹 Twitter OAuth Callback
export const twitterAuthCallback = (req, res) => {
  passport.authenticate("twitter", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Twitter authentication failed" });
    }
    res.redirect(`http://localhost:5173/login-success?token=${data.token}`);
  })(req, res);
};
