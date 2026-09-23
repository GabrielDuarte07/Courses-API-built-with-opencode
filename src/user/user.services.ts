import { hash } from "bcryptjs";

import { Prisma } from "../generated/prisma/client.js";
import type {
  CreateUser,
  UpdateUser,
  UserResponse,
} from "./user.interfaces.js";
import {
  findAllUsers,
  findUserByEmail,
  findUserById,
  createUser as insertUser,
  deleteUser as removeUser,
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

export { createUser, deleteUser, getUserById, getUsers, updateUser };
