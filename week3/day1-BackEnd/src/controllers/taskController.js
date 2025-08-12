const Task = require("../models/taskSchema");

const createTask = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description || !title.trim() || !description.trim()) {
    const error = new Error("Title and description are required");
    error.status = 404;
    return next(error);
  }

  const createdTask = new Task({
    task: title,
    description,
    completed: false,
    // creator: req.userData?.userId || null,
  });

  try {
    await createdTask.save();
  } catch (err) {
    console.error("Error while saving task:", err);
    const error = new Error("Error while creating task");
    error.status = 500;
    return next(error);
  }
  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: createdTask,
  });
};

const getTask = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();
    if (tasks.length == 0) {
      const error = new Error("zero tasks is in db");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    const error = new Error("error while getting task, server error");
    error.status = 500;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Total Tasks ",
    data: tasks,
  });
};

const getTaskByID = async (req, res, next) => {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error("Can't find task by Provided ID");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching task by ID:", err);
    const error = new Error("no task found");
    error.status = 500;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Task for provided ID",
    data: task,
  });
};

const updateTask = async (req, res, next) => {
  const { updatedTitle, updatedDescription } = req.body;

  if (
    !updatedTitle ||
    !updatedDescription ||
    !updatedTitle.trim() ||
    !updatedDescription.trim()
  ) {
    const error = new Error("Title and description are required");
    error.status = 404;
    return next(error);
  }
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      return next(error);
    }

    task.task = updatedTitle;
    task.description = updatedDescription;
    // if (typeof completed === "boolean") task.completed = completed;

    await task.save();
  } catch (err) {
    console.error("Error updating task:", err);
    const error = new Error("Error while updating task");
    error.status = 500;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
};

const deleteTask = async (req, res, next) => {
  let deletedTask;
  try {
    deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      const error = new Error("Can't find task for provided ID");
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    const error = new Error("Error while deleting task");
    error.status = 500;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask,
  });
};

const getStats = async (req, res, next) => {
  let totalTask;
  let completedTask;
  let pendingTask;
  try {
    totalTask = await Task.countDocuments();
    completedTask = 0;
    pendingTask = totalTask;

    if (totalTask === 0) {
       const error = new Error("no task to show");
       error.status = 404;
       return next(error);
    }
  } catch (err) {
    // console.error("Error fetching stats:", err);
    const error = new Error("error while showing stats");
    error.status = 500;
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Task stats",
    data: { totalTask, completedTask, pendingTask },
  });
};

module.exports = {
  createTask,
  getTask,
  getTaskByID,
  updateTask,
  deleteTask,
  getStats,
};
