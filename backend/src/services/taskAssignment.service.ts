import { Task } from "../models/task.model";
import { User, UserInstance } from "../models/user.model";
import {
  TaskAssignment,
  TaskAssignmentCreationAttributes,
  TaskAssignmentInstance,
} from "../models/task_assignments.model";
import { Op } from "sequelize";

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

    const existing = await TaskAssignment.findAll({
      where: {
        task_id,
        student_id: { [Op.in]: student_ids },
      },
    });

    const alreadyAssigned = new Set(
      (existing as TaskAssignmentInstance[]).map((a) => a.student_id)
    );

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

    return {
      assigned: result.length,
      skipped: student_ids.length - result.length,
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