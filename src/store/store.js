import { configureStore } from '@reduxjs/toolkit';
import checklistsReducer from './slices/checklistsSlice';
import currentChecklistReducer from './slices/currentChecklistSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        checklists: checklistsReducer,
        currentChecklist: currentChecklistReducer,
        ui: uiReducer
    }
});

export default store;
