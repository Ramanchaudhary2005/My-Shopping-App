const express = require("express");
const { getUserAddress, updateUserAddress } = require("./controllers");

const usersRouter = express.Router();

usersRouter.get("/:id/address", getUserAddress);
usersRouter.put("/:id/address", updateUserAddress);

module.exports = { usersRouter };