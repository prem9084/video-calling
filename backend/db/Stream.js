import { StreamChat } from "stream-chat";
import "dotenv/config";
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
  console.log("Server Api key or Secret is missin");
}

const stremClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await stremClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log("error in upsert in Stream user", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // exsure userIs is a string

    const userIdStr = userId.toString();
    return stremClient.createToken(userIdStr);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
