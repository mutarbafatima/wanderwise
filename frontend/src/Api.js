// FILE: services/api.js

const BASE_URL = "http://localhost:5000/api";
const BASE = process.env.REACT_APP_API_URL || "";

export const fetchRecommendations = async (filters = {}) => {
  // Build query string from filters if any are passed
  // Example: { travelType: 'relaxing', budget: 'moderate' }
  const params = new URLSearchParams();

  if (filters.travelType) params.append("travelType", filters.travelType);
  if (filters.budget) params.append("budget", filters.budget);
  if (filters.region) params.append("region", filters.region);

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/recommendations?${queryString}`
    : `${BASE_URL}/recommendations`;

  const response = await fetch(url);

  // If server returned an error status
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  return response.json();
};
