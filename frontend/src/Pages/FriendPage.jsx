import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

import { getLanguageFlage } from "../Component/FriendCard";
import NoFriendsFound from "../Component/NoFriendsFound";
import { Link } from "react-router-dom";

const FriendPage = () => {
  const [loadingFriends] = useState(false);
  const [friends, setFriends] = useState([]);

  const getUserFriends = async () => {
    try {
      const { data } = await axiosInstance.get("/users/friends");
      if (data.success) {
        return setFriends(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    const data = async () => {
      await getUserFriends();
    };
    data();
  }, []);
  return (
    <div className="p-5">
      {loadingFriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <div
              className="card bg-base-200 hover:shadow-md transition-shadow"
              key={friend._id}
            >
              <div className="card-body p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar size-12">
                    <img src={friend.profilePic} alt={friend.fullname} />
                  </div>
                  <h3 className="font-semibold truncate">{friend.fullname}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="badge badge-secondary text-xs">
                    {getLanguageFlage(friend.nativeLanguage)}
                    native: {friend.nativeLanguage}
                  </span>
                  <span className="badge badge-outline text-xs">
                    {getLanguageFlage(friend.learningLanguage)}
                    learning: {friend.learningLanguage}
                  </span>
                </div>

                <Link
                  to={`/chat/${friend._id}`}
                  className="btn btn-outline w-full"
                >
                  Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendPage;
