import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../service/api';

// Fetches all checklists from the API
export const fetchChecklists = createAsyncThunk(
  'checklists/fetchChecklists',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getAllChecklists();
      return data.map(checklist => ({
        ...checklist,
        status: checklist.statut ?? checklist.status ?? 0
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Deletes a checklist from the API
export const deleteChecklistAsync = createAsyncThunk(
  'checklists/deleteChecklist',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteChecklist(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Creates a new checklist via the API
export const createChecklistAsync = createAsyncThunk(
  'checklists/createChecklist',
  async (checklistData, { rejectWithValue }) => {
    try {
      const result = await api.createChecklist(checklistData);
      return {
        ...result,
        status: result.statut ?? result.status ?? 0
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checklistsSlice = createSlice({
  name: 'checklists',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteChecklistAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteChecklistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteChecklistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createChecklistAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(createChecklistAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createChecklistAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default checklistsSlice.reducer;
