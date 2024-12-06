const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const like = mongoose.model('likes', likeSchema);

module.exports = like;