import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { approveIssueRequest, deleteIssueRequest, getAllIssues, getCurrentUserIssueRequests, getSingleUserIssues, issueRequest, returnBook } from "../controllers/issue.controller.js";

const router = Router();

router.route("/issue-request")
    .post(verifyJWT,issueRequest)

router.route("/get-currentUser-issues")
    .get(verifyJWT,getCurrentUserIssueRequests)

router.route("/get-allIssues")
    .get(verifyJWT,authoriseRoles("ADMIN"),getAllIssues)

router.route("/get-singleUser/:userId")
    .get(verifyJWT,authoriseRoles("ADMIN"),getSingleUserIssues)

router.route("/delete-issueRequest/:issueId")
    .delete(verifyJWT,deleteIssueRequest)

router.route("/approve-issueRequest/:issueId")
    .put(verifyJWT,authoriseRoles("ADMIN"),approveIssueRequest)

router.route("/return/:issueId")
    .put(verifyJWT,authoriseRoles("ADMIN"),returnBook);

export default router;