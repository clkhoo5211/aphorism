// Simple API client stub for web3 integration
export const apiClient = {
  getAuthToken: () => {
    return localStorage.getItem('auth_token') || null
  },
  clearAuthTokens: () => {
    localStorage.removeItem('auth_token')
  },
}

