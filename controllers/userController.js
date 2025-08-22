import userModel from "../models/userModels.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "User ID missing." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    res.json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        companyName: user.companyName,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
