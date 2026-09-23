import { prisma } from "../prisma-client.js";

import type {
  CourseResponse,
  CourseUserResponse,
  CreateCourse,
  UpdateCourse,
} from "./course.interfaces.js";

function createCourse(data: CreateCourse): Promise<CourseResponse> {
  return prisma.course.create({ data });
}

function findAllCourses(): Promise<CourseResponse[]> {
  return prisma.course.findMany({ orderBy: { startDate: "asc" } });
}

function findCourseById(id: string): Promise<CourseResponse | null> {
  return prisma.course.findUnique({ where: { id } });
}

function updateCourse(id: string, data: UpdateCourse): Promise<CourseResponse> {
  return prisma.course.update({ where: { id }, data });
}

function deleteCourse(id: string): Promise<CourseResponse> {
  return prisma.course.delete({ where: { id } });
}

function findCourseUsers(courseId: string): Promise<CourseUserResponse[]> {
  return prisma.userCourse
    .findMany({
      where: { courseId },
      include: { user: true },
      orderBy: { enrolledAt: "asc" },
    })
    .then((rows) =>
      rows.map(({ enrolledAt, user }) => ({ ...user, enrolledAt })),
    );
}

export {
  createCourse,
  deleteCourse,
  findAllCourses,
  findCourseById,
  findCourseUsers,
  updateCourse,
};