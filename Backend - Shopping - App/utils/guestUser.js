const mongoose = require("mongoose");
const { UserModel } = require("../models/userSchema");

const GUEST_USER_EMAIL = process.env.GUEST_USER_EMAIL || "guest@my-shopping-app.local";
const GUEST_USER_PASSWORD = process.env.GUEST_USER_PASSWORD || "Guest@1234";
const GUEST_USER_NAME = process.env.GUEST_USER_NAME || "Guest User";

const getOrCreateGuestUser = async () => {
  const existingGuest = await UserModel.findOne({ email: GUEST_USER_EMAIL });
  if (existingGuest) {
    return existingGuest;
  }

  try {
    const createdGuest = await UserModel.create({
      email: GUEST_USER_EMAIL,
      password: GUEST_USER_PASSWORD,
      username: GUEST_USER_NAME,
    });
    return createdGuest;
  } catch (error) {
    if (error?.code === 11000) {
      const concurrentGuest = await UserModel.findOne({ email: GUEST_USER_EMAIL });
      if (concurrentGuest) {
        return concurrentGuest;
      }
    }
    throw error;
  }
};

const resolveUserByIdOrGuest = async (userId) => {
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const existingUser = await UserModel.findById(userId);
    if (existingUser) {
      return existingUser;
    }
  }

  return getOrCreateGuestUser();
};

module.exports = {
  getOrCreateGuestUser,
  resolveUserByIdOrGuest,
};
