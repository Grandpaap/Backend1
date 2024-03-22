const router = require("express").Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const axios = require("axios");

//user register

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const userWithId = { ...user, userId: user.id };

    console.log("New user created:", userWithId);

    res.status(201).json({ user: userWithId });
  } catch (error) {
    next(error);
  }
});

//user login

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid login credentials.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id || undefined,
        email: req.user?.email,
      },
    });
   
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
