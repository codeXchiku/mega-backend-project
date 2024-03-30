import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Check for token in cookies or Authorization header (corrected case sensitivity)
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/, "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token using Jwt.verify (assuming process.env.ACCESS_TOKEN_SECRET is set correctly)
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by ID, excluding password and refreshToken fields
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle errors more specifically
    if (error.name === "JsonWebTokenError") {
      // Likely "jwt malformed" error (invalid token structure or signature)
      throw new ApiError(401, "Malformed access token");
    } else {
      // Handle other errors (e.g., user not found)
      throw error;
    }
  }
});
