const { UserModel } = require("../../../models/userSchema");

const getUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("address");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
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

    const update = {
      address: {
        fullName: address.fullName || "",
        phone: address.phone || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || "India",
      },
      updatedAt: new Date(),
    };

    const user = await UserModel.findByIdAndUpdate(id, update, { new: true, select: "address" });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "Address saved", data: user.address });
  } catch (err) {
    console.error("updateUserAddress error", err);
    return res.status(500).json({ success: false, message: "Failed to save address" });
  }
};

module.exports = {
  getUserAddress,
  updateUserAddress,
};


