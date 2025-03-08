// my-credit-score-app/src/utils/apiService.ts

// 1. Read the base URL from your .env variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// 2. Example function to get the user's credit score
export async function getUserScore(token: string) {
  const response = await fetch(`${BASE_URL}/api/score`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // If using Firebase Auth or similar, you pass the token in the Authorization header:
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Return the parsed response (e.g., { score: 650, scale: '0–710' })
  return response.json();
}
