import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  group: { type: String },
  date: { type: Date, required: true },
  activityType: {
    type: String,
    enum: ["hadir", "telat", "tidak_masuk", "cuti", "izin"],
    required: true,
  },
  approval: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  employee: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
  },
});

export const attendanceModel = mongoose.model("Attendance", attendanceSchema);
