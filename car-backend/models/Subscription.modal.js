const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Subscription = mongoose.model("subscriptions", subscriptionSchema);

module.exports = Subscription;
