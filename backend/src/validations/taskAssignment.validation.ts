import Joi from "joi";

export const assignTaskSchema  = Joi.object({
  task_id: Joi.string().uuid().required().messages({
    "string.empty": "Task ID is required",
    "string.uuid": "Task ID must be a valid UUID",
  }),

  student_ids: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": "Student IDs must be an array",
      "array.min": "At least one student is required",
    }),
});