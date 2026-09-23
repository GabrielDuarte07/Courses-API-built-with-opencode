import { hash } from "bcryptjs";

import { findCourseById } from "../course/course.repository.js";
import { Prisma } from "../generated/prisma/client.js";
import type {
  CreateUser,
  UnenrollCourseResponse,
  UpdateUser,
  UserCourseResponse,
  UserResponse,
} from "./user.interfaces.js";
import {
  enrollUserInCourse as insertEnrollment,
  findAllUsers,
  findUserByEmail,
  findUserById,
  createUser as insertUser,
  deleteUser as removeUser,
  findUserCourses,
  unenrollUserFromCourse as removeEnrollment,
  updateUser as updateUserRecord,
} from "./user.repository.js";

const SALT_ROUNDS = 10;

export class ConflictError extends Error {}

export class NotFoundError extends Error {}

function isUniqueConstraintError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}

function isNotFoundError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025"
  );
}

async function createUser(data: CreateUser): Promise<UserResponse> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const password = await hash(data.password, SALT_ROUNDS);
  try {
    return await insertUser({ name: data.name, email: data.email, password });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictError("Email already in use");
    }
    throw err;
  }
}

function getUsers(): Promise<UserResponse[]> {
  return findAllUsers();
}

async function getUserById(id: string): Promise<UserResponse> {
  const user = await findUserById(id);
  if (user === null) {
    throw new NotFoundError("User not found");
  }
  return user;
}

async function updateUser(id: string, data: UpdateUser): Promise<UserResponse> {
  await getUserById(id);

  const updateData: UpdateUser = { ...data };
  if (updateData.password !== undefined) {
    updateData.password = await hash(updateData.password, SALT_ROUNDS);
  }

  try {
    return await updateUserRecord(id, updateData);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictError("Email already in use");
    }
    throw err;
  }
}

async function deleteUser(id: string): Promise<UserResponse> {
  await getUserById(id);
  return removeUser(id);
}

async function getUserCourses(userId: string): Promise<UserCourseResponse[]> {
  await getUserById(userId);
  return findUserCourses(userId);
}

async function enrollUserInCourse(
  userId: string,
  courseId: string,
): Promise<UserCourseResponse> {
  await getUserById(userId);

  const course = await findCourseById(courseId);
  if (course === null) {
    throw new NotFoundError("Course not found");
  }

  try {
    return await insertEnrollment(userId, courseId);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new ConflictError("User is already enrolled in this course");
    }
    throw err;
  }
}

async function unenrollUserFromCourse(
  userId: string,
  courseId: string,
): Promise<UnenrollCourseResponse> {
  await getUserById(userId);

  try {
    return await removeEnrollment(userId, courseId);
  } catch (err) {
    if (isNotFoundError(err)) {
      throw new NotFoundError("Enrollment not found");
    }
    throw err;
  }
}

export {
  createUser,
  deleteUser,
  enrollUserInCourse,
  getUserById,
  getUserCourses,
  getUsers,
  unenrollUserFromCourse,
  updateUser,
};
