// verify token middleware
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload; // Match jwt.verify's decoded type
        }
    }
}

const verifyToken = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        console.log('Verified user:', decoded);
        return res.status(200).json({ message: "Token is valid", success: true });
    } catch (error) {
        return res.status(403).json({ message: "Token is invalid", success: false });
    }
};

export { verifyToken };