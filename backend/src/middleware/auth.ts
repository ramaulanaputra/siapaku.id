import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db/pool";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    google_id: string;
    email: string;
    nama: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token tidak ditemukan" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "siapaku-secret-key-change-in-prod";

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      // Try NextAuth token (Google sub as user id)
      try {
        decoded = jwt.decode(token) as any;
        if (!decoded) throw new Error("Invalid token");
      } catch {
        res.status(401).json({ error: "Token tidak valid" });
        return;
      }
    }

    // Find user by google_id or email from token
    const googleId = decoded.sub || decoded.google_id;
    const email = decoded.email;

    if (!googleId && !email) {
      res.status(401).json({ error: "Token tidak valid" });
      return;
    }

    let result;
    if (googleId) {
      result = await query(
        "SELECT id, google_id, email, nama, role FROM users WHERE google_id = $1",
        [googleId]
      );
    } else {
      result = await query(
        "SELECT id, google_id, email, nama, role FROM users WHERE email = $1",
        [email]
      );
    }

    if (result.rows.length === 0) {
      res.status(401).json({ error: "User tidak ditemukan" });
      return;
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Akses ditolak" });
    return;
  }
  next();
};
