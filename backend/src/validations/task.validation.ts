import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 255 characters",
      "any.required": "Title is required",
    }),

  description: Joi.string()
    .allow("")
    .optional(),

  deadline: Joi.date()
    .greater("now")
    .required()
    .messages({
      "date.base": "Deadline must be a valid date",
      "date.greater": "Deadline must be a future date",
      "any.required": "Deadline is required",
    }),

  reference_file_url: Joi.string()
    .optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .optional(),

  description: Joi.string()
    .allow("")
    .optional(),

  deadline: Joi.date()
    .greater("now")
    .optional(),

  reference_file_url: Joi.string()
    .optional(),
});