import type { UserResponse } from "@/types/api.types";

export interface BaseModel {
  _id?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface User extends BaseModel {
  name?: string | null;
  email?: string | null;
}

export function userResponseToUser(response: UserResponse): User {
  return {
    _id: response._id,
    name: response.name ?? null,
    email: response.email ?? null,
    updatedAt: response.updatedAt ? new Date(response.updatedAt) : null,
    createdAt: response.createdAt ? new Date(response.createdAt) : null,
    deletedAt: response.deletedAt ? new Date(response.deletedAt) : null,
  };
}
