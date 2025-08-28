const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const wishlistSchema = new Schema({
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true, trim: true },
      price: { type: Number, required: true, min: 0 },
      thumbnail: { type: String, default: "" },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const wishlistModel = model("Wishlist", wishlistSchema);

module.exports = { wishlistModel };


