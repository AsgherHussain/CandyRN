import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_admin_invoices_create = createAsyncThunk(
  "invoices/api_v1_admin_invoices_create",
  async payload => {
    const response = await apiService.api_v1_admin_invoices_create(payload)
    return response.data
  }
)
export const api_v1_admin_invoices_read = createAsyncThunk(
  "invoices/api_v1_admin_invoices_read",
  async payload => {
    const response = await apiService.api_v1_admin_invoices_read(payload)
    return response.data
  }
)
export const api_v1_admin_invoices_update = createAsyncThunk(
  "invoices/api_v1_admin_invoices_update",
  async payload => {
    const response = await apiService.api_v1_admin_invoices_update(payload)
    return response.data
  }
)
export const api_v1_admin_invoices_partial_update = createAsyncThunk(
  "invoices/api_v1_admin_invoices_partial_update",
  async payload => {
    const response = await apiService.api_v1_admin_invoices_partial_update(
      payload
    )
    return response.data
  }
)
export const api_v1_admin_invoices_delete = createAsyncThunk(
  "invoices/api_v1_admin_invoices_delete",
  async payload => {
    const response = await apiService.api_v1_admin_invoices_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_admin_invoices_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_admin_invoices_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_admin_invoices_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_admin_invoices_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        api_v1_admin_invoices_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        api_v1_admin_invoices_partial_update.fulfilled,
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
        api_v1_admin_invoices_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_admin_invoices_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_admin_invoices_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_admin_invoices_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_admin_invoices_create,
  api_v1_admin_invoices_read,
  api_v1_admin_invoices_update,
  api_v1_admin_invoices_partial_update,
  api_v1_admin_invoices_delete,
  slice: invoicesSlice
}
