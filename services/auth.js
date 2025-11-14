const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "SOME_SUPER_SECRET_KEY";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    console.log("JWT validation failed:", error.message);
    return null;
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
