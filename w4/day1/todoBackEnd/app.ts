// src/server.ts
const express = require("express");
const cors = require("cors");
import type { Request, Response } from "express";
import type { Task } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

let tasks: Task[] = [];
let randomId = 100;

// GET all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST new task
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask: Task = { id: randomId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT toggle task complete/incomplete
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); //   type-safety
  const task = tasks.find((task) => task.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); //   type-safety
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

const PORT = 8000;
app.listen(PORT, () =>
  console.log(`app is  running on port :${PORT}`)
);
