import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { axiosInstance } from "../lib/axios";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { toast } from "react-toastify";
import PageLoader from "../Component/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [token, setToken] = useState(null);
  const { user, loading } = useAuth();

  const getStreamChatToken = async () => {
    try {
      const { data } = await axiosInstance.get("/chat/token");
      setToken(data.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getStreamChatToken();
    }
  }, []);

  console.log(token);

  useEffect(() => {
    const initCall = async () => {
      if (!token || !user || !id) return;

      try {
        const CallUser = {
          id: user._id,
          name: user.fullname,
          image: user.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: CallUser,
          token: token,
        });

        const callInstance = videoClient.call("default", id);

        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);

        toast.success("Join Call Successfully");
      } catch (error) {
        console.log(error);
        toast.error("error in calling", error);
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [token, user, id]);

  if (loading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <>
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <p>
                Cloud not initialize call, Please refress or try again later.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");
  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
