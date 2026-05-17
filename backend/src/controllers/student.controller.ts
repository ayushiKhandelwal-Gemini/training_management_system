import { Request, Response } from "express";
import {
  getAllStudentsService,
  getStudentByIdService,
} from "../services/student.service";

export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await getAllStudentsService();

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const studentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const student = await getStudentByIdService(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
