import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";
import FriendCard from "../Component/FriendCard";
import NoFriendsFound from "../Component/NoFriendsFound";
import { useAuth } from "../Context/AuthContext";
import RecomenedCard from "./RecomenedCard";

// Don't add 'use client' here - it's not needed for React Router based apps

const HomePage = () => {
  const [loadingFriends] = useState(false);
  const [friends, setFriends] = useState([]);

  const { recommendedUser } = useAuth();

  const getUserFriends = async () => {
    try {
      const { data } = await axiosInstance.get("/users/friends");
      if (data.success) {
        setFriends(data.user);
        toast.success(data.message);
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

  // Capitalize helper function

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUser.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUser.map((user) => {
                return <RecomenedCard key={user._id} recUser={user} />;
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
