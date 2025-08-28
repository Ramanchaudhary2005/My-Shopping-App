const mongoose = require("mongoose");   
const { Schema, model } = mongoose;

const addressSubSchema = new Schema({
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    street: { type: String,  trim: true },
    city: { type: String,  trim: true },
    state: { type: String,  trim: true },
    zipCode: { type: String,  trim: true },
    country: { type: String, trim: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true }, 
    password: { type: String, required: true, trim: true },
    username: { type: String,  trim: true },
    phone: { type: String,  trim: true },
    address: {
        fullName: { type: String, trim: true },
        phone: { type: String, trim: true },
        street: { type: String,  trim: true },
        city: { type: String,  trim: true },
        state: { type: String,  trim: true },
        zipCode: { type: String,  trim: true },
        country: { type: String, trim: true }
    },
    addresses: { type: [addressSubSchema], default: [] },
    avatarUrl: { type: String, trim: true },
    paymentPreference: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'], default: 'cash_on_delivery' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    profilepicture: {
        type: String,
        
    },
    dateofbirth: { type: Date },
}); 

const UserModel = model("User", userSchema);

module.exports = { UserModel };

