import type {
  CourseResponse,
  CreateCourse,
  UpdateCourse,
} from "./course.interfaces.js";
import {
  createCourse as insertCourse,
  deleteCourse as removeCourse,
  findAllCourses,
  findCourseById,
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

export { createCourse, deleteCourse, getCourseById, getCourses, updateCourse };