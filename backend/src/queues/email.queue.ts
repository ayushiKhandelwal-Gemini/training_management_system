import { Queue, type JobsOptions } from "bullmq";
import { redisConnection } from "../config/redis";

export type EmailJobName = "task-assigned" | "submission-created";

export interface TaskAssignedEmailJob {
  trainerName: string;
  studentName: string;
  studentEmail: string;
  taskTitle: string;
  deadline: string;
}

export interface SubmissionCreatedEmailJob {
  trainerName: string;
  trainerEmail: string;
  studentName: string;
  taskTitle: string;
  submittedAt: string;
}

export type EmailJobPayload =
  | TaskAssignedEmailJob
  | SubmissionCreatedEmailJob;

const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5000,
  },
  removeOnComplete: 100,
  removeOnFail: 250,
};

export const emailQueue = new Queue<EmailJobPayload, void, EmailJobName>(
  "email-notifications",
  {
    connection: redisConnection,
    defaultJobOptions,
  }
);

export const enqueueEmailJob = async (
  name: EmailJobName,
  payload: EmailJobPayload
) => {
  try {
    await emailQueue.add(name, payload);
  } catch (error) {
    console.error("Failed to enqueue email job", error);
  }
};
