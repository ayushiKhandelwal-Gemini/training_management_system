import * as Yup from "yup";

export const taskSchema = Yup.object({
  title: Yup.string().min(3, "Use at least 3 characters").required("Title is required"),
  description: Yup.string().optional(),
  deadline: Yup.string().required("Deadline is required"),
});

export const reviewSchema = Yup.object({
  marks: Yup.number().min(0, "Marks cannot be negative").optional(),
  remarks: Yup.string().max(1000, "Remarks are too long").optional(),
  status: Yup.string().oneOf(["REVIEWED", "RESUBMIT_REQUIRED"]).required("Status is required"),
});
