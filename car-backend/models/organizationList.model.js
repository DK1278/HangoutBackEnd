const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema(
    {
        organizationDocument: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        status: { type: String, enum: ["pending", "accept", "reject"], default: "pending" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);


const organization = mongoose.model("organizations", organizationSchema);

module.exports = organization;
