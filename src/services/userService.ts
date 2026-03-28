import api from './api';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  getProfile: () => api.get<UserProfile>('/users/profile'),
};
