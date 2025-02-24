import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENDPOINTS} from "./endpoints";


export const BASE_URL = 'http://192.168.0.104:8000/';


const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Store tokens
export const storeTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.debug('[API] Tokens stored successfully');
  } catch (error) {
    console.error('[API] Failed to store tokens:', error);
  }
};

// Get access token
export const getAuthorizationToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('[API] Failed to get access token:', error);
    return null;
  }
};

// Get refresh token
const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('[API] Failed to get refresh token:', error);
    return null;
  }
};

// Set tokens (e.g., after login)
export const setAuthorizationToken = async (): Promise<void> => {
  const token = await getAuthorizationToken();
  if (token) {
    console.debug('[API] Token loaded from storage');
  }
};

// Refresh token function
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    console.warn('[API] No refresh token available');
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.token.refresh}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
      await storeTokens(data.access, refreshToken);
      console.debug('[API] Token refreshed successfully');
      return data.access;
    } else {
      console.error('[API] Refresh token failed:', data);
      return null;
    }
  } catch (error) {
    console.error('[API] Error refreshing token:', error);
    return null;
  }
};

// Clear tokens (logout)
export const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    console.debug('[API] Tokens cleared');
  } catch (error) {
    console.error('[API] Failed to clear tokens:', error);
  }
};


export {ENDPOINTS};
