import Joi from "joi";

export const createSubmissionSchema = Joi.object({
  assignment_id: Joi.string().uuid().required().messages({
    "string.uuid": "Assignment ID must be a valid UUID",
    "any.required": "Assignment ID is required",
  }),

  file_url: Joi.string().required().messages({
    "any.required": "File URL is required",
  }),
});

export const reviewSubmissionSchema = Joi.object({
  marks: Joi.number().integer().min(0).optional(),
  remarks: Joi.string().max(1000).optional(),
  status: Joi.string()
    .valid("REVIEWED", "RESUBMIT_REQUIRED")
    .optional(),
})
  .or("marks", "remarks", "status")
  .messages({
    "object.missing": "At least one of marks, remarks, or status is required",
  });