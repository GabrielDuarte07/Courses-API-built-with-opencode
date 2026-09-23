import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

import {
  createCourseHandler,
  deleteCourseHandler,
  getCourseByIdHandler,
  getCourseUsersHandler,
  getCoursesHandler,
  updateCourseHandler,
} from "./course.controller.js";
import {
  courseIdParamsSchema,
  courseResponseSchema,
  courseUserResponseSchema,
  courseUsersParamsSchema,
  createCourseSchema,
  errorResponseSchema,
  updateCourseSchema,
} from "./course.interfaces.js";

const courseTags = ["courses"];

const courseRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
): Promise<void> => {
  app.post(
    "/courses",
    {
      schema: {
        tags: courseTags,
        summary: "Create a course",
        description:
          "Creates a new course. The end date must be after the start date.",
        body: createCourseSchema,
        response: {
          201: courseResponseSchema.describe("Course created successfully"),
        },
      },
    },
    createCourseHandler,
  );

  app.get(
    "/courses",
    {
      schema: {
        tags: courseTags,
        summary: "List courses",
        description: "Returns all registered courses.",
        response: {
          200: z
            .array(courseResponseSchema)
            .describe("List of all registered courses"),
        },
      },
    },
    getCoursesHandler,
  );

  app.get(
    "/courses/:id",
    {
      schema: {
        tags: courseTags,
        summary: "Get a course by ID",
        description: "Returns the course with the given ID.",
        params: courseIdParamsSchema,
        response: {
          200: courseResponseSchema.describe("The requested course"),
          404: errorResponseSchema.describe("Course not found"),
        },
      },
    },
    getCourseByIdHandler,
  );

  app.patch(
    "/courses/:id",
    {
      schema: {
        tags: courseTags,
        summary: "Update a course",
        description:
          "Partially updates the course with the given ID and returns the updated course.",
        params: courseIdParamsSchema,
        body: updateCourseSchema,
        response: {
          200: courseResponseSchema.describe("Course updated successfully"),
          404: errorResponseSchema.describe("Course not found"),
        },
      },
    },
    updateCourseHandler,
  );

  app.delete(
    "/courses/:id",
    {
      schema: {
        tags: courseTags,
        summary: "Delete a course",
        description: "Deletes the course with the given ID.",
        params: courseIdParamsSchema,
        response: {
          200: courseResponseSchema.describe("Course deleted successfully"),
          404: errorResponseSchema.describe("Course not found"),
        },
      },
    },
    deleteCourseHandler,
  );

  app.get(
    "/courses/:id/users",
    {
      schema: {
        tags: courseTags,
        summary: "List a course's users",
        description:
          "Returns the users enrolled in the course with the given ID.",
        params: courseUsersParamsSchema,
        response: {
          200: z
            .array(courseUserResponseSchema)
            .describe("List of users enrolled in the course"),
          404: errorResponseSchema.describe("Course not found"),
        },
      },
    },
    getCourseUsersHandler,
  );
};

export { courseRoutes };