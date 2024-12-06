const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment: { type: String },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
    users: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const comment = mongoose.model('comments', commentSchema);

module.exports = comment;