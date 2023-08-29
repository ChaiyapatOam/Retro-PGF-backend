import { Project, Comment, Like } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import * as userService from "@/service/user.service";

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

export const UpdateCommentProject = async (req: Request, res: Response) => {
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

export const LikeProject = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUser(req.email);
    if (!user) {
      throw new Error("No User Found");
    }
    const like = await Like.create({
      data: {
        project_id: req.params.id,
        user_id: user.id,
      },
    });

    res.status(201).send({ success: true, message: like });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
};
// export const UnLikeProject = async (req: Request, res: Response) => {
//   try {
//     const user = await userService.findUser(req.email);
//     if (!user) {
//       throw new Error("No User Found");
//     }
//     const like = await Like.create({
//       data: {
//         project_id: req.params.id,
//         user_id: user.id,
//       },
//     });

//     res.status(201).send({ success: true, message: like });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ success: false });
//   }
// };
