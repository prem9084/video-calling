import { generateStreamToken } from "../db/Stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
