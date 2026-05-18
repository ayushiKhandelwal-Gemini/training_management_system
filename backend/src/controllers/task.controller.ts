import { Request, Response } from "express";

import {
  createTaskService,
  deleteTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../validations/task.validation";

const getTaskId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

const parseStudentIds = (value: any): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const student_ids = parseStudentIds(req.body.student_ids);
    const validatedBody = {
      ...req.body,
      student_ids,
    };

    const { error } = createTaskSchema.validate(validatedBody);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const task = await createTaskService({
      title: req.body.title,
      description: req.body.description,
      deadline: req.body.deadline,
      student_ids,
      trainer_id: req.user!.id,
      reference_file_url: req.file ? `/uploads/${req.file.filename}` : null,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasksService(req.user!.id);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await getTaskByIdService(
      getTaskId(req.params.id),
      req.user!.id,
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const student_ids = parseStudentIds(req.body.student_ids);
    const validatedBody = {
      ...req.body,
      student_ids,
    };

    const { error } = updateTaskSchema.validate(validatedBody);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedTask = await updateTaskService(
      getTaskId(req.params.id),
      req.user!.id,
      {
        ...req.body,
        student_ids,
        reference_file_url: req.file
          ? `/uploads/${req.file.filename}`
          : undefined,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await deleteTaskService(
      getTaskId(req.params.id),
      req.user!.id,
    );

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
