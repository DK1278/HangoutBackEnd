const mongoose = require('mongoose')

const followersSchema = mongoose.Schema({
    followers: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    users: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const followers = mongoose.model('followers', followersSchema);

module.exports = followers;