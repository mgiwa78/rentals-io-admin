import {RootState} from '../store'

export const selectAuth = (state: RootState) => state.auth

export const selectIsAuthenticated = (state: RootState) => selectAuth(state).isAuthenticated
export const selectUser = (state: RootState) => selectAuth(state).user
export const selectToken = (state: RootState) => selectAuth(state).token
