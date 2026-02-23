const { resolveUserByIdOrGuest } = require("../../../utils/guestUser");

const getUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await resolveUserByIdOrGuest(id);
    return res.status(200).json({ success: true, data: user.address || {} });
  } catch (err) {
    console.error("getUserAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to fetch address" });
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = req.body || {};
    const user = await resolveUserByIdOrGuest(id);

    user.address = {
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India",
    };
    user.updatedAt = new Date();
    await user.save();

    return res.status(200).json({ success: true, message: "Address saved", data: user.address });
  } catch (err) {
    console.error("updateUserAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to save address" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await resolveUserByIdOrGuest(id);
    const profile = {
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
      paymentPreference: user.paymentPreference || "cash_on_delivery",
      addresses: user.addresses || [],
      address: user.address || {},
    };
    return res.status(200).json({ success: true, data: profile });
  } catch (err) {
    console.error("getProfile error", err);
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone, avatarUrl, paymentPreference } = req.body;
    const allowedPrefs = ["credit_card", "debit_card", "paypal", "cash_on_delivery"];

    if (paymentPreference && !allowedPrefs.includes(paymentPreference)) {
      return res.status(400).json({ success: false, message: "Invalid payment preference" });
    }

    const user = await resolveUserByIdOrGuest(id);

    if (username !== undefined) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (paymentPreference !== undefined) user.paymentPreference = paymentPreference;
    user.updatedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: {
        email: user.email,
        username: user.username,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        paymentPreference: user.paymentPreference,
      },
    });
  } catch (err) {
    console.error("updateProfile error", err);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

const listAddresses = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await resolveUserByIdOrGuest(id);
    return res.status(200).json({ success: true, data: user.addresses || [] });
  } catch (err) {
    console.error("listAddresses error", err);
    return res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

const addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = req.body || {};
    const user = await resolveUserByIdOrGuest(id);
    const newAddr = {
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    };
    if (newAddr.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }
    user.addresses.push(newAddr);
    await user.save();
    return res.status(201).json({ success: true, message: "Address added", data: user.addresses });
  } catch (err) {
    console.error("addAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to add address" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const payload = req.body || {};
    const user = await resolveUserByIdOrGuest(id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    if (payload.isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
      addr.isDefault = true;
    }
    ["fullName", "phone", "street", "city", "state", "zipCode", "country"].forEach((key) => {
      if (payload[key] !== undefined) addr[key] = payload[key];
    });
    await user.save();
    return res.status(200).json({ success: true, message: "Address updated", data: user.addresses });
  } catch (err) {
    console.error("updateAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to update address" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const user = await resolveUserByIdOrGuest(id);
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    const wasDefault = addr.isDefault;
    addr.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    return res.status(200).json({ success: true, message: "Address deleted", data: user.addresses });
  } catch (err) {
    console.error("deleteAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};

module.exports = {
  getUserAddress,
  updateUserAddress,
  getProfile,
  updateProfile,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
