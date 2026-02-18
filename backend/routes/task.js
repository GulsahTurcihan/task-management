/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /task -> list
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error?.message,
    });
  }
});

// GET /task/:id get one

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to fetch task", error: error?.message });
  }
});

// POST /task -> create
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "name is required" });
    }

    const task = await Task.create({
      name: name.trim(),
      completed: false,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error?.message,
    });
  }
});

// PUT task/:id update

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;

    const update = {};

    if (typeof name === "string") {
      const trimmed = name.trim();

      if (!trimmed) {
        return res.status(400).json({ message: "name cannot be empty" });
      }

      update.name = trimmed;
    }

    if (typeof completed === "boolean") {
      update.completed = completed;
    }

    const task = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error?.message,
    });
  }
});

// DELETE /task/:id

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ message: "task not found" });

    res.json({ ok: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to delete task", error: error.message });
  }
});

module.exports = router;
