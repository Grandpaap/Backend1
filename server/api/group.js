const express = require("express");
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const groupRouter = express.Router();

// Get all groups

groupRouter.get("/", async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: true,
        messages: true,
      },
    });
    res.json(groups);
  } catch (error) {
    next(error);
  }
});

// Get a group by ID

groupRouter.get("/:id", async (req, res, next) => {
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        members: true,
        messages: true,
      },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.json(group);
  } catch (error) {
    next(error);
  }
});

// Create a new group

groupRouter.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await prisma.group.create({
      data: {
        name,
      },
    });
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
});

// Update a group

groupRouter.put("/:id", async (req, res, next) => {
  try {
    const { name } = req.body;
    const group = await prisma.group.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        name,
      },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.json(group);
  } catch (error) {
    next(error);
  }
});

// Delete a group by ID

groupRouter.delete("/:id", async (req, res, next) => {
  try {
    const group = await prisma.group.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.json(group);
  } catch (error) {
    next(error);
  }
});

module.exports = groupRouter;
