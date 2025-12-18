import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'
export type Language = 'en' | 'ru'

type UiState = {
  theme: Theme
  language: Language
}

const initialState: UiState = {
  theme: 'light',
  language: 'en',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
    },
  },
})

export const { setTheme, toggleTheme, setLanguage } = uiSlice.actions
export const uiReducer = uiSlice.reducer
