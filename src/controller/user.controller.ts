import { User } from "@/lib/prisma";
import * as userService from "@/service/user.service";
import { Request, Response } from "express";

export const Login = async (req: Request, res: Response) => {
  try {
    const idToken = req.headers["id-token"] as string;
    if (idToken !== undefined) {
      const decodedToken = await userService.validateIDToken(idToken);
      const user = await userService.findUser(decodedToken.email as string);

      if (!user) {
        await userService.create(decodedToken);
        const token = userService.generateToken(decodedToken.email as string);
        res.cookie("ssid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
        res.status(201).send({
          success: true,
          message: "User Created",
        });
      } else {
        const token = userService.generateToken(decodedToken.email as string);
        res.cookie("ssid", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
        res.status(200).send({ success: true })
      }
    } else {
      res.status(403).send({ success: false, message: "No id-token Provide" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Cant validate id-token" });
  }
};

export const FindUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);

    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  const user = await User.update({
    where: {
      email: req.email,
    },
    data: req.body,
  });

  res.status(200).send({ success: true, data: user });
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
      res.status(404).send("user not found");
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({ success: false });
  }
};
