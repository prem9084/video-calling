import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import OnBoardingPage from "./Pages/OnBoardingPage";
import ChatPage from "./Pages/ChatPage";
import CallPage from "./Pages/CallPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import NotificationsPage from "./Pages/NotificationsPage";
import PageLoader from "./Component/PageLoader";

import { useAuth } from "./Context/AuthContext";
import LayOut from "./Component/Layout";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { theme } = useThemeStore();
  const { isAuth, isOnboarded, loading } = useAuth();
  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuth && isOnboarded ? (
              <LayOut showSidebar={true}>
                <HomePage />
              </LayOut>
            ) : (
              <Navigate to={!isAuth ? "/login" : "/onbording"} />
            )
          }
        />

        <Route
          path="/onbording"
          element={
            isAuth ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat"
          element={isAuth ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={isAuth ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={
            !isAuth ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onbording"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuth ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onbording"} />
            )
          }
        />
        <Route
          path="/notification"
          element={isAuth ? <NotificationsPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
