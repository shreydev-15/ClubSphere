import { apiClient } from './api';

export const eventsService = {
  async getClubEvents(clubId) {
    return apiClient(`/api/clubs/${clubId}/events`, {
      method: 'GET',
    });
  },

  async getEventById(clubId, eventId) {
    return apiClient(`/api/clubs/${clubId}/events/${eventId}`, {
      method: 'GET',
    });
  },

  async createEvent(clubId, { title, description, date, startTime, endTime, location }) {
    return apiClient(`/api/clubs/${clubId}/events`, {
      method: 'POST',
      body: { title, description, date, startTime, endTime, location },
    });
  },

  async updateEvent(clubId, eventId, { title, description, date, startTime, endTime, location }) {
    return apiClient(`/api/clubs/${clubId}/events/${eventId}`, {
      method: 'PATCH',
      body: { title, description, date, startTime, endTime, location },
    });
  },

  async deleteEvent(clubId, eventId) {
    return apiClient(`/api/clubs/${clubId}/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};
