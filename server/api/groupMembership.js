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

//get membership should change to by group id posible change again later to make one call betweein all members and one

router.get("/:id", async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    const userId = decoded.id;
    const groupMembership = await prisma.groupMembership.findFirst({
      where: {
        userId: { connect: { id: parseInt(userId) } },
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