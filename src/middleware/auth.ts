import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const secret = process.env.JWT_SECRET;

interface customPayload extends JwtPayload {
  email: string;
  exp?: number | undefined;
  iat?: number | undefined;
}

export const authJwt = (req: Request, res: Response, next: NextFunction) => {
  if (!secret) {
    throw new Error("Please Define JWT_SECRET");
  }
  let token = req.cookies.ssid

  if (!token) {
    return res.status(403).send({
      message: "No Token provided!",
    });
  }
  const decoded = jwt.verify(token, secret) as customPayload;
  req.email = decoded.email;

  if (!decoded) {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
  next();
};
