const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add user to group

router.post("/", async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;

    const groupMembership = await prisma.groupMembership.create({
      data: {
        user: { connect: { id: parseInt(userId) } },
        group: { connect: { id: parseInt(groupId) } }
      },
    });

    res.status(201).json(groupMembership);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Remove user from group

router.delete("/userId", async (req, res, next) => {
  try {
    const { groupId, userId } = req.params;

    await prisma.groupMembership.deleteMany({
      where: {
        groupId: parseInt(groupId),
        userId: parseInt(userId),
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

//get all group membership

router.get("/", async (req, res, next) => {
  try {
    const groupMembership = await prisma.groupMembership.findMany({

    });
    res.send(groupMembership);
  } catch (error) {
    next(error);
  }
});

//get membership should change to by group id

router.get("/:id", async (req, res, next) => {
  try {
    const groupMembership = await prisma.groupMembership.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!groupMembership) {
      return res.status(404).send("groupMembership not found.");
    }

    res.send(groupMembership);
  } catch (error) {
    next(error);
  }
});

module.exports = router;