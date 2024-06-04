import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_notifications_create = createAsyncThunk(
  "notifications/api_v1_notifications_create",
  async payload => {
    const response = await apiService.api_v1_notifications_create(payload)
    return response.data
  }
)
export const api_v1_notifications_broadcast = createAsyncThunk(
  "notifications/api_v1_notifications_broadcast",
  async payload => {
    const response = await apiService.api_v1_notifications_broadcast(payload)
    return response.data
  }
)
export const api_v1_notifications_read_create = createAsyncThunk(
  "notifications/api_v1_notifications_read_create",
  async payload => {
    const response = await apiService.api_v1_notifications_read_create(payload)
    return response.data
  }
)
export const api_v1_notifications_read = createAsyncThunk(
  "notifications/api_v1_notifications_read",
  async payload => {
    const response = await apiService.api_v1_notifications_read(payload)
    return response.data
  }
)
export const api_v1_notifications_update = createAsyncThunk(
  "notifications/api_v1_notifications_update",
  async payload => {
    const response = await apiService.api_v1_notifications_update(payload)
    return response.data
  }
)
export const api_v1_notifications_partial_update = createAsyncThunk(
  "notifications/api_v1_notifications_partial_update",
  async payload => {
    const response = await apiService.api_v1_notifications_partial_update(
      payload
    )
    return response.data
  }
)
export const api_v1_notifications_delete = createAsyncThunk(
  "notifications/api_v1_notifications_delete",
  async payload => {
    const response = await apiService.api_v1_notifications_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_notifications_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_broadcast.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_broadcast.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_broadcast.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_read_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_read_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_read_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        api_v1_notifications_partial_update.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.map(record =>
              record.id === action.payload.id ? action.payload : record
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        api_v1_notifications_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_notifications_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_notifications_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_notifications_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_notifications_create,
  api_v1_notifications_broadcast,
  api_v1_notifications_read_create,
  api_v1_notifications_read,
  api_v1_notifications_update,
  api_v1_notifications_partial_update,
  api_v1_notifications_delete,
  slice: notificationsSlice
}
