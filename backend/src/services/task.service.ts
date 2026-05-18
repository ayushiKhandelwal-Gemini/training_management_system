import { Task, TaskCreationAttributes, TaskInstance } from "../models/task.model";
import { TaskAssignment } from "../models/task_assignments.model";
import { TaskAssignmentService } from "./taskAssignment.service";

export type CreateTaskPayload = Omit<
  TaskCreationAttributes,
  "id" | "created_at" | "updated_at"
> & {
  student_ids?: string[];
};

export const createTaskService = async (
  payload: CreateTaskPayload
): Promise<TaskInstance> => {
  const { student_ids, ...taskData } = payload;
  const task = await Task.create(taskData);

  // Create task assignments if student_ids provided
  if (student_ids && student_ids.length > 0) {
    await TaskAssignmentService.assignTaskToStudents(
      task.id,
      student_ids,
      task.trainer_id
    );
  }

  return task;
};
export const getAllTasksService = async (
  trainerId: string
): Promise<(TaskInstance & { student_ids: string[] })[]> => {
  const tasks = await Task.findAll({
    where: {
      trainer_id: trainerId,
    },
    order: [["created_at", "DESC"]],
    include: [
      {
        model: TaskAssignment,
        as: "assignments",
        attributes: ["student_id"],
      },
    ],
  });

  return tasks.map((task) => {
    const plainTask = task.get({ plain: true }) as any;
    return {
      ...plainTask,
      student_ids: plainTask.assignments?.map(
        (assignment: any) => assignment.student_id,
      ) ?? [],
    };
  });
};

export const getTaskByIdService = async (
  taskId: string,
  trainerId: string
): Promise<TaskInstance | null> => {
  return await Task.findOne({
    where: {
      id: taskId,
      trainer_id: trainerId,
    },
  });
};

export const updateTaskService = async (
  taskId: string,
  trainerId: string,
  payload: Partial<CreateTaskPayload>
): Promise<TaskInstance | null> => {
  const task = await getTaskByIdService(taskId, trainerId);

  if (!task) {
    return null;
  }

  const { student_ids, ...taskData } = payload;

  await task.update(taskData as Partial<TaskCreationAttributes>);

  if (student_ids && student_ids.length > 0) {
    await TaskAssignmentService.assignTaskToStudents(
      taskId,
      student_ids,
      trainerId
    );
  }

  return task;
};

export const deleteTaskService = async (
  taskId: string,
  trainerId: string
): Promise<TaskInstance | null> => {
  const task = await getTaskByIdService(taskId, trainerId);
  if (!task) {
    return null;
  }

  await task.destroy();

  return task;
};
