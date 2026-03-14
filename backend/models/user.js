const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'STAFF', 'USER'],
        default: 'USER'
    },
    vehicleNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    department: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.username && this.name) {
        this.username = this.name;
    }

    if (!this.isModified('password') || !this.password) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
