const mongoose = require("mongoose");
const Task = require("../models/taskSchema");
const User = require("../models/userSchema");

const createTask = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description || !title.trim() || !description.trim()) {
    const error = new Error("Title and description are required");
    error.status = 400;
    return next(error);
  }

  const createdTask = new Task({
    task: title,
    description,
    completed: false,
    creatorUser: req.userData.userId,
  });

  let transactionSession;
  try {
    let user = await User.findById(req.userData.userId);

    if (!user) {
      const error = new Error("user not found with the provided ID");
      error.status = 404;
      return next(error);
    }

    transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();

    await createdTask.save({ session: transactionSession });
    user.tasks.push(createdTask);
    await user.save({ session: transactionSession });
    await transactionSession.commitTransaction();
  } catch (err) {
    console.error("Error while saving task:", err);
    const error = new Error("Error while creating task");
    error.status = 500;
    return next(error);
  } finally {
    transactionSession.endSession();
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
    task = await Task.find({ creatorUser: req.userData.userId });
    if (!task || task.length === 0) {
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

    if (task.creatorUser.toString() !== req.userData.userId) {
      const error = new Error(
        "You are not allowed ( Authorized ) to update this task"
      );
      error.status = 401;
      return next(error);
    }

    task.task = updatedTitle;
    task.description = updatedDescription;

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
  let deleteSession;
  try {
    deletedTask = await Task.findById(req.params.id).populate("creatorUser");
    if (!deletedTask) {
      const error = new Error("Can't find task for provided ID");
      error.status = 404;
      return next(error);
    }

    if (deletedTask.creatorUser.id !== req.userData.userId) {
      const error = new HttpError(
        "You are not allowed ( Authorized ) to delete this task",
        401
      );
      return next(error);
    }

    deleteSession = await mongoose.startSession();
    deleteSession.startTransaction();
    await deletedTask.deleteOne({ session: deleteSession });
    deletedTask.creatorUser.tasks.pull(deletedTask);

    await deletedTask.creatorUser.save({ session: deleteSession });
    await deleteSession.commitTransaction();
  } catch (err) {
    console.error("Error deleting task:", err);
    const error = new Error("Error while deleting task");
    error.status = 500;
    return next(error);
  } finally {
    await deleteSession.endSession();
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
