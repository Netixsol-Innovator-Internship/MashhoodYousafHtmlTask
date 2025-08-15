const mongoose = require("mongoose");
const Products = require("../models/productSchema");
const ErrorResponse = require("../utils/errorResponse");
// const User = require("../models/userSchema");

const createProduct = async (req, res, next) => {
  const { name, description, price } = req.body;

  if (
    name.trim().length < 3 ||
    description.trim().length < 7 ||
    !price ||
    Number(price) < 100 ||
    Number(price) > 10000
  ) {
    const error = new ErrorResponse(
      "Invalid input: name must be at least 3 chars, description at least 7 chars, and  price must be between 100 and 10000",
      400,
      {},
      false
    );
    return next(error);
  }
  if (!req.file) {
    const error = new ErrorResponse("Image is required", 400, {}, false);
    return next(error);
  }
  console.log("req.file ==> ", req.file);

  const createdProduct = new Products({
    name,
    description,
    price,
    image: req.file.path,
  });

  try {
    let existingProduct = await Products.findOne({ name });

    if (existingProduct) {
      const error = new ErrorResponse(
        "user different name , this product is already exists",
        404,
        existingProduct,
        false
      );
      return next(error);
    }

    await createdProduct.save();
  } catch (err) {
    console.error("Error while saving task:", err);
    const error = new ErrorResponse(
      "Error while creating product",
      500,
      {},
      false
    );
    return next(error);
  }

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: createdProduct,
  });
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
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
 *                   example: Total Tasks
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found
 *       500:
 *         description: Server error
 */

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Products.find();
    if (products.length == 0) {
      const error = new ErrorResponse("zero products is in db", 404, {}, false);
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    const error = new ErrorResponse(
      "error catched getting task, server error",
      500,
      { err },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Total products data",
    data: products,
  });
};

/**
 * @swagger
 * /api/tasks/user:
 *   get:
 *     summary: Get tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks belonging to the authenticated user
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
 *                   example: Task for provided user
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       404:
 *         description: No tasks found for this user
 *       500:
 *         description: Server error
 */

const getProductsByID = async (req, res, next) => {
  const productId = req.params.id;
  let product;
  try {
    product = await Products.findById(productId);
    if (!product) {
      const error = new ErrorResponse("no product found", 404, {}, false);
      return next(error);
    }
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    const error = new ErrorResponse(
      "error Catched while getting product by Id",
      500,
      { err },
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Task for provided ID",
    data: product,
  });
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a product by ID (only if you are the creator)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedName
 *               - updatedDescription
 *             properties:
 *               updatedTitle:
 *                 type: string
 *                 example: "Buy groceries and cleaning supplies"
 *               updatedDescription:
 *                 type: string
 *                 example: "Milk, eggs, bread, soap"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error while updating task
 */

const updateProducts = async (req, res, next) => {
  const { updatedName, updatedDescription, updatedPrice } = req.body;

  if (!updatedName.trim() || !updatedDescription.trim()) {
    const error = new ErrorResponse(
      "Name and description is required",
      404,
      {},
      false
    );
    return next(error);
  }
  if (
    !updatedPrice ||
    Number(updatedPrice) < 100 ||
    Number(updatedPrice) > 10000
  ) {
    const error = new ErrorResponse(
      "The price must be between 100 and 10000",
      400,
      {},
      false
    );
    return next(error);
  }

  let product;
  try {
    product = await Products.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found", 404, {}, false);
      return next(error);
    }

    product.name = updatedName;
    product.description = updatedDescription;
    product.price = updatedPrice;

    await product.save();
  } catch (err) {
    console.error("Error updating task:", err);
    const error = new ErrorResponse(
      "Error while updating task",
      500,
      {},
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Products updated successfully",
    data: product,
  });
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID (only if you are the creator)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Products ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error while deleting task
 */

const deleteProduct = async (req, res, next) => {
  let deletedProduct;
  try {
    deletedProduct = await Products.findById(req.params.id);
    if (!deletedProduct) {
      const error = new ErrorResponse(
        "No product for provided ID",
        400,
        {},
        false
      );
      return next(error);
    }

    // if (deletedProduct.id !== req.userData.userId) {
    //   const error = new Error(
    //     "You are not allowed ( Authorized ) to delete this task"
    //   );
    //   error.status = 401;
    //   return next(error);
    // }

    await deletedProduct.deleteOne();

  } catch (err) {
    console.error("Error deleting task:", err);
    const error = new ErrorResponse(
      "Error while deleting task",
      500,
      {},
      false
    );
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
};

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics (total, completed, pending)
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task statistics
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
 *                   example: Task stats
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTask:
 *                       type: integer
 *                       example: 10
 *                     completedTask:
 *                       type: integer
 *                       example: 3
 *                     pendingTask:
 *                       type: integer
 *                       example: 7
 *       404:
 *         description: No tasks to show
 *       500:
 *         description: Error fetching stats
 */
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
  createProduct,
  getProducts,
  getProductsByID,
  updateProducts,
  deleteProduct,
  getStats,
};
