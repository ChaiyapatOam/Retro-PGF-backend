import { Project, Comment, Like } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as userService from "@/service/user.service";

export const GetAll = async (req: Request, res: Response) => {
  try {
    const page = req.query.page as unknown as number || 1;
    if (!page) {
      return res.status(500).send({ success: false, message: "Error in Page" });
    }

    let max = page * 10;
    const projects = await Project.findMany({
      skip: max - 10,
      take: max,
      select: {
        id: true,
        name: true,
        logo_url: true,
        description: true,
        crypto_category: true,
        category: true,
        _count: true
      },
      orderBy: {
        create_at: 'asc',
      },
    })

    res.status(200).send({ success: true, data: projects });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

export const Create = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    await Project.create({
      data: {
        name: req.body.name,
        logo_url: req.body.logo_url,
        banner_url: req.body.banner_url,
        website_url: req.body.website_url,
        crypto_category: req.body.crypto_category,
        description: req.body.description,
        reason: req.body.reason,
        category: req.body.category,
        contact: req.body.contact,
        create_by: user.id,
      },
    });

    res.status(201).send({ success: true, message: "Project Created!" });
  } catch (error) {
    console.log(error);
    // handle error prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        res.status(500).send({ success: false, message: "user id not found" });
      }
    }
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
        _count: true,
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

export const Update = async (req: Request, res: Response) => {
  try {
    const project = await Project.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(201).send({ success: true, message: project });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const Delete = async (req: Request, res: Response) => {
  try {
    await Project.delete({
      where: {
        id: req.params.id,
      }
    });

    res.status(200).send({ success: true, message: "Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const CommentProject = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    const comment = await Comment.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        project_id: req.params.id,
        user_id: user.id,
      },
    });

    res.status(201).send({ success: true, message: comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const UpdateComment = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    const comment = await Comment.update({
      where: {
        id: parseInt(req.params.commentId),
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        project_id: req.params.id,
        user_id: user.id,
      },
    });

    res.status(201).send({ success: true, message: comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const DeleteComment = async (req: Request, res: Response) => {
  try {
    await Comment.delete({
      where: {
        id: parseInt(req.params.commentId),
      },
    });

    res.status(200).send({ success: true, message: "Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const LikeProject = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    const projectId = req.params.id

    let like = await Like.findFirst({
      where: {
        project_id: projectId,
        user_id: user.id,
      },
    });

    if (!like) {
      like = await Like.create({
        data: {
          project_id: projectId,
          user_id: user.id,
        },
      });
    }

    return res.status(201).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};

export const UnLikeProject = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    await Like.deleteMany({
      where: {
        project_id: req.params.id,
        user_id: user.id,
      },
    });

    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};
