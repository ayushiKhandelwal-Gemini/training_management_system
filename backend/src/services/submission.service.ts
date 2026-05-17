import {
  Submission,
  SubmissionCreationAttributes,
  SubmissionInstance,
} from "../models/submission.model";
import {
  TaskAssignment,
  TaskAssignmentInstance,
} from "../models/task_assignments.model";
import { enqueueEmailJob } from "../queues/email.queue";

export interface CreateSubmissionPayload {
  assignment_id: string;
  file_url: string;
}

export interface ReviewSubmissionPayload {
  marks?: number;
  remarks?: string;
  status?: "REVIEWED" | "RESUBMIT_REQUIRED";
}

export class SubmissionService {
 
  static async createSubmission(
    payload: CreateSubmissionPayload
  ): Promise<SubmissionInstance> {
    const assignment = (await TaskAssignment.findByPk(
      payload.assignment_id
    )) as TaskAssignmentInstance | null;

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const existing = await Submission.findOne({
      where: { assignment_id: assignment.id },
    });

    if (existing) {
      throw new Error("Assignment already has a submission");
    }

    const submission = await Submission.create({
      assignment_id: assignment.id,
      file_url: payload.file_url,
      status: "SUBMITTED",
      submitted_at: new Date(),
    } as SubmissionCreationAttributes);

    await assignment.update({
      status: "SUBMITTED",
    });

    const assignmentDetails = (await TaskAssignment.findByPk(assignment.id, {
      include: ["task", "trainer", "student"],
    })) as any;

    if (assignmentDetails?.trainer?.email) {
      void enqueueEmailJob("submission-created", {
        trainerName: assignmentDetails.trainer.name,
        trainerEmail: assignmentDetails.trainer.email,
        studentName: assignmentDetails.student?.name ?? "A student",
        taskTitle: assignmentDetails.task?.title ?? "Assigned task",
        submittedAt: (submission.submitted_at ?? new Date()).toISOString(),
      });
    }

    return submission;
  }


  static async getMySubmissions(
    student_id: string
  ): Promise<SubmissionInstance[]> {
    return Submission.findAll({
      include: [
        {
          model: TaskAssignment,
          as: "assignment",
          where: { student_id },
        },
      ],
    }) as Promise<SubmissionInstance[]>;
  }


  static async getTrainerSubmissions(
    trainer_id: string
  ): Promise<SubmissionInstance[]> {
    return Submission.findAll({
      include: [
        {
          model: TaskAssignment,
          as: "assignment",
          where: { trainer_id },
        },
      ],
    }) as Promise<SubmissionInstance[]>;
  }

  static async reviewSubmission(
    submission_id: string,
    trainer_id: string,
    payload: ReviewSubmissionPayload
  ): Promise<SubmissionInstance> {
    const submission = (await Submission.findByPk(
      submission_id
    )) as SubmissionInstance | null;

    if (!submission) {
      throw new Error("Submission not found");
    }

    const assignment = (await TaskAssignment.findByPk(
      submission.assignment_id
    )) as TaskAssignmentInstance | null;

    if (!assignment || assignment.trainer_id !== trainer_id) {
      throw new Error("Unauthorized to review this submission");
    }

    const updated = await submission.update({
      marks: payload.marks,
      remarks: payload.remarks,
      status: payload.status ?? "REVIEWED",
      reviewed_at: new Date(),
      reviewed_by: trainer_id,
    });

    return updated;
  }
}
