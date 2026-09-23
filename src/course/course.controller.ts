import type { FastifyReply, FastifyRequest } from "fastify";

import type {
  CourseIdParams,
  CreateCourse,
  UpdateCourse,
} from "./course.interfaces.js";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseUsers,
  getCourses,
  NotFoundError,
  updateCourse,
} from "./course.services.js";

function sendDomainError(reply: FastifyReply, err: unknown): boolean {
  if (err instanceof NotFoundError) {
    reply.status(404).send({ message: err.message });
    return true;
  }
  return false;
}

async function createCourseHandler(
  request: FastifyRequest<{ Body: CreateCourse }>,
  reply: FastifyReply,
): Promise<void> {
  const course = await createCourse(request.body);
  reply.status(201).send(course);
}

async function getCoursesHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const courses = await getCourses();
  reply.send(courses);
}

async function getCourseByIdHandler(
  request: FastifyRequest<{ Params: CourseIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const course = await getCourseById(request.params.id);
    reply.send(course);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function updateCourseHandler(
  request: FastifyRequest<{ Params: CourseIdParams; Body: UpdateCourse }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const course = await updateCourse(request.params.id, request.body);
    reply.send(course);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function deleteCourseHandler(
  request: FastifyRequest<{ Params: CourseIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const course = await deleteCourse(request.params.id);
    reply.send(course);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

async function getCourseUsersHandler(
  request: FastifyRequest<{ Params: CourseIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  try {
    const users = await getCourseUsers(request.params.id);
    reply.send(users);
  } catch (err) {
    if (!sendDomainError(reply, err)) throw err;
  }
}

export {
  createCourseHandler,
  deleteCourseHandler,
  getCourseByIdHandler,
  getCourseUsersHandler,
  getCoursesHandler,
  updateCourseHandler,
};