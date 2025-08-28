const express = require("express");
const { getUserAddress, updateUserAddress, getProfile, updateProfile, listAddresses, addAddress, updateAddress, deleteAddress } = require("./controllers");

const usersRouter = express.Router();

usersRouter.get("/:id/address", getUserAddress);
usersRouter.put("/:id/address", updateUserAddress);
usersRouter.get("/:id/profile", getProfile);
usersRouter.put("/:id/profile", updateProfile);
usersRouter.get("/:id/addresses", listAddresses);
usersRouter.post("/:id/addresses", addAddress);
usersRouter.put("/:id/addresses/:addressId", updateAddress);
usersRouter.delete("/:id/addresses/:addressId", deleteAddress);

module.exports = { usersRouter };