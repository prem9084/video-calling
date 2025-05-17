import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const FriendCard = ({ friend }) => {
  const { getLanguageFlage } = useAuth();
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend?.profilePic} alt={friend.fullname} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlage(friend.nativeLangiage)}
            native:{friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlage(friend.learningLanguage)}
            learning:{friend.learningLangiage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
