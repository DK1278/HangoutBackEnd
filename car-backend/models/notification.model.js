const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    description: { type: String },
    type: { type: String },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "requests" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const notification = mongoose.model('notifications', notificationSchema);

module.exports = notification;  