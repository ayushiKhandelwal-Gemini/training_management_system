import { Submission } from "../models/submission.model";
import { Task } from "../models/task.model";
import { TaskAssignment } from "../models/task_assignments.model";
import { User } from "../models/user.model";


export const getTrainerDashboardService = async (
  trainerId: string
) => {
     const totalTasks = await Task.count({
    where: {
      trainer_id: trainerId,
    },
  });


  const totalAssignments = await TaskAssignment.count({
    where: {
      trainer_id: trainerId,
    },
  });

    const totalStudents = await User.count({
    where: {
      role: "STUDENT",
    },
  });

  const pendingReviews = await Submission.count({
    where: {
      status: "UNDER_REVIEW",
    },
    include: [
      {
        model: TaskAssignment,
        as: "assignment",
        where: {
          trainer_id: trainerId,
        },
      },
    ],
  });

  const reviewedSubmissions = await Submission.count({
    where: {
      status: "REVIEWED",
    },
    include: [
      {
        model: TaskAssignment,
        as: "assignment",
        where: {
          trainer_id: trainerId,
        },
      },
    ],
  });

   const recentTasks = await Task.findAll({
    where: {
      trainer_id: trainerId,
    },
    order: [["created_at", "DESC"]],
    limit: 5,
  });

   return {
    totalTasks,
    totalAssignments,
    totalStudents,
    pendingReviews,
    reviewedSubmissions,
    recentTasks,
  };
};


export const getStudentDashboardService = async (
  studentId: string
) => {

  // =========================
  // TOTAL ASSIGNED TASKS
  // =========================

  const assignedTasks = await TaskAssignment.count({
    where: {
      student_id: studentId,
    },
  });


  // =========================
  // TOTAL SUBMITTED TASKS
  // =========================

  const submittedTasks = await Submission.count({
    include: [
      {
        model: TaskAssignment,
        as: "assignment",
        where: {
          student_id: studentId,
        },
      },
    ],
  });


  // =========================
  // PENDING TASKS
  // =========================

  const pendingTasks = Math.max(assignedTasks - submittedTasks, 0);


  // =========================
  // REVIEWED TASKS
  // =========================

  const reviewedTasks = await Submission.count({
    where: {
      status: "REVIEWED",
    },

    include: [
      {
        model: TaskAssignment,
        as: "assignment",
        where: {
          student_id: studentId,
        },
      },
    ],
  });


  // =========================
  // RECENT ASSIGNMENTS
  // =========================

  const recentAssignments =
    await TaskAssignment.findAll({

      where: {
        student_id: studentId,
      },

      include: [
        {
          model: Task,
          as: "task",
        },
        {
          model: User,
          as: "trainer",
          attributes: {
            exclude: ["password"],
          },
        },
      ],

      order: [["assigned_at", "DESC"]],

      limit: 5,
    });


  return {
    assignedTasks,
    submittedTasks,
    pendingTasks,
    reviewedTasks,
    recentAssignments,
  };
};
