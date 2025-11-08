
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { SortConfig, Category } from '@/lib/types';

// Define the shape of our UI state
interface UIState {
  activeCategory: Category['id'];
  sortConfig: SortConfig;
}

// Define the initial state
const initialState: UIState = {
  activeCategory: 'new',
  sortConfig: { key: 'tvl', direction: 'descending' },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  // The reducers field lets us define "actions" to change the state
  reducers: {
    setActiveCategory: (state, action: PayloadAction<Category['id']>) => {
      state.activeCategory = action.payload;
    },
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },
  },
});

// Export the actions so we can "dispatch" them from our components
export const { setActiveCategory, setSortConfig } = uiSlice.actions;

// Export "selectors" to read the state from our components
export const selectActiveCategory = (state: RootState) => state.ui.activeCategory;
export const selectSortConfig = (state: RootState) => state.ui.sortConfig;

// Export the reducer to add to our main store
export default uiSlice.reducer;