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

// New: Profile get/update and multiple addresses CRUD

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("email username phone avatarUrl paymentPreference addresses address");
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getProfile error', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone, avatarUrl, paymentPreference } = req.body;
    const allowedPrefs = ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'];
    if (paymentPreference && !allowedPrefs.includes(paymentPreference)) {
      return res.status(400).json({ success: false, message: 'Invalid payment preference' });
    }
    const update = {
      ...(username !== undefined ? { username } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(paymentPreference !== undefined ? { paymentPreference } : {}),
      updatedAt: new Date(),
    };
    const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).select("email username phone avatarUrl paymentPreference");
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, message: 'Profile updated', data: user });
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

const listAddresses = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('addresses');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user.addresses || [] });
  } catch (err) {
    console.error('listAddresses error', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
};

const addAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = req.body || {};
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const newAddr = {
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'India',
      isDefault: Boolean(address.isDefault),
    };
    if (newAddr.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    user.addresses.push(newAddr);
    await user.save();
    return res.status(201).json({ success: true, message: 'Address added', data: user.addresses });
  } catch (err) {
    console.error('addAddress error', err);
    return res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const payload = req.body || {};
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    if (payload.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      addr.isDefault = true;
    }
    ['fullName','phone','street','city','state','zipCode','country'].forEach(k => {
      if (payload[k] !== undefined) addr[k] = payload[k];
    });
    await user.save();
    return res.status(200).json({ success: true, message: 'Address updated', data: user.addresses });
  } catch (err) {
    console.error('updateAddress error', err);
    return res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).json({ success: false, message: 'Address not found' });
    const wasDefault = addr.isDefault;
    addr.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    return res.status(200).json({ success: true, message: 'Address deleted', data: user.addresses });
  } catch (err) {
    console.error('deleteAddress error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
module.exports.listAddresses = listAddresses;
module.exports.addAddress = addAddress;
module.exports.updateAddress = updateAddress;
module.exports.deleteAddress = deleteAddress;


