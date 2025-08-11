import verify from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  companyName: { type: String, require: true },
  password: { type: String, require: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpiredAt: { type: Number, default: 0 },
});
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
