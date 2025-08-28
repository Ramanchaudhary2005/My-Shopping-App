const express = require("express");
const { productRouter } = require("./products/routes");
const { authRouter } = require("./auth/routes");
const { otpRouter } = require("./otps/routes");
const { cartRouter } = require("./cart/routes");
const { orderRouter } = require("./orders/routes");
const { usersRouter } = require("./users/routes");
const { wishlistRouter } = require("./wishlist/routes");


const apiRouter = express.Router();

apiRouter.use("/products", productRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/otps", otpRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/wishlist", wishlistRouter);


module.exports = { apiRouter };