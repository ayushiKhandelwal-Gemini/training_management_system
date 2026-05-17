import express from "express";
import {
  getAllStudents,
  getStudentById,
} from "../controllers/student.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", authMiddleware, allowRoles("TRAINER"), getAllStudents);
router.get("/:id", authMiddleware, allowRoles("TRAINER"), getStudentById);

export default router;
