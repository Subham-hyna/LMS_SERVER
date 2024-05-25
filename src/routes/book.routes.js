import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { addBook, editBook, getAllBooks } from "../controllers/book.controller.js";

const router = Router();

router.route("/add-book")
    .post(verifyJWT, authoriseRoles("ADMIN"),addBook)

router.route("/edit-book/:id")
    .put(verifyJWT,authoriseRoles("ADMIN"),editBook)

router.route("/get-books")
    .get(getAllBooks)

export default router;