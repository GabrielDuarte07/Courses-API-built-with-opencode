import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { z } from "zod";

import {
  createUserHandler,
  deleteUserHandler,
  getUserByIdHandler,
  getUsersHandler,
  updateUserHandler,
} from "./user.controller.js";
import {
  createUserSchema,
  errorResponseSchema,
  updateUserSchema,
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
};

export { userRoutes };
