const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = mongoose.Schema(
  {
    profileImg: { type: String, default: "" },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, require: true },
    code: { type: String, default: "" },
    password: { type: String, require: true },
    gender: { type: String, enum: ["male", "female"] },
    dob: { type: Date },
    mobile: { type: String, default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    location: {
      type: {
        type: String, // 'Point'
        enum: ["Point"],
        default: "Point" // this enforces that the type is 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0], // [longitude, latitude]
      },
    },
    otp: { type: Number },
    otpExpireTime: { type: Number },
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false },
    isCarDetailsComplete: { type: Boolean, default: false },
    isOrganization: { type: Boolean, default: false },
    isOtpVerified: { type: Boolean, default: false },
    blockedUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    fcmToken: { type: String },
    token: { type: String },
    profileBackgroundimg: { type: String, default: "" },

    isPrivate: { type: Boolean, default: false },


  },
  { timestamps: true, versionKey: false }
);

usersSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
});
usersSchema.index({ location: "2dsphere" });

const User = mongoose.model("users", usersSchema);

module.exports = User;
