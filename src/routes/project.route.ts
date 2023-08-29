import express, { Express, Router } from "express";
const router: Router = express.Router();
import * as projectController from "@/controller/project.controller";
import { validateZod } from "@/lib/validateZod";
import {
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
  .patch(authJwt, validateZod(updateProjectSchema), projectController.Update);

export const projectRoute: Router = router;
