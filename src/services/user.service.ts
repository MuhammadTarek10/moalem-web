import { APIS } from "@/common/api";
import type { User } from "@/common/models";
import { ApiService } from "./api.service";
import type { ApiResponse } from "./types";

export class UserService {
  private static instance: UserService;
  private readonly apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.apiService.get<User>(
      APIS.USERS.PROFILE
    );

    return response;
  }
}

export const userService = UserService.getInstance();
