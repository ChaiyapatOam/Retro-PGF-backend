import express, { Express, Router } from "express";
const router: Router = express.Router();
import * as projectController from "@/controller/project.controller";
import { validateZod } from "@/lib/validateZod";
import {
  commentProjectSchema,
  createProjectSchema,
  getProjectByIdSchema,
  updateProjectSchema,
} from "@/lib/zodSchema/projectSchema";
import { authJwt } from "@/middleware/auth";

router
  .route("/")
  .get(projectController.GetAll)
  .post(authJwt, validateZod(createProjectSchema), projectController.Create);

router
  .route("/:id")
  .get(validateZod(getProjectByIdSchema), projectController.FindProjectById)
  .patch(authJwt, validateZod(updateProjectSchema), projectController.Update)
  .delete(authJwt,projectController.Delete)

router
  .route("/:id/comment")
  .post(
    authJwt,
    validateZod(commentProjectSchema),
    projectController.CommentProject
  );

router
  .route("/:id/comment/:commentId")
  .patch(
    authJwt,
    validateZod(commentProjectSchema),
    projectController.UpdateCommentProject
  );

router.route("/:id/like").post(authJwt, projectController.LikeProject);

// router.route("/:id/unlike").post(authJwt, projectController.UnLikeProject);

export const projectRoute: Router = router;
