import { Task } from "../models/task.model";
import { User, UserInstance } from "../models/user.model";
import {
  TaskAssignment,
  TaskAssignmentCreationAttributes,
  TaskAssignmentInstance,
} from "../models/task_assignments.model";
import { Op } from "sequelize";
import { enqueueEmailJob } from "../queues/email.queue";

export class TaskAssignmentService {
  static async assignTaskToStudents(
    task_id: string,
    student_ids: string[],
    trainer_id: string
  ) {
    const task = await Task.findByPk(task_id);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.trainer_id !== trainer_id) {
      throw new Error("Task not found");
    }

    const students = await User.findAll({
      where: {
        id: { [Op.in]: student_ids },
      },
    });

    if (students.length !== student_ids.length) {
      throw new Error("Some students not found");
    }

    const invalidUsers = (students as UserInstance[]).filter(
      (u) => u.role !== "STUDENT"
    );
    if (invalidUsers.length > 0) {
      throw new Error("Only STUDENT role users can be assigned tasks");
    }

    const existing = student_ids.length
      ? await TaskAssignment.findAll({
          where: {
            task_id,
            student_id: { [Op.in]: student_ids },
          },
        })
      : [];

    const alreadyAssigned = new Set(
      (existing as TaskAssignmentInstance[]).map((a) => a.student_id)
    );

    const removed = await TaskAssignment.destroy({
      where: {
        task_id,
        trainer_id,
        ...(student_ids.length
          ? { student_id: { [Op.notIn]: student_ids } }
          : {}),
      },
    });

    const newAssignments: TaskAssignmentCreationAttributes[] = student_ids
      .filter((id) => !alreadyAssigned.has(id))
      .map((student_id) => ({
        task_id,
        student_id,
        trainer_id,
        status: "ASSIGNED",
        assigned_at: new Date(),
      }));


    const result = await TaskAssignment.bulkCreate(newAssignments);
    const trainer = await User.findByPk(trainer_id);
    const assignedStudentIds = new Set(
      (result as TaskAssignmentInstance[]).map((assignment) => assignment.student_id)
    );

    (students as UserInstance[])
      .filter((student) => assignedStudentIds.has(student.id))
      .forEach((student) => {
        void enqueueEmailJob("task-assigned", {
          trainerName: trainer?.name ?? "Your trainer",
          studentName: student.name,
          studentEmail: student.email,
          taskTitle: task.title,
          deadline: task.deadline.toISOString(),
        });
      });

    return {
      assigned: result.length,
      skipped: student_ids.length - result.length,
      removed,
      data: result as TaskAssignmentInstance[],
    };
  }


  static async getMyAssignments(student_id: string) {
    return TaskAssignment.findAll({
      where: { student_id },
      include: ["task", "trainer"],
    });
  }

  static async getTrainerAssignments(trainer_id: string) {
    return TaskAssignment.findAll({
      where: { trainer_id },
      include: ["task", "student"],
    });
  }
}
