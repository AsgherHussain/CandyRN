import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const modules_privacy_policy_create = createAsyncThunk(
  "privacyPolicies/modules_privacy_policy_create",
  async payload => {
    const response = await apiService.modules_privacy_policy_create(payload)
    return response.data
  }
)
export const modules_privacy_policy_read = createAsyncThunk(
  "privacyPolicies/modules_privacy_policy_read",
  async payload => {
    const response = await apiService.modules_privacy_policy_read(payload)
    return response.data
  }
)
export const modules_privacy_policy_update = createAsyncThunk(
  "privacyPolicies/modules_privacy_policy_update",
  async payload => {
    const response = await apiService.modules_privacy_policy_update(payload)
    return response.data
  }
)
export const modules_privacy_policy_partial_update = createAsyncThunk(
  "privacyPolicies/modules_privacy_policy_partial_update",
  async payload => {
    const response = await apiService.modules_privacy_policy_partial_update(
      payload
    )
    return response.data
  }
)
export const modules_privacy_policy_delete = createAsyncThunk(
  "privacyPolicies/modules_privacy_policy_delete",
  async payload => {
    const response = await apiService.modules_privacy_policy_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const privacyPoliciesSlice = createSlice({
  name: "privacyPolicies",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(modules_privacy_policy_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(modules_privacy_policy_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(modules_privacy_policy_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(modules_privacy_policy_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        modules_privacy_policy_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        modules_privacy_policy_partial_update.fulfilled,
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
        modules_privacy_policy_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(modules_privacy_policy_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(modules_privacy_policy_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(modules_privacy_policy_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  modules_privacy_policy_create,
  modules_privacy_policy_read,
  modules_privacy_policy_update,
  modules_privacy_policy_partial_update,
  modules_privacy_policy_delete,
  slice: privacyPoliciesSlice
}
