import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_admin_confirmed_orders_create = createAsyncThunk(
  "adminOrders/api_v1_admin_confirmed_orders_create",
  async payload => {
    const response = await apiService.api_v1_admin_confirmed_orders_create(
      payload
    )
    return response.data
  }
)
export const api_v1_admin_confirmed_orders_read = createAsyncThunk(
  "adminOrders/api_v1_admin_confirmed_orders_read",
  async payload => {
    const response = await apiService.api_v1_admin_confirmed_orders_read(
      payload
    )
    return response.data
  }
)
export const api_v1_admin_confirmed_orders_update = createAsyncThunk(
  "adminOrders/api_v1_admin_confirmed_orders_update",
  async payload => {
    const response = await apiService.api_v1_admin_confirmed_orders_update(
      payload
    )
    return response.data
  }
)
export const api_v1_admin_confirmed_orders_partial_update = createAsyncThunk(
  "adminOrders/api_v1_admin_confirmed_orders_partial_update",
  async payload => {
    const response = await apiService.api_v1_admin_confirmed_orders_partial_update(
      payload
    )
    return response.data
  }
)
export const api_v1_admin_confirmed_orders_delete = createAsyncThunk(
  "adminOrders/api_v1_admin_confirmed_orders_delete",
  async payload => {
    const response = await apiService.api_v1_admin_confirmed_orders_delete(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(
        api_v1_admin_confirmed_orders_create.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_admin_confirmed_orders_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        api_v1_admin_confirmed_orders_read.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = [
              ...state.entities.filter(
                record => record.id !== action.payload.id
              ),
              action.payload
            ]
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_admin_confirmed_orders_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(
        api_v1_admin_confirmed_orders_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_update.fulfilled,
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
        api_v1_admin_confirmed_orders_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_partial_update.fulfilled,
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
        api_v1_admin_confirmed_orders_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_delete.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_delete.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.filter(
              record => record.id !== action.meta.arg?.id
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        api_v1_admin_confirmed_orders_delete.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
  }
})
export default {
  api_v1_admin_confirmed_orders_create,
  api_v1_admin_confirmed_orders_read,
  api_v1_admin_confirmed_orders_update,
  api_v1_admin_confirmed_orders_partial_update,
  api_v1_admin_confirmed_orders_delete,
  slice: adminOrdersSlice
}
