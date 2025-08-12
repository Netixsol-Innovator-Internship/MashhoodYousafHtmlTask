const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// ======================
// Swagger definition
// ======================
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "A simple in-memory CRUD API built with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "abc123" },
            title: { type: "string", example: "Learn Express" },
            description: { type: "string", example: "Learn how to build APIs" },
            completed: { type: "boolean", example: false },
          },
        },
      },
    },
  },
  apis: ["./*.js"], // Scan this file for Swagger comments
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(bodyParser.json());

let tasksArray = [];

// app.get("/", (req, res) => {
//   res.json({
//     message: "app working",
//   });
// });

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Express
 *               description:
 *                 type: string
 *                 example: Learn how to build APIs with Express
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *       400:
 *         description: Validation error
 */
app.post("/api/tasks", (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description || !title.trim() || !description.trim()) {
    const error = new Error("Title and description are required!");
    error.status = 400;
    return next(error);
  }

  let task = {
    title,
    description,
    completed: false,
    id: Math.random().toString(36).slice(2),
  };

  tasksArray.push(task);
  console.log("tasksArray", tasksArray);

  //  success structure
  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

// ======================
// GET /api/tasks
// ======================
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found
 */

app.get("/api/tasks", (req, res, next) => {
  if (tasksArray.length === 0) {
    const error = new Error("no task to show");
    error.status = 401;
    return next(error);
  }
  res.status(201).json({
    success: true,
    message: "Tasks is in Array",
    data: tasksArray,
  });
});

// ======================
// GET /api/tasks/:id
// ======================
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */

app.get("/api/tasks/:id", (req, res, next) => {
  let taskId = req.params.id;
  const findTask = tasksArray.find((task) => task.id === taskId);

  if (!findTask) {
    const error = new Error("Couldn't find task for the provided ID");
    error.status = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Your Tasks",
    data: findTask,
  });
});

// ======================
// PUT /api/tasks/:id
// ======================
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedTitle
 *               - updatedDescription
 *             properties:
 *               updatedTitle:
 *                 type: string
 *                 example: Updated Task Title
 *               updatedDescription:
 *                 type: string
 *                 example: Updated Task Description
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 */

// for updating task
app.put("/api/tasks/:id", (req, res, next) => {
  let taskId = req.params.id;
  const findTask = tasksArray.find((task) => task.id === taskId);

  if (!findTask) {
    const error = new Error("Couldn't find task for the provided ID");
    error.status = 404;
    return next(error);
  }

  const { updatedTitle, updatedDescription } = req.body;
  if (
    !updatedTitle ||
    !updatedDescription ||
    !updatedTitle.trim() ||
    !updatedDescription.trim()
  ) {
    const error = new Error("Title and description are required!");
    error.status = 400;
    return next(error);
  }

  findTask.title = updatedTitle;
  findTask.description = updatedDescription;

  console.log("task from put", findTask);
  res.status(200).json({
    success: true,
    message: "Your task has been updated",
    data: findTask,
  });
});

// ======================
// DELETE /api/tasks/:id
// ======================
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

// for deleting task

app.delete("/api/tasks/:id", (req, res, next) => {
  let taskId = req.params.id;
  const taskIndex = tasksArray.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    const error = new Error("Couldn't find task for the provided ID");
    error.status = 404;
    return next(error);
  }
  tasksArray.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    message: "Task Deleted",
    data: tasksArray,
  });
});


/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Statistics of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tasks Information
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTask:
 *                       type: integer
 *                       example: 5
 *                     completedTask:
 *                       type: integer
 *                       example: 2
 *                     pendingTask:
 *                       type: integer
 *                       example: 3
 */


app.get("/api/stats", (req, res, next) => {
  let totalTask = tasksArray.length;
  let completedTask = 0;
  let pendingTask = totalTask;

  let data = {
    totalTask,
    completedTask,
    pendingTask,
  };

  res.status(200).json({
    success: true,
    message: "Tasks Information",
    data: data,
  });
});

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).json({
    success: false,
    message,
    data: {},
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
