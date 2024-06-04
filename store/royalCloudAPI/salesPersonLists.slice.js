import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_sales_person_read = createAsyncThunk(
  "salesPersonLists/api_v1_sales_person_read",
  async payload => {
    const response = await apiService.api_v1_sales_person_read(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const salesPersonListsSlice = createSlice({
  name: "salesPersonLists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_sales_person_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_sales_person_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_sales_person_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default { api_v1_sales_person_read, slice: salesPersonListsSlice }
