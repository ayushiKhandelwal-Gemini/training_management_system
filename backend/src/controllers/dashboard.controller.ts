import { Request, Response } from "express";

import {
  getTrainerDashboardService,getStudentDashboardService
} from "../services/dashboard.service";


export const getTrainerDashboard = async (
  req: Request,
  res: Response
) => {
  try {
     const trainerId = req.user!.id;


    const dashboardData =
      await getTrainerDashboardService(trainerId);


    return res.status(200).json({
      success: true,
      message: "Trainer dashboard fetched successfully",
      data: dashboardData,
    });
 } catch (error) {
     console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};


export const getStudentDashboard = async (
  req: Request,
  res: Response
) => {

  try {

    const studentId = req.user!.id;

    const dashboardData =
      await getStudentDashboardService(studentId);

    return res.status(200).json({
      success: true,
      message: "Student dashboard fetched successfully",
      data: dashboardData,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};