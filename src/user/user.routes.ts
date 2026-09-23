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

const userRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
): Promise<void> => {
  app.post(
    "/users",
    {
      schema: {
        body: createUserSchema,
        response: {
          201: userResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    createUserHandler,
  );

  app.get(
    "/users",
    {
      schema: {
        response: {
          200: z.array(userResponseSchema),
        },
      },
    },
    getUsersHandler,
  );

  app.get(
    "/users/:id",
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getUserByIdHandler,
  );

  app.patch(
    "/users/:id",
    {
      schema: {
        params: userIdParamsSchema,
        body: updateUserSchema,
        response: {
          200: userResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    updateUserHandler,
  );

  app.delete(
    "/users/:id",
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: userResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    deleteUserHandler,
  );

  app.get(
    "/users/:id/courses",
    {
      schema: {
        params: userIdParamsSchema,
        response: {
          200: z.array(userCourseResponseSchema),
          404: errorResponseSchema,
        },
      },
    },
    getUserCoursesHandler,
  );

  app.post(
    "/users/:id/courses",
    {
      schema: {
        params: userIdParamsSchema,
        body: enrollCourseSchema,
        response: {
          201: userCourseResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    enrollUserInCourseHandler,
  );

  app.delete(
    "/users/:id/courses/:courseId",
    {
      schema: {
        params: unenrollCourseParamsSchema,
        response: {
          200: unenrollCourseResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    unenrollUserFromCourseHandler,
  );
};

export { userRoutes };
