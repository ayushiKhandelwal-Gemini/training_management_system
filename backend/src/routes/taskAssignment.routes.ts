import { Router } from "express";
import { TaskAssignmentController } from "../controllers/taskAssignment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = Router();
router.post(
  "/",
  authMiddleware,
  allowRoles("TRAINER"),
  TaskAssignmentController.assignTask
);

router.get(
  "/my",
  authMiddleware,
  allowRoles("STUDENT"),
  TaskAssignmentController.myAssignments
);

router.get(
  "/trainer",
  authMiddleware,
  allowRoles("TRAINER"),
  TaskAssignmentController.trainerAssignments
);

export default router;