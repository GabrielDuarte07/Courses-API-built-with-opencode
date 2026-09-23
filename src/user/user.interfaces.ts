import { z } from "zod";

import { courseResponseSchema } from "../course/course.interfaces.js";

export const createUserSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const updateUserSchema = createUserSchema.partial();

export const userResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const enrollCourseSchema = z.object({
  courseId: z.uuid(),
});

export const unenrollCourseParamsSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
});

export const userCourseResponseSchema = courseResponseSchema.extend({
  enrolledAt: z.date(),
});

export const unenrollCourseResponseSchema = z.object({
  id: z.uuid(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type EnrollCourse = z.infer<typeof enrollCourseSchema>;
export type UnenrollCourseParams = z.infer<typeof unenrollCourseParamsSchema>;
export type UserCourseResponse = z.infer<typeof userCourseResponseSchema>;
export type UnenrollCourseResponse = z.infer<typeof unenrollCourseResponseSchema>;
