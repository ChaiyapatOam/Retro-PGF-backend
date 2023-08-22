import express, { Express, Router } from "express";
const router: Router = express.Router();
import * as userController from "@/controller/user.controller";
import { validateZod } from "@/lib/validateZod";
import {
  createUserSchema,
  findUserSchema,
  updateUserSchema,
} from "@/lib/zodSchema/userSchema";

router.route("/").post(validateZod(createUserSchema), userController.Create);

router
  .route("/:email")
  .get(validateZod(findUserSchema), userController.FindUserByEmail)
  .patch(validateZod(updateUserSchema), userController.UpdateUser);

router
  .route("/:email/projects")
  .get(validateZod(findUserSchema), userController.GetAllProject);

export const userRoute: Router = router;
