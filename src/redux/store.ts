import {combineReducers, configureStore} from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import documentReducer from './slice/documentSlice'
import roleGuardMiddleware from '../middleware/roleGuardMiddleware'
import logger from 'redux-logger'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}
const reducers = combineReducers({auth: authReducer, document: documentReducer})
// const persistedAuthReducer = persistReducer(persistConfig, authReducer)
const persistedReducer = persistReducer(persistConfig, reducers)

let middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(roleGuardMiddleware)

if (process.env.NODE_ENV === 'development') {
  middleware = (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(roleGuardMiddleware, logger)
}

const store = configureStore({
  reducer: persistedReducer,
  middleware,
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export default store

export type AppDispatch = typeof store.dispatch
