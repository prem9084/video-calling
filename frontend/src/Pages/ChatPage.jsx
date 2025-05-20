import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { StreamChat } from "stream-chat";
import { toast } from "react-toastify";
import ChatLoader from "../Component/ChatLoader";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import CallButton from "../Component/CallButton";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const production = import.meta.env.MODE;

const ChatPage = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [ChatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoadding] = useState(true);

  const { user } = useAuth();

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

  useEffect(() => {
    const initChat = async () => {
      if (!token || !user) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: user._id,
            name: user.fullname,
            image: user.profilePic,
          },
          token
        );

        const channelId = [user._id, id].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [user._id, id],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log(error);
        toast.error("Error in initializing chat", error);
      } finally {
        setLoadding(false);
      }
    };

    initChat();
  }, [token, user, id]);

  const handleVideoCall = () => {
    if (channel) {
      const baseUrl =
        !production === "development"
          ? "http://localhost:5173"
          : "https://g-meeting.netlify.app";

      const callUrl = `${baseUrl}/call/${channel.id}`;
      channel.sendMessage({
        text: `i have started a video call. join me: ${callUrl}`,
      });

      toast.success("video call url send successfully!");
    }
  };

  if (loading || !ChatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={ChatClient}>
        <Channel className="" channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
