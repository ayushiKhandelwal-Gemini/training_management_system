import { Task, TaskCreationAttributes, TaskInstance } from "../models/task.model";

export type CreateTaskPayload = Omit<
  TaskCreationAttributes,
  "id" | "created_at" | "updated_at"
>;

export const createTaskService = async (
  payload: CreateTaskPayload
): Promise<TaskInstance> => {
  return await Task.create(payload);
};
export const getAllTasksService = async (
  trainerId: string
): Promise<TaskInstance[]> => {
  return await Task.findAll({
    where: {
      trainer_id: trainerId,
    },
    order: [["created_at", "DESC"]],
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

  await task.update(payload);

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
