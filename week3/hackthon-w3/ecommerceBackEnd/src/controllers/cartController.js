const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");

const ErrorResponse = require("../utils/errorResponse");

const addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userData.userId;
  let cart;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new ErrorResponse("User not found", 404, {}, false));
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return next(new ErrorResponse("Product not found", 404, {}, false));
    }

    cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    console.log("cart", cart);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Increase quantity if already in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    console.log("itemIndex", itemIndex);

    await cart.save();
  } catch (err) {
    console.log("err", err);
    const error = new ErrorResponse(
      "Error catched while adding to cart",
      500,
      { err },
      false
    );
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });
};
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userData.userId }).populate(
      "items.product"
    );

    if (!cart) {
      const error = new ErrorResponse(
        "Seems like cart is Empty",
        400,
        {},
        false
      );
      return next(error);
    }
    console.log("cart in get", cart);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    return next(new ErrorResponse("Failed to fetch cart", 500, {}, false));
  }
};
const updateQuantity = async (req, res, next) => {
  const userId = req.userData.userId;
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    return next(
      new ErrorResponse("Invalid product or quantity", 400, {}, false)
    );
  }

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return next(new ErrorResponse("Cart not found", 404, {}, false));

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new ErrorResponse("Item not in cart", 404, {}, false));
    }
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: cart,
    });
  } catch (err) {
    return next(new ErrorResponse("Server error", 500, err));
  }
};

const removeFromCart = async (req, res, next) => {
  const userId = req.userData.userId;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      const error = new ErrorResponse(
        "Seems Like Cart is empty or cart not present",
        400,
        {},
        false
      );
      return next(error);
    }

    const productExists = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!productId || !productExists) {
      const error = new ErrorResponse(
        "No Product to Remove, product not exists",
        400,
        {},
        false
      );
      return next(error);
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item Removed From Cart",
      data: cart,
    });

    // console.log('cart from remove ', cart)
  } catch (err) {
    const error = new ErrorResponse(
      "error catched while removing Item",
      500,
      { err },
      false
    );
    return next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
};
