import { Router } from "express";
import { authoriseRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { approveIssueRequest, deleteCurrentUserIssueRequest, deleteIssueRequest, getAllIssues, getCurrentUserIssueRequests, getSingleUserIssues, issueRequest, renewIssue, returnBook } from "../controllers/issue.controller.js";

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
    .delete(verifyJWT,authoriseRoles("ADMIN"),deleteIssueRequest)

router.route("/delete-myIssueRequest/:issueId")
    .delete(verifyJWT,deleteCurrentUserIssueRequest)

router.route("/approve-issueRequest")
    .put(verifyJWT,authoriseRoles("ADMIN"),approveIssueRequest)

router.route("/renew-issue")
    .put(verifyJWT,authoriseRoles("ADMIN"),renewIssue)

router.route("/return")
    .put(verifyJWT,authoriseRoles("ADMIN"),returnBook);

export default router;