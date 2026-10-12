import { apiClient } from './api';

export const repliesService = {
  async getDiscussionReplies(clubId, discussionId) {
    return apiClient(`/api/clubs/${clubId}/discussions/${discussionId}/replies`, {
      method: 'GET',
    });
  },

  async createReply(clubId, discussionId, { content }) {
    return apiClient(`/api/clubs/${clubId}/discussions/${discussionId}/replies`, {
      method: 'POST',
      body: { content },
    });
  },
};
