import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },

    contentType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },

    textContent: {
      type: String,
    },

    filePath: {
      type: String,
    },
    oneTime: {
  type: Boolean,
  default: false
  },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    fileOriginalName: {
  type: String,
  },

  },
  { timestamps: true }

);

export default mongoose.model("Link", linkSchema);
