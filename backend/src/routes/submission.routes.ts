import { Router } from "express";
import { SubmissionController } from "../controllers/submission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

// Student submit task
router.post(
  "/",
  authMiddleware,
  allowRoles("STUDENT"),
  SubmissionController.create
);

// Student view own submissions
router.get(
  "/my",
  authMiddleware,
  allowRoles("STUDENT"),
  SubmissionController.mySubmissions
);

// Trainer view submissions
router.get(
  "/trainer",
  authMiddleware,
  allowRoles("TRAINER"),
  SubmissionController.trainerSubmissions
);

// Trainer review submission
router.put(
  "/:id/review",
  authMiddleware,
  allowRoles("TRAINER"),
  SubmissionController.reviewSubmission
);

export default router;