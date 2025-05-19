import React, { useState } from "react";

import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const LoginPage = () => {
  // const { user } = useUserData();
  const [isPending, setIsPending] = useState(false);
  const { fetchUser, setUser } = useAuth();
  const [error, setError] = useState(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const { data } = await axiosInstance.post("/auth/login", loginData);
      if (data.success) {
        toast.success(data.message);
        await fetchUser();

        localStorage.setItem("jwt", data.token);
        setUser(data.user);
        setIsPending(false);
      } else {
        setError(data.message);
        toast.error(data.message);
        setIsPending(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl  shadow-lg overflow-hidden">
        {/* LOGIN FORM LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              {" "}
              StreamApp
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-">
              <span>{error}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className=" form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example14@gmail.com"
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className=" form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="'e.g' Prem@9482"
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p>Password mut be at least 6 charactor long</p>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs">
                        Loading...
                      </span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    You have not an Account?{" "}
                    <Link
                      to={"/signup"}
                      className="text-primary hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm max-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with language partners worldwide
              </h2>
              <p className="opacity-70">
                Practice conversation, make friends, and improve your language
                skilles together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
