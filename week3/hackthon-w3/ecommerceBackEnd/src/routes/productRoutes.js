const express = require("express");

const productController = require("../controllers/productController");
const upload = require("../middlewares/multerCloudinary");
const checkToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/stats", productController.getStats);
router.get("/", productController.getProducts);

// protectedRoutes
router.post("/", upload.single("image"), productController.createProduct);
router.get("/:id",  productController.getProductsByID);
router.put("/:id",  productController.updateProducts);
router.delete("/:id",  productController.deleteProduct);

module.exports = router;
