import { Request, Response } from "express";
import { SubmissionService } from "../services/submission.service";
import {
  createSubmissionSchema,
  reviewSubmissionSchema,
} from "../validations/submission.validation";

export class SubmissionController {

  static async create(req: Request, res: Response) {
    try {
      const { error } = createSubmissionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const { assignment_id, file_url } = req.body;

      const result = await SubmissionService.createSubmission({
        assignment_id,
        file_url,
      });

      return res.status(201).json({
        message: "Submission created successfully",
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }


  static async mySubmissions(req: Request, res: Response) {
    try {
      const student_id = (req as any).user.id;

      const data = await SubmissionService.getMySubmissions(student_id);

      return res.status(200).json({ data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async trainerSubmissions(req: Request, res: Response) {
    try {
      const trainer_id = (req as any).user.id;

      const data =
        await SubmissionService.getTrainerSubmissions(trainer_id);

      return res.status(200).json({ data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async reviewSubmission(req: Request, res: Response) {
    try {
      const { error } = reviewSubmissionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const trainer_id = (req as any).user.id;
      const submission_id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const { marks, remarks, status } = req.body;

      const result = await SubmissionService.reviewSubmission(
        submission_id,
        trainer_id,
        {
          marks,
          remarks,
          status,
        }
      );

      return res.status(200).json({
        message: "Submission reviewed successfully",
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}