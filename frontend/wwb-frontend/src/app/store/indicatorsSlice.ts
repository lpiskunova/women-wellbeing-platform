import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import { getIndicators, type IndicatorsListResult } from '@/shared/api/indicators'
import { getErrorMessage } from '@/shared/api/apiError'

type State = {
  items: Indicator[]
  total: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: State = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
}

export const fetchIndicators = createAsyncThunk<
  IndicatorsListResult,
  void,
  { rejectValue: string }
>('indicators/fetchIndicators', async (_, { rejectWithValue }) => {
  try {
    return await getIndicators()
  } catch (e) {
    return rejectWithValue(getErrorMessage(e))
  }
})

const slice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchIndicators.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchIndicators.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchIndicators.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load indicators'
      })
  },
})

export const indicatorsReducer = slice.reducer
