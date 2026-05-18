import { Request, Response } from "express";
import { TaskAssignmentService } from "../services/taskAssignment.service";
import { assignTaskSchema } from "../validations/taskAssignment.validation";

export class TaskAssignmentController {

  static async assignTask(req: Request, res: Response) {
    try {
      const { error } = assignTaskSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const trainer_id = (req as any).user.id; // from auth middleware
      const { task_id, student_ids } = req.body;

      const result = await TaskAssignmentService.assignTaskToStudents(
        task_id,
        student_ids,
        trainer_id
      );

      return res.status(201).json({
        message: "Task assigned successfully",
        result,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  

  static async myAssignments(req: Request, res: Response) {
    try {
      const student_id = (req as any).user.id;

      const data = await TaskAssignmentService.getMyAssignments(student_id);

      return res.status(200).json({ data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async trainerAssignments(req: Request, res: Response) {
    try {
      const trainer_id = (req as any).user.id;

      const data =
        await TaskAssignmentService.getTrainerAssignments(trainer_id);

      return res.status(200).json({ data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}