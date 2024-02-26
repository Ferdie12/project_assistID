import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  permissionType: {
    type: String,
    enum: ["cuti", "izin"],
    required: true,
  },
  reason: { type: String },
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

export const permissionModel = mongoose.model("Permission", permissionSchema);
