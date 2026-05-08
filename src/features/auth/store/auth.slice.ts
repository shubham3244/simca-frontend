import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi, type LoginRequest } from '../api/auth.api';
import type { ApiErrorResponse } from '../../../types/api.types';
import type { AuthState, User } from './auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const loginThunk = createAsyncThunk<
  User,
  LoginRequest,
  { rejectValue: ApiErrorResponse }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { user } = await authApi.login(payload);
    return user;
  } catch (err) {
    return rejectWithValue(err as ApiErrorResponse);
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiErrorResponse }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (err) {
    return rejectWithValue(err as ApiErrorResponse);
  }
});

export const fetchMeThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiErrorResponse }
>('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { user } = await authApi.me();
    return user;
  } catch (err) {
    return rejectWithValue(err as ApiErrorResponse);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      .addCase(fetchMeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
