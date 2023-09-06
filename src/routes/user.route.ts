import express, { Express, Router } from "express";
const router: Router = express.Router();
import * as userController from "@/controller/user.controller";
import { validateZod } from "@/lib/validateZod";
import { updateUserSchema } from "@/lib/zodSchema/userSchema";
import { authJwt } from "@/middleware/auth";

router.route("/login").post(userController.Login);

router
  .route("/")
  .get(userController.GetUser)
  .patch(authJwt, validateZod(updateUserSchema), userController.UpdateUser);

router.route("/logout").post(authJwt, userController.Logout)
router.route("/projects").get(authJwt, userController.GetAllProject);

export const userRoute: Router = router;
