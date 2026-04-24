import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure robust error interception for backend FastAPI responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let formattedMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      if (Array.isArray(error.response.data?.detail)) {
        // Handle FastAPI validation error arrays
        formattedMessage = error.response.data.detail
          .map(err => `${err.loc.join('.')} - ${err.msg}`)
          .join(', ');
      } else if (error.response.data?.message) {
        // Handle standard string messages
        formattedMessage = error.response.data.message;
      } else if (error.response.status === 500) {
        formattedMessage = 'Internal Server Error. Please contact support.';
      }
    } else if (error.request) {
      formattedMessage = 'Network error. Please check your connection to the database server.';
    }

    // Attach parsed message to error object structure to simplify component-level catching
    error.parsedMessage = formattedMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
