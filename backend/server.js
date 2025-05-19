import express from "express";
import cors from "cors";
import 'dotenv/config';
import { connect } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import articleRouter from "./routes/articles.js";
import "./auth/googleAuth.js";

const port = process.env.PORT;
const allowedOrigins = [process.env.CLIENT_URL];

// middleware
const app = express();

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
};
await connectDB();

// Session middleware using MongoStore for production-safe sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretHere',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
}));

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/articles", articleRouter);

// OAuth routes (add these)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: process.env.CLIENT_URL || 'http://localhost:3000',
  }));

// Endpoint to get current user info
app.get('/auth/user', (req, res) => {
  res.send(req.user || null);
});

// Logout endpoint
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(port, () => {
  console.log(`Final app listening on port ${port}`);
});
