import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { sendMail } from "../services/mailer.service";
import type {
  EmailJobName,
  EmailJobPayload,
  SubmissionCreatedEmailJob,
  TaskAssignedEmailJob,
} from "./email.queue";

const taskAssignedTemplate = (data: TaskAssignedEmailJob) => `
  <h2>New task assigned</h2>
  <p>Hello ${data.studentName},</p>
  <p>${data.trainerName} assigned you a new task.</p>
  <p><strong>Task:</strong> ${data.taskTitle}</p>
  <p><strong>Deadline:</strong> ${new Date(data.deadline).toLocaleString()}</p>
`;

const submissionCreatedTemplate = (data: SubmissionCreatedEmailJob) => `
  <h2>New submission received</h2>
  <p>Hello ${data.trainerName},</p>
  <p>${data.studentName} submitted work for your task.</p>
  <p><strong>Task:</strong> ${data.taskTitle}</p>
  <p><strong>Submitted at:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
`;

export const emailWorker = new Worker<EmailJobPayload, void, EmailJobName>(
  "email-notifications",
  async (job) => {
    if (job.name === "task-assigned") {
      const data = job.data as TaskAssignedEmailJob;
      await sendMail({
        to: data.studentEmail,
        subject: `New task assigned: ${data.taskTitle}`,
        html: taskAssignedTemplate(data),
      });
      return;
    }

    const data = job.data as SubmissionCreatedEmailJob;
    await sendMail({
      to: data.trainerEmail,
      subject: `Submission received: ${data.taskTitle}`,
      html: submissionCreatedTemplate(data),
    });
  },
  {
    connection: redisConnection,
    concurrency: Number(process.env.EMAIL_WORKER_CONCURRENCY ?? 5),
  }
);

emailWorker.on("failed", (job, error) => {
  console.error(`Email job ${job?.id ?? "unknown"} failed`, error);
});
