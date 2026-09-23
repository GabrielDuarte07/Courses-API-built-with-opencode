import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

import {
  createUserHandler,
  deleteUserHandler,
  enrollUserInCourseHandler,
  getUserByIdHandler,
  getUserCoursesHandler,
  getUsersHandler,
  unenrollUserFromCourseHandler,
  updateUserHandler,
} from "./user.controller.js";
import {
  createUserSchema,
  enrollCourseSchema,
  errorResponseSchema,
  unenrollCourseParamsSchema,
  unenrollCourseResponseSchema,
  updateUserSchema,
  userCourseResponseSchema,
  userIdParamsSchema,
  userResponseSchema,
} from "./user.interfaces.js";

const userTags = ["users"];

const userRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
): Promise<void> => {
  app.post(
    "/users",
    {
      schema: {
        tags: userTags,
        summary: "Create a user",
        description: "Creates a new user and returns the created user.",
        body: createUserSchema,
        response: {
          201: userResponseSchema.describe("User created successfully"),
          409: errorResponseSchema.describe(
            "A user with this email already exists",
          ),
        },
      },
    },
    createUserHandler,
  );

  app.get(
    "/users",
    {
      schema: {
        tags: userTags,
        summary: "List users",
        description: "Returns all registered users.",
        response: {
          200: z
            .array(userResponseSchema)
            .describe("List of all registered users"),
        },
      },
    },
    getUsersHandler,
  );

  app.get(
    "/users/:id",
    {
      schema: {
        tags: userTags,
        summary: "Get a user by ID",
        description: "Returns the user with the given ID.",
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema.describe("The requested user"),
          404: errorResponseSchema.describe("User not found"),
        },
      },
    },
    getUserByIdHandler,
  );

  app.patch(
    "/users/:id",
    {
      schema: {
        tags: userTags,
        summary: "Update a user",
        description:
          "Partially updates the user with the given ID and returns the updated user.",
        params: userIdParamsSchema,
        body: updateUserSchema,
        response: {
          200: userResponseSchema.describe("User updated successfully"),
          404: errorResponseSchema.describe("User not found"),
          409: errorResponseSchema.describe(
            "A user with this email already exists",
          ),
        },
      },
    },
    updateUserHandler,
  );

  app.delete(
    "/users/:id",
    {
      schema: {
        tags: userTags,
        summary: "Delete a user",
        description: "Deletes the user with the given ID.",
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema.describe("User deleted successfully"),
          404: errorResponseSchema.describe("User not found"),
        },
      },
    },
    deleteUserHandler,
  );

  app.get(
    "/users/:id/courses",
    {
      schema: {
        tags: userTags,
        summary: "List a user's courses",
        description:
          "Returns the courses the user with the given ID is enrolled in.",
        params: userIdParamsSchema,
        response: {
          200: z
            .array(userCourseResponseSchema)
            .describe("List of courses the user is enrolled in"),
          404: errorResponseSchema.describe("User not found"),
        },
      },
    },
    getUserCoursesHandler,
  );

  app.post(
    "/users/:id/courses",
    {
      schema: {
        tags: userTags,
        summary: "Enroll a user in a course",
        description:
          "Enrolls the user with the given ID in a course and returns the course with the enrollment date.",
        params: userIdParamsSchema,
        body: enrollCourseSchema,
        response: {
          201: userCourseResponseSchema.describe(
            "User enrolled in the course successfully",
          ),
          404: errorResponseSchema.describe("User or course not found"),
          409: errorResponseSchema.describe(
            "User is already enrolled in this course",
          ),
        },
      },
    },
    enrollUserInCourseHandler,
  );

  app.delete(
    "/users/:id/courses/:courseId",
    {
      schema: {
        tags: userTags,
        summary: "Unenroll a user from a course",
        description:
          "Unenrolls the user with the given ID from the course with the given ID.",
        params: unenrollCourseParamsSchema,
        response: {
          200: unenrollCourseResponseSchema.describe(
            "User unenrolled from the course successfully",
          ),
          404: errorResponseSchema.describe("User or enrollment not found"),
        },
      },
    },
    unenrollUserFromCourseHandler,
  );
};

export { userRoutes };