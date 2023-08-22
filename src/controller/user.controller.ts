import { User } from "@/lib/prisma";
// import * as userService from "@/service/user.service";
import { Request, Response } from "express";

export const Create = async (req: Request, res: Response) => {
  try {
    await User.create({
      data: req.body,
    });

    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

export const FindUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: {
        email: req.params.email,
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

export const UpdateUser = async (req: Request, res: Response) => {
  const user = await User.update({
    where: {
      email: req.params.email,
    },
    data: req.body,
  });

  res.status(200).send({ success: true, data: user });
};

export const GetAllProject = async (req: Request, res: Response) => {
  try {
    const user = await User.findUnique({
      where: {
        email: req.params.email,
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
