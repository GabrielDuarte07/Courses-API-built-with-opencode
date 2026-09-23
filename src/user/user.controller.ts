import type { FastifyReply, FastifyRequest } from "fastify";

import type {
  CreateUser,
  UpdateUser,
  UserIdParams,
} from "./user.interfaces.js";
import {
  ConflictError,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  NotFoundError,
  updateUser,
} from "./user.services.js";

function sendDomainError(reply: FastifyReply, err: unknown): boolean {
  if (err instanceof ConflictError) {
    reply.status(409).send({ message: err.message });
    return true;
  }
  if (err instanceof NotFoundError) {
    reply.status(404).send({ message: err.message });
    return true;
  }
  return false;
}

async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUser }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const user = await createUser(request.body);
    reply.status(201).send(user);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function getUsersHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const users = await getUsers();
  reply.send(users);
}

async function getUserByIdHandler(
  request: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const user = await getUserById(request.params.id);
    reply.send(user);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function updateUserHandler(
  request: FastifyRequest<{ Params: UserIdParams; Body: UpdateUser }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const user = await updateUser(request.params.id, request.body);
    reply.send(user);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function deleteUserHandler(
  request: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const user = await deleteUser(request.params.id);
    reply.send(user);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

export {
  createUserHandler,
  deleteUserHandler,
  getUserByIdHandler,
  getUsersHandler,
  updateUserHandler,
};
