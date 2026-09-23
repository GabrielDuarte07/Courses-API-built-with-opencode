import { z } from "zod";

const courseBaseSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(500).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

function isDateRangeValid(data: {
  startDate?: Date;
  endDate?: Date;
}): boolean {
  return (
    data.startDate === undefined ||
    data.endDate === undefined ||
    data.endDate > data.startDate
  );
}

export const createCourseSchema = courseBaseSchema.refine(isDateRangeValid, {
  message: "End date must be after the start date",
  path: ["endDate"],
});

export const updateCourseSchema = courseBaseSchema.partial().refine(
  isDateRangeValid,
  {
    message: "End date must be after the start date",
    path: ["endDate"],
  },
);

export const courseResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const courseIdParamsSchema = z.object({
  id: z.uuid(),
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
export type CourseResponse = z.infer<typeof courseResponseSchema>;
export type CourseIdParams = z.infer<typeof courseIdParamsSchema>;