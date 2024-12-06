const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    postImg: { type: String },
    title: { type: String },
    year: { type: String },
    make: { type: String },
    model: { type: String },
    description: { type: String },
    shareCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const post = mongoose.model('posts', postSchema);

module.exports = post;