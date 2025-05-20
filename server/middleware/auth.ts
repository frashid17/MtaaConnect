import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { storage } from "../storage";

// Initialize Firebase Admin SDK if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || undefined,
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    }),
  });
}

// Authentication middleware to verify Firebase auth tokens
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For some endpoints that don't require authentication
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    };
    
    // For endpoints that create resources, we need a database user
    if (req.method === "POST") {
      // Check if the user exists in our database
      let dbUser = await storage.getUserByEmail(decodedToken.email || "");
      
      // If user doesn't exist in our database, create a new user
      if (!dbUser && decodedToken.email) {
        dbUser = await storage.createUser({
          username: decodedToken.email.split("@")[0],
          email: decodedToken.email,
          password: "", // OAuth users don't need passwords
          displayName: decodedToken.name || null,
          photoURL: decodedToken.picture || null,
          phoneNumber: decodedToken.phone_number || null,
          verified: true,
        });
      }
      
      if (dbUser) {
        req.user.databaseId = dbUser.id;
      }
    }
    
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Invalid authentication token" });
  }
};

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        displayName?: string;
        photoURL?: string;
        databaseId?: number;
      };
    }
  }
}