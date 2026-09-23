import { prisma } from "../prisma-client.js";

import type {
  CreateUser,
  UpdateUser,
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

export {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUser,
};
