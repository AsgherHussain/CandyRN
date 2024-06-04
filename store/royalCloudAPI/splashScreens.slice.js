import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_splash_screen_create = createAsyncThunk(
  "splashScreens/api_v1_splash_screen_create",
  async payload => {
    const response = await apiService.api_v1_splash_screen_create(payload)
    return response.data
  }
)
export const api_v1_splash_screen_read = createAsyncThunk(
  "splashScreens/api_v1_splash_screen_read",
  async payload => {
    const response = await apiService.api_v1_splash_screen_read(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const splashScreensSlice = createSlice({
  name: "splashScreens",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_splash_screen_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_splash_screen_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_splash_screen_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_splash_screen_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_splash_screen_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_splash_screen_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_splash_screen_create,
  api_v1_splash_screen_read,
  slice: splashScreensSlice
}
