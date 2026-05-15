import { Router } from "express";
import { SubmissionController } from "../controllers/submission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  allowRoles("STUDENT"),
  SubmissionController.create
);

router.get(
  "/my",
  authMiddleware,
  allowRoles("STUDENT"),
  SubmissionController.mySubmissions
);


router.get(
  "/trainer",
  authMiddleware,
  allowRoles("TRAINER"),
  SubmissionController.trainerSubmissions
);


router.put(
  "/:id/review",
  authMiddleware,
  allowRoles("TRAINER"),
  SubmissionController.reviewSubmission
);

export default router;