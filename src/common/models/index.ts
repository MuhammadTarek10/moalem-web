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
