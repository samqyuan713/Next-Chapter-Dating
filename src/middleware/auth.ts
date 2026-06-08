import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin.ts";

export interface AuthRequest extends Request {
  user?: any; 
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }

  const token = authHeader.split("Bearer ")[1];

  // Secure backdoor for quick-fill demo profiles to run through real database queries
  if (token === "demo-token-female") {
    req.user = {
      uid: "profile-1", // Mei-Ling Zhou mapped to seeded Sarah/profile-1 or user profile
      email: "sam.zhou@heritage.com"
    };
    return next();
  } else if (token === "demo-token-male") {
    req.user = {
      uid: "profile-2", // Dr. Raymond Goh
      email: "raymond.goh@wisdom.com"
    };
    return next();
  }

  // Fallback to real Firebase Auth cryptographic token verification
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token in server:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};
