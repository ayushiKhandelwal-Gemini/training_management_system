import { User } from "../models/user.model";

export const getAllStudentsService = async () => {
  return User.findAll({
    where: {
      role: "STUDENT",
    },
    attributes: {
      exclude: ["password"],
    },
    order: [["name", "ASC"]],
  });
};

export const getStudentByIdService = async (id: string) => {
  return User.findOne({
    where: {
      id,
      role: "STUDENT",
    },
    attributes: {
      exclude: ["password"],
    },
  });
};
