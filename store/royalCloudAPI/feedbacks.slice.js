import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_feedback_create = createAsyncThunk(
  "feedbacks/api_v1_feedback_create",
  async payload => {
    const response = await apiService.api_v1_feedback_create(payload)
    return response.data
  }
)
export const api_v1_feedback_respond = createAsyncThunk(
  "feedbacks/api_v1_feedback_respond",
  async payload => {
    const response = await apiService.api_v1_feedback_respond(payload)
    return response.data
  }
)
export const api_v1_feedback_read = createAsyncThunk(
  "feedbacks/api_v1_feedback_read",
  async payload => {
    const response = await apiService.api_v1_feedback_read(payload)
    return response.data
  }
)
export const api_v1_feedback_update = createAsyncThunk(
  "feedbacks/api_v1_feedback_update",
  async payload => {
    const response = await apiService.api_v1_feedback_update(payload)
    return response.data
  }
)
export const api_v1_feedback_partial_update = createAsyncThunk(
  "feedbacks/api_v1_feedback_partial_update",
  async payload => {
    const response = await apiService.api_v1_feedback_partial_update(payload)
    return response.data
  }
)
export const api_v1_feedback_delete = createAsyncThunk(
  "feedbacks/api_v1_feedback_delete",
  async payload => {
    const response = await apiService.api_v1_feedback_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_feedback_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_respond.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_respond.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_respond.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_partial_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_partial_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_feedback_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_feedback_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_feedback_create,
  api_v1_feedback_respond,
  api_v1_feedback_read,
  api_v1_feedback_update,
  api_v1_feedback_partial_update,
  api_v1_feedback_delete,
  slice: feedbacksSlice
}
