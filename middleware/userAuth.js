import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login Again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login Again." });
  }
};

export default userAuth;
