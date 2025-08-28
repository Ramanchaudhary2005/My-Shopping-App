const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist, moveToCart } = require("./controllers");

const wishlistRouter = express.Router();

wishlistRouter.get('/', getWishlist);
wishlistRouter.post('/', addToWishlist);
wishlistRouter.delete('/:id', removeFromWishlist);
wishlistRouter.post('/:id/move-to-cart', moveToCart);

module.exports = { wishlistRouter };


