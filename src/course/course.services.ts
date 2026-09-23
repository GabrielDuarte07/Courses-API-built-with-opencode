import type {
  CourseResponse,
  CourseUserResponse,
  CreateCourse,
  UpdateCourse,
} from "./course.interfaces.js";
import {
  createCourse as insertCourse,
  deleteCourse as removeCourse,
  findAllCourses,
  findCourseById,
  findCourseUsers,
  updateCourse as updateCourseRecord,
} from "./course.repository.js";

export class NotFoundError extends Error {}

function getCourses(): Promise<CourseResponse[]> {
  return findAllCourses();
}

async function getCourseById(id: string): Promise<CourseResponse> {
  const course = await findCourseById(id);
  if (course === null) {
    throw new NotFoundError("Course not found");
  }
  return course;
}

function createCourse(data: CreateCourse): Promise<CourseResponse> {
  return insertCourse(data);
}

async function updateCourse(
  id: string,
  data: UpdateCourse,
): Promise<CourseResponse> {
  await getCourseById(id);
  return updateCourseRecord(id, data);
}

async function deleteCourse(id: string): Promise<CourseResponse> {
  await getCourseById(id);
  return removeCourse(id);
}

async function getCourseUsers(courseId: string): Promise<CourseUserResponse[]> {
  await getCourseById(courseId);
  return findCourseUsers(courseId);
}

export {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseUsers,
  getCourses,
  updateCourse,
};