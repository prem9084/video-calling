import React, { useEffect, useState } from "react";

import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { useAuth } from "../Context/AuthContext";

const OnBoardingPage = () => {
  const { user, loading, fetchUser } = useAuth();

  const [formState, setFormState] = useState({
    fullname: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
  });

  useEffect(() => {
    if (user) {
      setFormState({
        fullname: user.fullname || "",
        bio: user.bio || "",
        nativeLanguage: user.nativeLanguage || "",
        learningLanguage: user.learningLanguage || "",
        location: user.location || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);
  const handleOnBoarding = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/onboard", formState);
      if (data && data?.success) {
        toast.success(data.message);
        await fetchUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateAvatar = async () => {
    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Avatar changed successfully");
  };

  return (
    <div className="min-h-screen bg-bae-100 flex items-center justify-around p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sam:text-3xl font-bold items-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleOnBoarding} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <>
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-ful object-cover"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  </>
                )}
              </div>
              {/* Generate Avatar */}
              <div className="flex items-center gap-2">
                <button className="btn btn-accent" onClick={generateAvatar}>
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formState.fullname}
                onChange={(e) =>
                  setFormState({ ...formState, fullname: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                type="text"
                placeholder="Tell others about yourself and your language learning gaols"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24 w-full"
              />
            </div>
            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Native language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLangiage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={`native-${lang}`}
                      value={lang.toLocaleLowerCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/* Learning language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your Learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={`learning-${lang}`}
                      value={lang.toLocaleLowerCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Location */}

            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content opacity-70 pointer-events-none" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit butoon */}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {!loading ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
