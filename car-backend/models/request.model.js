const mongoose = require('mongoose')

const followingSchema = mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type: { type: String, enum: ["following", 'follower'], },
    status: { type: String, enum: ["accept", 'pending', 'reject'], default: 'pending' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const following = mongoose.model('requests', followingSchema);

module.exports = following;