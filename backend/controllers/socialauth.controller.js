import passport from "passport";
// import TwitterStrategy from "passport-twitter";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// import dotenv from "dotenv";

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token
// const generateToken = (userId) =>
//   jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });

// // Twitter OAuth Configuration
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: process.env.TWITTER_CALLBACK_URL,
//       includeEmail: true, // Ensure email is included
//     },
//     async (token, tokenSecret, profile, done) => {
//       try {
//         if (!profile || !profile.id || !profile.username) {
//           return done(new Error("Invalid Twitter profile data"), null);
//         }

//         let user = await User.findOne({ twitterId: profile.id });

//         if (!user) {
//           const email =
//             profile.emails?.[0]?.value || `${profile.username}@twitter.com`;
//           user = new User({
//             username: profile.username,
//             email: email,
//             twitterId: profile.id,
//             profileImage: profile.photos?.[0]?.value || "",
//           });
//           await user.save();
//         }

//         return done(null, { user, token: generateToken(user._id) });
//       } catch (error) {
//         console.error("Twitter authentication error:", error);
//         return done(new Error("Failed to authenticate with Twitter"), null);
//       }
//     }
//   )
// );

// // Google OAuth Configuration
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//       passReqToCallback: true,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ email: profile.email });

//         if (!user) {
//           user = new User({
//             username: profile.displayName,
//             email: profile.emails ? profile.emails[0].value : null,
//             googleId: profile.id,
//             profileImage: profile.photos[0].value,
//           });
//           await user.save();
//         }

//         return done(null, { user, token: generateToken(user._id) });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// // Facebook OAuth Configuration
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["id", "displayName", "emails", "photos"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ facebookId: profile.id });

//         if (!user) {
//           user = new User({
//             username: profile.displayName,
//             email: profile.emails ? profile.emails[0].value : null,
//             facebookId: profile.id,
//             profileImage: profile.photos[0].value,
//           });
//           await user.save();
//         }

//         return done(null, { user, token: generateToken(user._id) });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// Twitter OAuth Routes
export const twitterAuth = passport.authenticate("twitter");
export const twitterAuthCallback = (req, res) => {
  passport.authenticate("twitter", { session: false }, (err, data) => {
    console.log("check dt twiii", data);

    if (err || !data) {
      console.error("Twitter callback error:", err);
      return res.status(401).json({
        success: false,
        message: err?.message || "Twitter authentication failed",
        error: err?.toString(),
      });
    }

    if (!data.token) {
      return res.status(500).json({
        success: false,
        message: "Authentication token generation failed",
      });
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${data.token}`
    );
  })(req, res);
};

// Google OAuth Routes
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
export const googleAuthCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      console.error("Google callback error:", err);
      return res.status(401).json({
        success: false,
        message: err?.message || "Google authentication failed",
        error: err?.toString(),
      });
    }

    if (!data.token) {
      return res.status(500).json({
        success: false,
        message: "Authentication token generation failed",
      });
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${data.token}`
    );
  })(req, res);
};

// Facebook OAuth Routes
export const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});
export const facebookAuthCallback = (req, res) => {
  passport.authenticate("facebook", { session: false }, (err, data) => {
    if (err || !data) {
      console.error("Facebook callback error:", err);
      return res.status(401).json({
        success: false,
        message: err?.message || "Facebook authentication failed",
        error: err?.toString(),
      });
    }

    if (!data.token) {
      return res.status(500).json({
        success: false,
        message: "Authentication token generation failed",
      });
    }

    res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${data.token}`
    );
  })(req, res);
};
