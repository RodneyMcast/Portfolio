import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { defaultPortfolioContent, type PortfolioContent } from '../../data/portfolioContent';
import {
  fetchPortfolioContent,
  readStoredPortfolioContentSource,
} from '../../services/portfolioContentApi';

import type { PayloadAction } from '@reduxjs/toolkit';

interface SiteContentState {
  content: PortfolioContent;
  source: 'firestore' | 'local';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message: string | null;
}

export const fetchSiteContent = createAsyncThunk(
  'siteContent/fetchSiteContent',
  async () => fetchPortfolioContent({ source: readStoredPortfolioContentSource() ?? 'firestore' }),
);

const initialState: SiteContentState = {
  content: defaultPortfolioContent,
  source: 'local',
  status: 'idle',
  message: null,
};

const siteContentSlice = createSlice({
  name: 'siteContent',
  initialState,
  reducers: {
    setSiteContent(
      state,
      action: PayloadAction<{ content: PortfolioContent; source?: 'firestore' | 'local' }>,
    ) {
      state.content = action.payload.content;
      state.source = action.payload.source ?? 'firestore';
      state.status = 'succeeded';
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteContent.pending, (state) => {
        state.status = 'loading';
        state.message = null;
      })
      .addCase(fetchSiteContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.content = action.payload.content;
        state.source = action.payload.source;
        state.message = action.payload.message ?? null;
      })
      .addCase(fetchSiteContent.rejected, (state) => {
        state.status = 'failed';
        state.content = defaultPortfolioContent;
        state.source = 'local';
        state.message = 'Unable to load remote content. Local content is being used.';
      });
  },
});

export const { setSiteContent } = siteContentSlice.actions;
export default siteContentSlice.reducer;
