const mongoose = require('mongoose')

const followingSchema = mongoose.Schema({
    following: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    users: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const following = mongoose.model('followings', followingSchema);

module.exports = following;