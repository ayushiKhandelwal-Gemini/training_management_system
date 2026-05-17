import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
})
  .or("name", "email")
  .messages({
    "object.missing": "At least one profile field is required",
  });
