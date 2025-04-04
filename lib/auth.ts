import type { UserRole } from "@/types/user"

export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem("userRole") as UserRole | null
}

export function isAuthenticated(): boolean {
  return getUserRole() !== null
}

export function hasPermission(requiredRole: UserRole | UserRole[]): boolean {
  const userRole = getUserRole()

  if (!userRole) {
    return false
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }

  return userRole === requiredRole
}

export function logout(): void {
  localStorage.removeItem("userRole")
  window.location.href = "/login"
}

