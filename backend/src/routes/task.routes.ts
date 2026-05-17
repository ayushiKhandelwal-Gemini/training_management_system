import express from "express";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import { allowRoles } from "../middlewares/role.middleware";

import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  allowRoles("TRAINER"),
  upload.single("reference_file"),
  createTask,
);

router.get("/", authMiddleware, allowRoles("TRAINER"), getAllTasks);
router.get("/:id", authMiddleware, allowRoles("TRAINER"), getTaskById);

router.put(
  "/:id",
  authMiddleware,
  allowRoles("TRAINER"),
  upload.single("reference_file"),
  updateTask,
);
router.delete("/:id", authMiddleware, allowRoles("TRAINER"), deleteTask);

export default router;
