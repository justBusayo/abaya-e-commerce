import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import session from "express-session"; // ✅ Add express-session
import passport from "passport"; // ✅ Import Passport
import "./config/passport.js"; // ✅ Ensure passport strategies are loaded

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// 🔹 Add session middleware (required for Twitter OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to `true` if using HTTPS
  })
);

// 🔹 Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist"))); // static assets

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
