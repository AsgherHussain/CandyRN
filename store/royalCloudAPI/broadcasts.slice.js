import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_broadcasts_create = createAsyncThunk(
  "broadcasts/api_v1_broadcasts_create",
  async payload => {
    const response = await apiService.api_v1_broadcasts_create(payload)
    return response.data
  }
)
export const api_v1_broadcasts_read = createAsyncThunk(
  "broadcasts/api_v1_broadcasts_read",
  async payload => {
    const response = await apiService.api_v1_broadcasts_read(payload)
    return response.data
  }
)
export const api_v1_broadcasts_update = createAsyncThunk(
  "broadcasts/api_v1_broadcasts_update",
  async payload => {
    const response = await apiService.api_v1_broadcasts_update(payload)
    return response.data
  }
)
export const api_v1_broadcasts_partial_update = createAsyncThunk(
  "broadcasts/api_v1_broadcasts_partial_update",
  async payload => {
    const response = await apiService.api_v1_broadcasts_partial_update(payload)
    return response.data
  }
)
export const api_v1_broadcasts_delete = createAsyncThunk(
  "broadcasts/api_v1_broadcasts_delete",
  async payload => {
    const response = await apiService.api_v1_broadcasts_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const broadcastsSlice = createSlice({
  name: "broadcasts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_broadcasts_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_broadcasts_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_broadcasts_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_broadcasts_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_broadcasts_partial_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_partial_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_broadcasts_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_broadcasts_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_broadcasts_create,
  api_v1_broadcasts_read,
  api_v1_broadcasts_update,
  api_v1_broadcasts_partial_update,
  api_v1_broadcasts_delete,
  slice: broadcastsSlice
}
