const express = require("express");
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const photoRouter = express.Router();
const jwt = require("jsonwebtoken");

// https://stackoverflow.com/questions/53629658/include-path-and-invalid-escape-character-in-vs-code

// this website gives solution to fix file path /\ weirdness

photoRouter.get("/", async (req, res, next) => {
  try {
    const photo = await prisma.photo.findMany({});
    res.send(photo);
  } catch (error) {
    next(error);
  }
});

// Get a photos by id

photoRouter.get("/:id", async (req, res, next) => {
  try {
    const photo = await prisma.photo.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!photo) {
      return res.status(404).send("photo not found.");
    }

    res.send(photo);
  } catch (error) {
    next(error);
  }
});

// Create a new photo

photoRouter.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.id;
    const photo = await prisma.photo.create({
      data: {
        title: req.body.title,
        fileName: req.body.fileName,
        user: { connect: { id: parseInt(userId) } },
      },
    });
    res.status(201).send(photo);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Update a photo

photoRouter.put("/:id", async (req, res, next) => {
  try {
    const photo = await prisma.photo.update({
      data: {
        title: req.body.title,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!photo) {
      return res.status(404).send("photo not found.");
    }

    res.send(photo);
  } catch (error) {
    next(error);
  }
});

// Delete a photo by id

photoRouter.delete("/:id", async (req, res, next) => {
  try {
    const photo = await prisma.photo.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!photo) {
      return res.status(404).send("photo not found.");
    }

    res.send(photo);
  } catch (error) {
    next(error);
  }
});

module.exports = photoRouter;
