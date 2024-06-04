import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const modules_terms_and_conditions_create = createAsyncThunk(
  "termAndConditions/modules_terms_and_conditions_create",
  async payload => {
    const response = await apiService.modules_terms_and_conditions_create(
      payload
    )
    return response.data
  }
)
export const modules_terms_and_conditions_read = createAsyncThunk(
  "termAndConditions/modules_terms_and_conditions_read",
  async payload => {
    const response = await apiService.modules_terms_and_conditions_read(payload)
    return response.data
  }
)
export const modules_terms_and_conditions_update = createAsyncThunk(
  "termAndConditions/modules_terms_and_conditions_update",
  async payload => {
    const response = await apiService.modules_terms_and_conditions_update(
      payload
    )
    return response.data
  }
)
export const modules_terms_and_conditions_partial_update = createAsyncThunk(
  "termAndConditions/modules_terms_and_conditions_partial_update",
  async payload => {
    const response = await apiService.modules_terms_and_conditions_partial_update(
      payload
    )
    return response.data
  }
)
export const modules_terms_and_conditions_delete = createAsyncThunk(
  "termAndConditions/modules_terms_and_conditions_delete",
  async payload => {
    const response = await apiService.modules_terms_and_conditions_delete(
      payload
    )
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const termAndConditionsSlice = createSlice({
  name: "termAndConditions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(modules_terms_and_conditions_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        modules_terms_and_conditions_create.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities.push(action.payload)
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        modules_terms_and_conditions_create.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(modules_terms_and_conditions_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(modules_terms_and_conditions_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(modules_terms_and_conditions_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(modules_terms_and_conditions_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        modules_terms_and_conditions_update.fulfilled,
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
        modules_terms_and_conditions_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(
        modules_terms_and_conditions_partial_update.pending,
        (state, action) => {
          if (state.api.loading === "idle") {
            state.api.loading = "pending"
          }
        }
      )
      .addCase(
        modules_terms_and_conditions_partial_update.fulfilled,
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
        modules_terms_and_conditions_partial_update.rejected,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.api.error = action.error
            state.api.loading = "idle"
          }
        }
      )
      .addCase(modules_terms_and_conditions_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        modules_terms_and_conditions_delete.fulfilled,
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
        modules_terms_and_conditions_delete.rejected,
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
  modules_terms_and_conditions_create,
  modules_terms_and_conditions_read,
  modules_terms_and_conditions_update,
  modules_terms_and_conditions_partial_update,
  modules_terms_and_conditions_delete,
  slice: termAndConditionsSlice
}
