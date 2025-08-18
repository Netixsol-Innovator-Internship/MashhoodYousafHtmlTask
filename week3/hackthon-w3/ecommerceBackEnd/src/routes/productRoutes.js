const express = require("express");

const productController = require("../controllers/productController");
const upload = require("../middlewares/multerCloudinary");
const { checkAuth, checkAdmin } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/", productController.getProducts);

// protectedRoutes
router.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.single("image"),
  productController.createProduct
);
router.get("/:id", productController.getProductsByID);
router.put("/:id", checkAuth, checkAdmin, productController.updateProducts);
router.delete("/:id", checkAuth, checkAdmin, productController.deleteProduct);

module.exports = router;
