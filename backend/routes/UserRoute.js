import express from "express";
import {
  AcceptRequest,
  getFriendRequests,
  getMyFriends,
  getOutGoingFriendReq,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/UserController.js";
import { protectRoute } from "../middleware/AuthMiddleare.js";

const router = express.Router();
// api auth middleare to all

router.use(protectRoute);

router.get("/recommended", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", AcceptRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutGoingFriendReq);
export default router;
