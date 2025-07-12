import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// API service class for handling all backend communication
class ApiService {
  private api: AxiosInstance;
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Set auth token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic request method
  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.request({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        if (errorData?.details && Array.isArray(errorData.details)) {
          // Format validation errors, handle missing param
          const validationErrors = errorData.details
            .map((detail: any) => {
              const param = detail.param || detail.path || 'field';
              return `${param}: ${detail.msg}`;
            })
            .join(', ');
          throw new Error(`Validation failed: ${validationErrors}`);
        }
        const message = errorData?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  }

  async register(userData: any) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      data: userData,
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // User endpoints
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUserById(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      data: userData,
    });
  }

  async updateUserSkills(skillsData: any) {
    return this.request<any>('/users/skills', {
      method: 'PUT',
      data: skillsData,
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Skills endpoints
  async getSkills() {
    return this.request<any[]>('/skills');
  }

  async getUserSkills(userId: string) {
    return this.request<any[]>(`/skills/user/${userId}`);
  }

  async getMySkills() {
    return this.request<any[]>('/skills/my-skills');
  }

  async createSkill(skillData: any) {
    return this.request<any>('/skills', {
      method: 'POST',
      data: skillData,
    });
  }

  async updateSkill(id: string, skillData: any) {
    return this.request<any>(`/skills/${id}`, {
      method: 'PUT',
      data: skillData,
    });
  }

  async deleteSkill(id: string) {
    return this.request<void>(`/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // Swaps endpoints
  async getSwaps() {
    return this.request<any[]>('/swaps');
  }

  async createSwap(swapData: any) {
    return this.request<any>('/swaps', {
      method: 'POST',
      data: swapData,
    });
  }

  async updateSwap(id: string, swapData: any) {
    return this.request<any>(`/swaps/${id}`, {
      method: 'PUT',
      data: swapData,
    });
  }

  async deleteSwap(id: string) {
    return this.request<void>(`/swaps/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  async banUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}/ban`, {
      method: 'PUT',
    });
  }

  async unbanUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}/unban`, {
      method: 'PUT',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 