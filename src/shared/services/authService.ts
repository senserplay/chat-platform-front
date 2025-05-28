import axios from "axios";
import { apiInstance } from "../api/apiConfig";

const api = apiInstance;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface LoginResponce {
  token: string;
}

export interface UserInfo {
  username?: string;
  message?: string;
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

const saveToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const removeToken = (): void => {
  localStorage.removeItem("auth_token");
};

export const setupAuthInterceptor = (): void => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

const encodeFormData = (data: Record<string, string>): string => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
};

export const login = async ({
  email,
  password,
}: LoginCredentials): Promise<LoginResponce> => {
  try {
    const response = await api.post<LoginResponce>(
      "/user/login",
      { email, password },
      {}
    );

    if (response) {
      saveToken(response.data.token);
      setupAuthInterceptor();
    }
    console.log('логинизация прошла успешно')
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new AuthError(
        error.response.data.detail || "Ошибка входа",
        error.response.status
      );
    }
    throw new Error("Произошла неизвестная ошибка при входе");
  }
};

export const register = async ({
  username,
  password,
  email,
}: RegisterCredentials): Promise<{ token: string }> => {
  try {
    const response = await api.post<{ token: string }>(
      "/user/registration",
      { username, password, email },
      {}
    );
    if (response) {
      saveToken(response.data.token);
      setupAuthInterceptor();
      
    }
    console.log("token smth", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new AuthError(
        JSON.stringify(error.response.data) || "Ошибка регистрации",
        error.response.status
      );
    }
    throw new Error("Произошла неизвестная ошибка при регистрации");
  }
};

// export const getCurrentUser = async (): Promise<UserInfo> => {
//   try {
//     const token = getToken();
//     if (!token) {
//       throw new AuthError("Не авторизован", 401);
//     }

//     const response = await api.get<UserInfo>("/auth/whoami/", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       if (error.response.status === 401) {
//         removeToken();
//       }
//       throw new AuthError(
//         error.response.data.detail || "Ошибка получения данных пользователя",
//         error.response.status
//       );
//     }
//     throw new Error(
//       "Произошла неизвестная ошибка при получении данных пользователя"
//     );
//   }
// };

export const logout = (): void => {
  removeToken();
};

export default {
  login,
  register,
  logout,
  // getCurrentUser,
  isAuthenticated,
  getToken,
  setupAuthInterceptor,
};
