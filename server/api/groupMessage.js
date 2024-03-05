const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all group messages

router.get("/", async (req, res, next) => {
  try {
    const groupMessages = await prisma.groupMessage.findMany({});
    res.send(groupMessages);
  } catch (error) {
    next(error);
  }
});

// Get a group message by ID /// should change to by groupid???????????

router.get("/:id", async (req, res, next) => {
  try {
    const groupMessage = await prisma.groupMessage.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!groupMessage) {
      return res.status(404).send("Group message not found.");
    }

    res.send(groupMessage);
  } catch (error) {
    next(error);
  }
});

// Create a new group message

router.post("/", async (req, res, next) => {
  try {
    const { senderId, groupId, content } = req.body;
    console.log("senderId:", senderId);
    console.log("groupId:", groupId);
    const groupMessage = await prisma.groupMessage.create({
      data: {
        sender: { connect: { id: parseInt(senderId) } },
        group: { connect: { id: parseInt(groupId) } },
        content,
      },
    });

    res.status(201).send(groupMessage);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Update a group message

router.put("/:id", async (req, res, next) => {
  try {
    const groupMessage = await prisma.groupMessage.update({
      data: {
        content: req.body.content,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!groupMessage) {
      return res.status(404).send("Group message not found.");
    }

    res.send(groupMessage);
  } catch (error) {
    next(error);
  }
});

// Delete a group message

router.delete("/:id", async (req, res, next) => {
  try {
    const groupMessage = await prisma.groupMessage.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!groupMessage) {
      return res.status(404).send("Group message not found.");
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
