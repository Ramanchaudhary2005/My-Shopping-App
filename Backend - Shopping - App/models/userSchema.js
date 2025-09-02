const mongoose = require("mongoose");   
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

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

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with salt rounds of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user data without password
userSchema.methods.toSafeObject = function() {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const UserModel = model("User", userSchema);

module.exports = { UserModel };

