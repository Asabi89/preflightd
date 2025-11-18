import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notification: {
      type: null, // 'success', 'error', 'info', 'warning'
      message: '',
      visible: false
    },
    confirmDialog: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    },
    sidebarOpen: false
  },
  reducers: {
    showNotification: (state, action) => {
      const { type = 'info', message = '' } = action.payload;
      state.notification = {
        type,
        message,
        visible: true
      };
    },
    hideNotification: (state) => {
      state.notification.visible = false;
    },
    openConfirmDialog: (state, action) => {
      const { title = '', message = '', onConfirm = null, onCancel = null } = action.payload;
      state.confirmDialog = {
        isOpen: true,
        title,
        message,
        onConfirm,
        onCancel
      };
    },
    closeConfirmDialog: (state) => {
      state.confirmDialog.isOpen = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    }
  }
});

export const {
  showNotification,
  hideNotification,
  openConfirmDialog,
  closeConfirmDialog,
  toggleSidebar,
  setSidebarOpen
} = uiSlice.actions;

export default uiSlice.reducer;
