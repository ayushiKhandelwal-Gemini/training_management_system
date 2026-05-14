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
export const getAllTasksService = async (): Promise<TaskInstance[]> => {
  return await Task.findAll({
    order: [["created_at", "DESC"]],
  });
};

export const getTaskByIdService = async (
  taskId: string
): Promise<TaskInstance | null> => {
  return await Task.findByPk(taskId);
};

export const updateTaskService = async (
  taskId: string,
  payload: Partial<CreateTaskPayload>
): Promise<TaskInstance | null> => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    return null;
  }

  await task.update(payload);

  return task;
};

export const deleteTaskService = async (
  taskId: string
): Promise<TaskInstance | null> => {
  const task = await Task.findByPk(taskId);
  if (!task) {
    return null;
  }

  await task.destroy();

  return task;
};