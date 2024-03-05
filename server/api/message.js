const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Get all messages

router.get("/", async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({});
    res.send(messages);
  } catch (error) {
    next(error);
  }
});

// Get a message by ID

router.get("/:id", async (req, res, next) => {
  try {
    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!message) {
      return res.status(404).send("Message not found.");
    }

    res.send(message);
  } catch (error) {
    next(error);
  }
});

// Create a new message

router.post("/", async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'secret');
        const senderId = decoded.id;
        const { recipientId, content } = req.body;

      const message = await prisma.message.create({
        data: {
          sender: { connect: { id: parseInt(senderId) } }, 
          recipient: { connect: { id: parseInt(recipientId) } },
          content,
        },
      });
  
      res.status(201).send(message);
    } catch (error) {
        console.error(error);
      next(error);
    }
  });

// Delete a message by ID

router.delete("/:id", async (req, res, next) => {
  try {
    const message = await prisma.message.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!message) {
      return res.status(404).send("Message not found.");
    }

    res.send(message);
  } catch (error) {
    next(error);
  }
});

module.exports = router;