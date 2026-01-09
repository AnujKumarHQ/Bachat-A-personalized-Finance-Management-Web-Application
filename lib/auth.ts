const AUTH_KEY = "pfm_auth_user"

export interface AuthUser {
  id: string
  email: string
  name: string
}

export const authUtils = {
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : null
  },

  setCurrentUser: (user: AuthUser) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY)
  },

  isLoggedIn: (): boolean => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(AUTH_KEY) !== null
  },
}
