import { PayloadAction } from "@reduxjs/toolkit";
import { Entry } from "contentful";
import { GetState, ThunkApi } from "src/core/models/common.model.js";
import { AppDispatch } from "src/redux/create-store.js";
import { createSlice } from "src/redux/redux.imports.js";

export interface ContentPageState {
  content: Entry<any> | null;
}

const initialState: ContentPageState = {
  content: null,
};

export const fetchContentPageData = (pageId: string) => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    const apiResponse = await api.get<Entry<any>>(`/api/cms/${pageId}`);
    dispatch(contentPageDataLoaded(apiResponse.data));
    return apiResponse;
  };
};

const contentPageSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    contentPageDataLoaded: (state, action: PayloadAction<Entry<any> | null>) => {
      state.content = action.payload;
    },
  },
});

export const { contentPageDataLoaded } = contentPageSlice.actions;

export default contentPageSlice.reducer;
