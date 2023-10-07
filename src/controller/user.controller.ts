import { Session, User } from "@/lib/prisma";
import * as userService from "@/service/user.service";
import * as jwtService from "@/service/jwt.service";
import * as sessionService from "@/service/session.service";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const Login = async (req: Request, res: Response) => {
  try {
    const idToken = req.headers["id-token"] as string;
    if (idToken !== undefined) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const decodedToken = await userService.validateIDToken(idToken);
      let user = await userService.findUser(decodedToken.email as string);
      const uuid = uuidv4();

      const token = jwtService.generateToken(
        decodedToken.email as string,
        uuid
      );
      if (!user) {
        user = await userService.create(decodedToken);
        await sessionService.Create(user.id, uuid);
        // res.cookie("ssid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
        res.cookie("ssid", token, {
          httpOnly: true,
          secure: true,
          expires: tomorrow,
        });
        return res.status(201).send({
          success: true,
          message: "User Created",
        });
      } else {
        await sessionService.Create(user.id, uuid);
        // res.cookie("ssid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
        res.cookie("ssid", token, {
          httpOnly: true,
          secure: true,
          expires: tomorrow,
        });
        return res.status(200).send({ success: true });
      }
    } else {
      res.status(403).send({ success: false, message: "No id-token Provide" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Cant validate id-token" });
  }
};

export const GetUser = async (req: Request, res: Response) => {
  try {
    let token = req.cookies.ssid;

    // if no token its mean user not login
    if (!token) {
      return res.status(204).send({
        message: "No Content",
      });
    }

    let user;
    const decoded = jwtService.Validate(token);
    user = await userService.findUser(decoded.email);

    // Check Session and delete cookie
    const session = await sessionService.Validate(decoded.uuid);

    if (!session) {
      res.status(204).clearCookie("ssid");
      return res.end();
    } else if (!user) {
      return res.status(404).send("user not found");
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.update({
      where: {
        email: req.email,
      },
      data: req.body,
    });

    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    return res.status(500).send({ success: false });
  }
};

export const GetAllProject = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: {
        email: req.email,
      },
      include: {
        Project: true,
      },
    });

    if (!user) {
      return res.status(404).send("user not found");
    } else {
      return res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    return res.status(500).send({ success: false });
  }
};

export const GetAllFavorite = async (req: Request, res: Response) => {
  try {
    const userLike = await userService.getLikeProject(req.email);
    return res.status(200).send({ success: true, data: userLike });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false });
  }
};

export const Logout = async (req: Request, res: Response) => {
  await sessionService.Delete(req.uuid);
  res.status(200).clearCookie("ssid");
  res.end();
};
