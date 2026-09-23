import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

import {
  createCourseHandler,
  deleteCourseHandler,
  getCourseByIdHandler,
  getCoursesHandler,
  updateCourseHandler,
} from "./course.controller.js";
import {
  courseIdParamsSchema,
  courseResponseSchema,
  createCourseSchema,
  errorResponseSchema,
  updateCourseSchema,
} from "./course.interfaces.js";

const courseRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
): Promise<void> => {
  app.post(
    "/courses",
    {
      schema: {
        body: createCourseSchema,
        response: {
          201: courseResponseSchema,
        },
      },
    },
    createCourseHandler,
  );

  app.get(
    "/courses",
    {
      schema: {
        response: {
          200: z.array(courseResponseSchema),
        },
      },
    },
    getCoursesHandler,
  );

  app.get(
    "/courses/:id",
    {
      schema: {
        params: courseIdParamsSchema,
        response: {
          200: courseResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getCourseByIdHandler,
  );

  app.patch(
    "/courses/:id",
    {
      schema: {
        params: courseIdParamsSchema,
        body: updateCourseSchema,
        response: {
          200: courseResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    updateCourseHandler,
  );

  app.delete(
    "/courses/:id",
    {
      schema: {
        params: courseIdParamsSchema,
        response: {
          200: courseResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    deleteCourseHandler,
  );
};

export { courseRoutes };