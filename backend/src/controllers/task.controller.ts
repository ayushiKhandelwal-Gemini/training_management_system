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

const getTaskId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;




export const createTask = async (
  req: Request,
  res: Response
) => {
  try {

    const { error } = createTaskSchema.validate(req.body);

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

      trainer_id: req.user!.id,

      reference_file_url: req.file
        ? `/uploads/${req.file.filename}`
        : null,
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




export const getAllTasks = async (
  req: Request,
  res: Response
) => {
  try {

    const tasks = await getAllTasksService();

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


export const getTaskById = async (
  req: Request,
  res: Response
) => {
  try {

    const task = await getTaskByIdService(
      getTaskId(req.params.id)
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


export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {

    const { error } = updateTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedTask = await updateTaskService(
      getTaskId(req.params.id),
      {
        ...req.body,

        reference_file_url: req.file
          ? `/uploads/${req.file.filename}`
          : undefined,
      }
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



export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {

    const deletedTask = await deleteTaskService(
      getTaskId(req.params.id)
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