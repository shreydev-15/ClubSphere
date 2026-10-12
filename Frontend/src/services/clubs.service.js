import { apiClient } from './api';

export const clubsService = {
  async getAllClubs() {
    return apiClient('/api/clubs/getAll', {
      method: 'GET',
    });
  },

  async getClubById(clubId) {
    return apiClient(`/api/clubs/getById/${clubId}`, {
      method: 'GET',
    });
  },

  async createClub({ name, description, category }) {
    return apiClient('/api/clubs/create', {
      method: 'POST',
      body: { name, description, category },
    });
  },

  async updateClub(clubId, { name, description, category }) {
    return apiClient(`/api/clubs/update/${clubId}`, {
      method: 'PATCH',
      body: { name, description, category },
    });
  },

  async deleteClub(clubId) {
    return apiClient(`/api/clubs/delete/${clubId}`, {
      method: 'DELETE',
    });
  },
};
