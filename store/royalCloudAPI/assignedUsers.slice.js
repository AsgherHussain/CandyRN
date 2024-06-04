import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_assigned_user_create = createAsyncThunk(
  "assignedUsers/api_v1_assigned_user_create",
  async payload => {
    const response = await apiService.api_v1_assigned_user_create(payload)
    return response.data
  }
)
export const api_v1_assigned_user_read = createAsyncThunk(
  "assignedUsers/api_v1_assigned_user_read",
  async payload => {
    const response = await apiService.api_v1_assigned_user_read(payload)
    return response.data
  }
)
export const api_v1_assigned_user_update = createAsyncThunk(
  "assignedUsers/api_v1_assigned_user_update",
  async payload => {
    const response = await apiService.api_v1_assigned_user_update(payload)
    return response.data
  }
)
export const api_v1_assigned_user_partial_update = createAsyncThunk(
  "assignedUsers/api_v1_assigned_user_partial_update",
  async payload => {
    const response = await apiService.api_v1_assigned_user_partial_update(
      payload
    )
    return response.data
  }
)
export const api_v1_assigned_user_delete = createAsyncThunk(
  "assignedUsers/api_v1_assigned_user_delete",
  async payload => {
    const response = await apiService.api_v1_assigned_user_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const assignedUsersSlice = createSlice({
  name: "assignedUsers",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_assigned_user_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_assigned_user_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_assigned_user_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_assigned_user_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        api_v1_assigned_user_partial_update.fulfilled,
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
        api_v1_assigned_user_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_assigned_user_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_assigned_user_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_assigned_user_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_assigned_user_create,
  api_v1_assigned_user_read,
  api_v1_assigned_user_update,
  api_v1_assigned_user_partial_update,
  api_v1_assigned_user_delete,
  slice: assignedUsersSlice
}
