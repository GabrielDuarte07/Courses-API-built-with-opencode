import type { FastifyReply, FastifyRequest } from "fastify";

import type {
  CreateUser,
  EnrollCourse,
  UnenrollCourseParams,
  UpdateUser,
  UserIdParams,
} from "./user.interfaces.js";
import {
  ConflictError,
  createUser,
  deleteUser,
  enrollUserInCourse,
  getUserById,
  getUserCourses,
  getUsers,
  NotFoundError,
  unenrollUserFromCourse,
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

async function getUserCoursesHandler(
  request: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const courses = await getUserCourses(request.params.id);
    reply.send(courses);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function enrollUserInCourseHandler(
  request: FastifyRequest<{ Params: UserIdParams; Body: EnrollCourse }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const course = await enrollUserInCourse(
      request.params.id,
      request.body.courseId,
    );
    reply.status(201).send(course);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function unenrollUserFromCourseHandler(
  request: FastifyRequest<{ Params: UnenrollCourseParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const result = await unenrollUserFromCourse(
      request.params.id,
      request.params.courseId,
    );
    reply.send(result);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

export {
  createUserHandler,
  deleteUserHandler,
  enrollUserInCourseHandler,
  getUserByIdHandler,
  getUserCoursesHandler,
  getUsersHandler,
  unenrollUserFromCourseHandler,
  updateUserHandler,
};
