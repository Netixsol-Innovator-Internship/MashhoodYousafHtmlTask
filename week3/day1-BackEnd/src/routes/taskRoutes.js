const express = require("express");
const router = express.Router();

// const = require("../middlewares/verifyToken");
const taskController = require("../controllers/taskController");

router.post("/", taskController.createTask);
router.get("/", taskController.getTask);
router.get("/stats", taskController.getStats);
router.get("/:id", taskController.getTaskByID);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
