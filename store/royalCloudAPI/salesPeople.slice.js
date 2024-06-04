import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_sales_person_create = createAsyncThunk(
  "salesPeople/api_v1_sales_person_create",
  async payload => {
    const response = await apiService.api_v1_sales_person_create(payload)
    return response.data
  }
)
export const api_v1_sales_person_update = createAsyncThunk(
  "salesPeople/api_v1_sales_person_update",
  async payload => {
    const response = await apiService.api_v1_sales_person_update(payload)
    return response.data
  }
)
export const api_v1_sales_person_partial_update = createAsyncThunk(
  "salesPeople/api_v1_sales_person_partial_update",
  async payload => {
    const response = await apiService.api_v1_sales_person_partial_update(
      payload
    )
    return response.data
  }
)
export const api_v1_sales_person_delete = createAsyncThunk(
  "salesPeople/api_v1_sales_person_delete",
  async payload => {
    const response = await apiService.api_v1_sales_person_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const salesPeopleSlice = createSlice({
  name: "salesPeople",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_sales_person_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_sales_person_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_sales_person_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(
        api_v1_sales_person_partial_update.fulfilled,
        (state, action) => {
          if (state.api.loading === "pending") {
            state.entities = state.entities.map(record =>
              record.id === action.payload.id ? action.payload : record
            )
            state.api.loading = "idle"
          }
        }
      )
      .addCase(api_v1_sales_person_partial_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_sales_person_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_sales_person_create,
  api_v1_sales_person_update,
  api_v1_sales_person_partial_update,
  api_v1_sales_person_delete,
  slice: salesPeopleSlice
}
