const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Helper method to set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Helper method to remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Helper method to get headers with auth token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    console.log('Making API request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        const error = new Error(data.error || 'Request failed');
        if (data.details) {
          error.details = data.details;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // User methods
  async updateProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}`, {
      method: 'GET',
    });
  }

  // Skills methods
  async getSkills() {
    return this.request('/skills', {
      method: 'GET',
    });
  }

  async createSkill(skillData) {
    return this.request('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  // Swaps methods
  async getSwaps() {
    return this.request('/swaps', {
      method: 'GET',
    });
  }

  async createSwap(swapData) {
    return this.request('/swaps', {
      method: 'POST',
      body: JSON.stringify(swapData),
    });
  }

  // Logout method
  logout() {
    this.removeAuthToken();
    localStorage.removeItem('user');
  }
}

export default new ApiService(); 