import { Router } from "express";
import { changeCurrentPassword, changeMembershipStatus, forgotPassword, getCurrentUser, getSingleUser, getUser, loginUser, logout, registerUser, resetPassword, updateAvatar, verifyUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authoriseRoles, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register")
    .post(upload.single("avatar"),registerUser)

router.route("/login")
    .post(loginUser)

router.route("/verify/:token")
    .put(verifyUser)

router.route("/logout")
    .get(verifyJWT, logout)

router.route("/current-user")
    .get(verifyJWT, getCurrentUser)

router.route("/change-password")
    .put(verifyJWT, changeCurrentPassword)

router.route("/forgot-password")
    .post(forgotPassword)

router.route("/reset-password/:token")
    .put(resetPassword)

router.route("/update-avatar")
    .put(verifyJWT,upload.single("avatar"),updateAvatar);

router.route("/get-users")
    .get(verifyJWT,authoriseRoles("ADMIN"),getUser)

router.route("/get-user/:id")
    .get(verifyJWT,authoriseRoles("ADMIN"),getSingleUser)

router.route("/change-membershipStatus/:id")
    .put(verifyJWT,authoriseRoles("ADMIN"),changeMembershipStatus)

export default router