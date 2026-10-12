const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    ...customConfig
  } = options;

  const config = {
    method,
    headers: {
      ...headers,
    },
    // Always include credentials so HttpOnly cookies are attached across requests
    credentials: 'include',
    ...customConfig,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError(
      'Unable to connect to server. Please check your network connection.',
      0,
      networkError
    );
  }

  // Parse response body safely
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = { message: text };
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export { API_BASE_URL, ApiError };
