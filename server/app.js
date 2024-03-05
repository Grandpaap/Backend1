const path = require("path");
const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const bcrypt = require("bcrypt");

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "client/dist")));
app.use(cors());

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  try {
    if (token) {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } else {
      req.user = null;
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    // req.user = null;
  }
  next();
});

// Backend Routes

app.use("/auth", require("./auth"));
app.use("/api", require("./api"));

// Protect API routes with JWT verification middleware

app.use(
  "/auth",
  (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    next();
  },
  require("./auth")
);

app.use(
  "/api",
  (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    next();
  },
  require("./api")
);

// Serves the HTML file that Vite builds
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Not found.");
});
module.exports = app;
