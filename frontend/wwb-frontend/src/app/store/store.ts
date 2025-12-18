import { configureStore } from '@reduxjs/toolkit'
import { uiReducer } from './uiSlice'
import { indicatorsReducer } from './indicatorsSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    indicators: indicatorsReducer,
  },
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
