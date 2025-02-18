import passport from "passport";

// Twitter OAuth Routes
export const twitterAuth = passport.authenticate("twitter");

export const twitterAuthCallback = (req, res) => {
  passport.authenticate("twitter", { session: false }, (err, data) => {
    if (err || !data) {
      console.error("Twitter callback error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/login`);
      return res.status(401).json({
        success: false,
        message: err?.message || "Twitter authentication failed",
        error: err?.toString(),
      });
    }

    if (!data.token) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);

      return res.status(500).json({
        success: false,
        message: "Authentication token generation failed",
      });
    }

    // Successful authentication
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
