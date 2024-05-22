import { Router } from "express";
import { registerUser, verifyUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/register")
    .post(upload.single("avatar"),registerUser)

router.route("/verify/:token")
    .put(verifyUser)

export default router