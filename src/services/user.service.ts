import { APIS } from "@/common/api";
import { ApiService } from "./api.service";
import type { ApiResponse, UserResponse } from "./types";

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

  public async getProfile(): Promise<ApiResponse<UserResponse>> {
    const response = await this.apiService.get<UserResponse>(
      APIS.USERS.PROFILE
    );

    return response;
  }
}

export const userService = UserService.getInstance();
