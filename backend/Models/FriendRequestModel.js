import mongoose from "mongoose";

const FriendRequestScheema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "Accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FriendRequest", FriendRequestScheema);
