const { wishlistModel } = require("../../../models/wishlistSchema");
const { cartModel } = require("../../../models/cartSchema");

const getWishlist = async (req, res) => {
  try {
    let list = await wishlistModel.findOne();
    if (!list) list = await wishlistModel.create({ items: [] });
    return res.status(200).json({ success: true, data: list.items });
  } catch (err) {
    console.error('getWishlist error', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId, name, price, thumbnail } = req.body;
    if (!productId || !name || !price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    let list = await wishlistModel.findOne();
    if (!list) list = await wishlistModel.create({ items: [] });
    const exists = list.items.findIndex(i => String(i.productId) === String(productId));
    if (exists === -1) list.items.push({ productId, name, price, thumbnail });
    await list.save();
    return res.status(201).json({ success: true, message: 'Added to wishlist', data: list.items });
  } catch (err) {
    console.error('addToWishlist error', err);
    return res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    let list = await wishlistModel.findOne();
    if (!list) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    const before = list.items.length;
    list.items = list.items.filter(i => String(i._id) !== String(id));
    if (before === list.items.length) return res.status(404).json({ success: false, message: 'Item not found' });
    await list.save();
    return res.status(200).json({ success: true, message: 'Removed from wishlist', data: list.items });
  } catch (err) {
    console.error('removeFromWishlist error', err);
    return res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
};

const moveToCart = async (req, res) => {
  try {
    const { id } = req.params; // wishlist item id
    let list = await wishlistModel.findOne();
    if (!list) return res.status(404).json({ success: false, message: 'Wishlist not found' });
    const item = list.items.find(i => String(i._id) === String(id));
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    // Ensure cart exists
    let cart = await cartModel.findOne();
    if (!cart) cart = await cartModel.create({ items: [] });
    const existing = cart.items.findIndex(ci => String(ci.productId) === String(item.productId));
    if (existing === -1) {
      cart.items.push({ productId: item.productId, name: item.name, price: item.price, quantity: 1, thumbnail: item.thumbnail });
    } else {
      cart.items[existing].quantity += 1;
    }
    await cart.save();

    // remove from wishlist
    list.items = list.items.filter(i => String(i._id) !== String(id));
    await list.save();
    return res.status(200).json({ success: true, message: 'Moved to cart', data: { cart: cart.items, wishlist: list.items } });
  } catch (err) {
    console.error('moveToCart error', err);
    return res.status(500).json({ success: false, message: 'Failed to move to cart' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveToCart };


