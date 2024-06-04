import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "./api"
export const api_v1_users_create = createAsyncThunk(
  "userProfiles/api_v1_users_create",
  async payload => {
    const response = await apiService.api_v1_users_create(payload)
    return response.data
  }
)
export const api_v1_users_admin = createAsyncThunk(
  "userProfiles/api_v1_users_admin",
  async payload => {
    const response = await apiService.api_v1_users_admin(payload)
    return response.data
  }
)
export const api_v1_users_login = createAsyncThunk(
  "userProfiles/api_v1_users_login",
  async payload => {
    const response = await apiService.api_v1_users_login(payload)
    return response.data
  }
)
export const api_v1_users_logout = createAsyncThunk(
  "userProfiles/api_v1_users_logout",
  async payload => {
    const response = await apiService.api_v1_users_logout(payload)
    return response.data
  }
)
export const api_v1_users_otp = createAsyncThunk(
  "userProfiles/api_v1_users_otp",
  async payload => {
    const response = await apiService.api_v1_users_otp(payload)
    return response.data
  }
)
export const api_v1_users_password = createAsyncThunk(
  "userProfiles/api_v1_users_password",
  async payload => {
    const response = await apiService.api_v1_users_password(payload)
    return response.data
  }
)
export const api_v1_users_verify = createAsyncThunk(
  "userProfiles/api_v1_users_verify",
  async payload => {
    const response = await apiService.api_v1_users_verify(payload)
    return response.data
  }
)
export const api_v1_users_read = createAsyncThunk(
  "userProfiles/api_v1_users_read",
  async payload => {
    const response = await apiService.api_v1_users_read(payload)
    return response.data
  }
)
export const api_v1_users_update = createAsyncThunk(
  "userProfiles/api_v1_users_update",
  async payload => {
    const response = await apiService.api_v1_users_update(payload)
    return response.data
  }
)
export const api_v1_users_partial_update = createAsyncThunk(
  "userProfiles/api_v1_users_partial_update",
  async payload => {
    const response = await apiService.api_v1_users_partial_update(payload)
    return response.data
  }
)
export const api_v1_users_delete = createAsyncThunk(
  "userProfiles/api_v1_users_delete",
  async payload => {
    const response = await apiService.api_v1_users_delete(payload)
    return response.data
  }
)
const initialState = { entities: [], api: { loading: "idle", error: null } }
const userProfilesSlice = createSlice({
  name: "userProfiles",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(api_v1_users_create.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_create.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_create.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_admin.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_admin.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_admin.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_login.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_login.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_login.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_logout.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_logout.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_logout.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_otp.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_otp.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_otp.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_password.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_password.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_password.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_verify.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_verify.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities.push(action.payload)
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_verify.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_read.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_read.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = [
            ...state.entities.filter(record => record.id !== action.payload.id),
            action.payload
          ]
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_read.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_partial_update.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_partial_update.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.map(record =>
            record.id === action.payload.id ? action.payload : record
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_partial_update.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_delete.pending, (state, action) => {
        if (state.api.loading === "idle") {
          state.api.loading = "pending"
        }
      })
      .addCase(api_v1_users_delete.fulfilled, (state, action) => {
        if (state.api.loading === "pending") {
          state.entities = state.entities.filter(
            record => record.id !== action.meta.arg?.id
          )
          state.api.loading = "idle"
        }
      })
      .addCase(api_v1_users_delete.rejected, (state, action) => {
        if (state.api.loading === "pending") {
          state.api.error = action.error
          state.api.loading = "idle"
        }
      })
  }
})
export default {
  api_v1_users_create,
  api_v1_users_admin,
  api_v1_users_login,
  api_v1_users_logout,
  api_v1_users_otp,
  api_v1_users_password,
  api_v1_users_verify,
  api_v1_users_read,
  api_v1_users_update,
  api_v1_users_partial_update,
  api_v1_users_delete,
  slice: userProfilesSlice
}
