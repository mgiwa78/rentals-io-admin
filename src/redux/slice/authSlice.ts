import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import User from '../../types/User'
export enum UserRole {
  Admin = 'Admin',
  Supervisor = 'Supervisor',
  Student = 'Student',
}
interface AuthState {
  isAuthenticated: boolean
  user: null | User
  token: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{userAuth: User; userJwt: string}>) {
      console.log(action.payload.userAuth)
      console.log(action.payload)
      state.isAuthenticated = true

      state.user = action.payload.userAuth
      state.token = action.payload.userJwt
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
  },
})

export const {loginSuccess, logout} = authSlice.actions
export default authSlice.reducer
