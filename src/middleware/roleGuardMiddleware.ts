import {Middleware} from '@reduxjs/toolkit'
import {UserRole} from '../redux/slice/authSlice'

const roleGuardMiddleware: Middleware<{}, any> = (store) => (next) => (action: any) => {
  const userRole = store.getState().auth.user?.role

  if (action.meta?.requiredRole && userRole !== action.meta.requiredRole) {
    console.warn(`Unauthorized action for role: ${userRole}`)
    return
  }
  return next(action)
}

export default roleGuardMiddleware
