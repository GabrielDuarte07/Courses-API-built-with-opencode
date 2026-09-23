import { prisma } from "../prisma-client.js";

import type {
  CreateUser,
  UnenrollCourseResponse,
  UpdateUser,
  UserCourseResponse,
  UserResponse,
} from "./user.interfaces.js";

// NOTE: the shared Prisma client has `omit.password` configured, so user
// records returned here never include the hashed password.

function createUser(data: CreateUser): Promise<UserResponse> {
  return prisma.user.create({ data });
}

function findAllUsers(): Promise<UserResponse[]> {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

function findUserById(id: string): Promise<UserResponse | null> {
  return prisma.user.findUnique({ where: { id } });
}

function findUserByEmail(email: string): Promise<UserResponse | null> {
  return prisma.user.findUnique({ where: { email } });
}

function updateUser(id: string, data: UpdateUser): Promise<UserResponse> {
  return prisma.user.update({ where: { id }, data });
}

function deleteUser(id: string): Promise<UserResponse> {
  return prisma.user.delete({ where: { id } });
}

function findUserCourses(userId: string): Promise<UserCourseResponse[]> {
  return prisma.userCourse
    .findMany({
      where: { userId },
      include: { course: true },
      orderBy: { enrolledAt: "asc" },
    })
    .then((rows) =>
      rows.map(({ enrolledAt, course }) => ({ ...course, enrolledAt })),
    );
}

function enrollUserInCourse(
  userId: string,
  courseId: string,
): Promise<UserCourseResponse> {
  return prisma.userCourse
    .create({
      data: { userId, courseId },
      include: { course: true },
    })
    .then(({ enrolledAt, course }) => ({ ...course, enrolledAt }));
}

function unenrollUserFromCourse(
  userId: string,
  courseId: string,
): Promise<UnenrollCourseResponse> {
  return prisma.userCourse
    .delete({ where: { userId_courseId: { userId, courseId } } })
    .then(({ id }) => ({ id }));
}

export {
  createUser,
  deleteUser,
  enrollUserInCourse,
  findAllUsers,
  findUserByEmail,
  findUserById,
  findUserCourses,
  unenrollUserFromCourse,
  updateUser,
};
