const mongoose = require("mongoose");

const memberEventSchema = mongoose.Schema(
  {
    eventImg: { type: String },
    title: { type: String },
    description: [{ type: String }],
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    location: {
      type: {
        type: String, // 'Point'
        enum: ["Point"], // this enforces that the type is 'Point'
        required: true,
      },  
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    zipCode: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    shareCount: { type: Number, default: 0 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isActive: { type: Boolean, default: true },
    isUsedforads: { type: Boolean, default: true },
    eventTypes: { type: String }
  },
  { timestamps: true, versionKey: false }
);

memberEventSchema.index({ location: "2dsphere" });

const memberEvent = mongoose.model("member-events", memberEventSchema);

module.exports = memberEvent;
