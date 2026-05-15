import express from "express";

import { getTrainerDashboard,getStudentDashboard } from "../controllers/dashboard.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import { allowRoles } from "../middlewares/role.middleware";

const router = express.Router();

router.get(
  "/trainer",
  authMiddleware,
  allowRoles("TRAINER"),
  getTrainerDashboard,
);

router.get(
  "/student",
  authMiddleware,
  allowRoles("STUDENT"),
  getStudentDashboard
);

export default router;
