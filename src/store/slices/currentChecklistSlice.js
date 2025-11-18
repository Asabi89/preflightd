import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../../service/api';

// Fetches a single checklist by ID
export const fetchChecklistById = createAsyncThunk(
  'currentChecklist/fetchChecklistById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.getChecklist(id);
      const status = data.statut ?? data.status ?? 0;
      return {
        ...data,
        status,
        todo: (data.todo || []).map(task => ({
          ...task,
          id: task.id || uuidv4()
        }))
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Updates an existing checklist via the API
export const updateChecklistAsync = createAsyncThunk(
  'currentChecklist/updateChecklist',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await api.updateChecklist(id, data);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Updates the status of a checklist (new, in progress, completed)
export const updateChecklistStatusAsync = createAsyncThunk(
  'currentChecklist/updateChecklistStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await api.updateStatus(id, status);
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const currentChecklistSlice = createSlice({
  name: 'currentChecklist',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    // Toggles a task's completion status and updates parent checklist status
    toggleTask: (state, action) => {
      if (!state.data) return;
      
      const taskId = action.payload;
      const updated = state.data.todo.map(task =>
        task.id === taskId
          ? { ...task, statut: task.statut === 1 ? 0 : 1 }
          : task
      );

      const allDone = updated.every(t => t.statut === 1);
      const someDone = updated.some(t => t.statut === 1);
      let newStatus = 0;
      if (allDone) newStatus = 2;
      else if (someDone) newStatus = 1;

      state.data = {
        ...state.data,
        todo: updated,
        status: newStatus
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchChecklistById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateChecklistAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateChecklistAsync.fulfilled, (state) => {})
      .addCase(updateChecklistAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateChecklistStatusAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateChecklistStatusAsync.fulfilled, (state, action) => {
        if (state.data && state.data.id === action.payload.id) {
          state.data.status = action.payload.status;
        }
      })
      .addCase(updateChecklistStatusAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { toggleTask } = currentChecklistSlice.actions;

export default currentChecklistSlice.reducer;
