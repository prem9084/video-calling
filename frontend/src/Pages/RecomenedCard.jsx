import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

import { MapPinIcon, UserPlusIcon } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { capitalize } from "../utils/utils";

const RecomenedCard = ({ recUser }) => {
  const [isPending, setIsPending] = useState(false);
  const [outGoingReqIds, setOutGoingReqIds] = useState(new Set());
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [outgoingFriendReqs, setOutgoingFriendReqs] = useState([]);
  const { getLanguageFlage } = useAuth();

  const hasRequestBeenSent = outGoingReqIds.has(recUser._id);

  const sentFriendReq = async (userId) => {
    setIsPending(true);
    try {
      const { data } = await axiosInstance.post(
        `/users/friend-request/${userId}`
      );
      if (data.success) {
        // Update outgoing requests in state
        const newOutgoingReqs = new Set(outGoingReqIds);
        newOutgoingReqs.add(userId);
        setOutGoingReqIds(newOutgoingReqs);
        toast.success(data.message);
        setIsPending(false);
        setOutgoingFriendReqs(data.outGoingReq);
      } else {
        toast.error(data.message);
        setIsPending(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to send friend request");
      setIsPending(false);
    }
  };

  const getOutGoingFriendsReq = async () => {
    setLoadingFriends(true);
    try {
      const { data } = await axiosInstance.get(
        "/users/outgoing-friend-requests"
      );
      if (data.success) {
        toast.success(data.message);
        const requestIdsSet = new Set(data.user);
        setOutGoingReqIds(requestIdsSet);
        setLoadingFriends(false);
      } else {
        toast.error(data.message);
        setLoadingFriends(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutGoingReqIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    const fetchData = async () => {
      await getOutGoingFriendsReq();
    };
    fetchData();
  }, []);

  return (
    <div
      key={recUser._id}
      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="card-body p-5 space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <div className="avatar size-16 rounded-full">
            <img src={recUser.profilePic} alt={recUser.fullName} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{recUser.fullName}</h3>
            {recUser.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {recUser.location}
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5">
          {recUser.nativeLanguage && (
            <span className="badge badge-secondary">
              {getLanguageFlage(recUser.nativeLanguage)}
              Native: {capitalize(recUser.nativeLanguage)}
            </span>
          )}
          {recUser.learningLanguage && (
            <span className="badge badge-outline">
              {getLanguageFlage(recUser.learningLanguage)}
              Learning: {capitalize(recUser.learningLanguage)}
            </span>
          )}
        </div>

        {/* Bio */}
        {recUser.bio && <p className="text-sm opacity-70">{recUser.bio}</p>}

        {/* Friend Request Button */}
        <button
          className={`btn w-full mt-2 ${
            hasRequestBeenSent ? "btn-disabled" : "btn-primary"
          }`}
          onClick={() => sentFriendReq(recUser._id)}
          disabled={hasRequestBeenSent || isPending}
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : isPending ? (
            <>
              <span className="loading loading-spinner loading-xs mr-2" />
              Sending...
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecomenedCard;
