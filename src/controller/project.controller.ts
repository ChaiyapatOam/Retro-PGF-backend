import { Project } from "@/lib/prisma";
import { Request, Response } from "express";
// import * as userService from "@/services/project.service";

export const GetAll = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findMany({ include: { _count: true } });

    res.status(201).send({ success: true, data: projects });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    await Project.create({
      data: req.body,
    });

    res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const FindProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Like: true,
        Comment: true,
        user: true,
      },
    });

    if (!project) {
      res.status(404).send("project not found");
    } else {
      res.status(200).send({ success: true, data: project });
    }
  } catch (error) {
    res.status(500).send({ success: false });
  }
};
