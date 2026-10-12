import { apiClient } from './api';

export const membershipsService = {
  async joinClub(clubId) {
    return apiClient(`/api/clubs/${clubId}/join`, {
      method: 'POST',
    });
  },

  async leaveClub(clubId) {
    return apiClient(`/api/clubs/${clubId}/leave`, {
      method: 'DELETE',
    });
  },

  async getClubMembers(clubId) {
    return apiClient(`/api/clubs/${clubId}/members`, {
      method: 'GET',
    });
  },
};
