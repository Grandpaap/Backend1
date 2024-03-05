const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all video calls
router.get("/", async (req, res, next) => {
  try {
    const videoCalls = await prisma.videoCall.findMany({});
    res.send(videoCalls);
  } catch (error) {
    next(error);
  }
});

// Get a video call by ID
router.get("/:id", async (req, res, next) => {
  try {
    const videoCall = await prisma.videoCall.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!videoCall) {
      return res.status(404).send("Video call not found.");
    }

    res.send(videoCall);
  } catch (error) {
    next(error);
  }
});

// Create a new video call
router.post("/", async (req, res, next) => {
  try {
    const { startTime, endTime, participants } = req.body;

    const videoCall = await prisma.videoCall.create({
      data: {
        startTime,
        endTime,
        participants: {
          connect: participants.map((id) => ({ id: parseInt(id) })),
        },
      },
    });

    res.status(201).send(videoCall);
  } catch (error) {
    next(error);
  }
});

// Delete a video call
router.delete("/:id", async (req, res, next) => {
  try {
    const videoCall = await prisma.videoCall.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!videoCall) {
      return res.status(404).send("Video call not found.");
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
