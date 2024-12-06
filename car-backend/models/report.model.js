const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    users: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    reason: { type: String, default: "" },
    status: { type: String, default: "pending" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const report = mongoose.model("reports", reportSchema);

module.exports = report;
