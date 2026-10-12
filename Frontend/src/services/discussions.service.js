import { apiClient } from './api';

export const discussionsService = {
  async getClubDiscussions(clubId) {
    return apiClient(`/api/clubs/${clubId}/discussions`, {
      method: 'GET',
    });
  },

  async getDiscussionById(clubId, discussionId) {
    return apiClient(`/api/clubs/${clubId}/discussions/${discussionId}`, {
      method: 'GET',
    });
  },

  async createDiscussion(clubId, { title, content }) {
    return apiClient(`/api/clubs/${clubId}/discussions`, {
      method: 'POST',
      body: { title, content },
    });
  },
};
