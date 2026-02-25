import { ApiService } from "./api.service";
import { APIS } from "@/common/api";
import type {
  ApiResponse,
  SignInRequest,
  SignUpRequest,
  TokenResponse,
} from "./types";

export class AuthService {
  private static instance: AuthService;
  private readonly apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signIn(
    body: SignInRequest
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.apiService.post<TokenResponse>(
      APIS.AUTH.SIGN_IN,
      body
    );

    return response;
  }

  public async signUp(
    body: SignUpRequest
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.apiService.post<TokenResponse>(
      APIS.AUTH.SIGN_UP,
      body
    );

    return response;
  }

  public async refreshToken(): Promise<ApiResponse<TokenResponse>> {
    const response = await this.apiService.post<TokenResponse>(
      APIS.AUTH.REFRESH
    );

    return response;
  }

  public async signOut(): Promise<ApiResponse<void>> {
    const response = await this.apiService.post<void>(
      APIS.AUTH.SIGN_OUT
    );

    return response;
  }
}

export const authService = AuthService.getInstance();
