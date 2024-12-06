const mongoose = require('mongoose')

const carDetailsSchema = mongoose.Schema({
    carImg: { type: String },
    year: { type: String },
    make: { type: String },
    model: { type: String },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })


const carDetails = mongoose.model('car-details', carDetailsSchema);

module.exports = carDetails;