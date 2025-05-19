import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
const Navbar = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const logout = async () => {
    localStorage.removeItem("jwt");
    setUser(null);
    toast.success("User logout Successfully");
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end">
          {/* LOGO */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  StreamApp
                </span>
              </Link>{" "}
            </div>
          )}
          <div className="flex items-center gap-3  sm:gap-4 ml-auto">
            <Link to="/notification">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>
          <ThemeSelector />

          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={user?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={logout}>
            <LogOutIcon className="size-5 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
