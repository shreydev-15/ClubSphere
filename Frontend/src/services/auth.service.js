import { apiClient, API_BASE_URL, ApiError } from './api';

export const authService = {
  async register({ email, firstname, lastname, password }) {
    const data = await apiClient('/api/auth/register', {
      method: 'POST',
      body: {
        email,
        fullname: {
          firstname,
          lastname,
        },
        password,
      },
    });

    // Check if the backend responded with 200 "User Already Registered" without user/token
    if (!data.user && !data.token) {
      throw new ApiError(data.message || 'User already registered', 409, data);
    }

    return data;
  },

  async login({ email, password }) {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async getMe() {
    return apiClient('/api/auth/me', {
      method: 'GET',
    });
  },

  async logout() {
    return apiClient('/api/auth/logout', {
      method: 'POST',
    });
  },

  getGoogleConnectUrl() {
    return `${API_BASE_URL}/api/auth/google/connect`;
  },
};
