import { User } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const validateIDToken = async (idToken: string) => {
  if (!idToken) throw new Error("No id-token ");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (error) {
    throw new Error("Validate Token Error");
  }
};

export const generateToken = (email: string) => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ email: email }, secret, {
    expiresIn: 60 * 60 * 24, // 1 days
  });
  return token;
};

export const create = async (tokenData: DecodedIdToken) => {
  if (!tokenData) throw new Error("No Token Provide");
  const result = await User.create({
    data: {
      email: tokenData.email,
      profile: tokenData.picture,
      user_name: tokenData.name,
    },
  });
  return result;
};

export const findUser = async (email: string) => {
  if (!email) throw new Error("No Email Provide");
  const user = await User.findFirst({
    where: {
      email: email,
    },
  });
  return user;
};
