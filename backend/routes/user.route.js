import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  getAuthenticatedUser,
  protectedRoute,
  logoutUser,
} from "../controllers/user.controller.js";
import {
  twitterAuth,
  twitterAuthCallback,
} from "../controllers/socialauth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getAuthenticatedUser);
router.get("/", getUser);
router.get("/protected-route", protectedRoute);
router.post("/logout", logoutUser);

// social login
// Route to start Twitter authentication
router.get("/twitter", twitterAuth);

// Twitter callback route
router.get("/twitter/callback", twitterAuthCallback);

export default router;
