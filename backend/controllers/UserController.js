import FriendRequestModel from "../Models/FriendRequestModel.js";
import UserModel from "../Models/UserModel.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = req.user;

    const users = await UserModel.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in GetRecommendedUsers", error);
    res.json({ success: false, message: error.message });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullname profilePic nativeLanguage,learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await UserModel.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequestModel.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendRequest = await FriendRequestModel.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AcceptRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequestModel.findById(requestId);

    if (!friendRequest) {
      return res.status(400).json({ message: "Friend request not found" });
    }
    // verify the current user is the recipiend

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(400)
        .json({ message: "You are not Authorized to accept the request" });
    }

    friendRequest.status = "Accepted";

    await friendRequest.save();
    // add each user to other's friends array

    await UserModel.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await UserModel.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get friend requests

export const getFriendRequests = async (req, res) => {
  try {
    const incommingReq = await FriendRequestModel.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullname profilePic nativeLanguage learningLanguage"
    );

    const accepetedReq = await FriendRequestModel.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullname profilePic");

    res.status(200).send({ success: true, incommingReq, accepetedReq });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getOutGoingFriendReq = async (req, res) => {
  try {
    const outGoingReq = await FriendRequestModel.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullname profilePic nativeLanguage learningLanguage"
    );

    res.status(200).send(outGoingReq);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
