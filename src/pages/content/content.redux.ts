import { PayloadAction } from "@reduxjs/toolkit";
import { setPageType, setTagLines } from "src/app.redux.js";
import { GetState, ThunkApi } from "src/core/models/common.model.js";
import { AppDispatch } from "src/redux/create-store.js";
import { createSlice } from "src/redux/redux.imports.js";
import { ContentPageData } from "./content.model.js";

export interface ContentState {
  pageData: ContentPageData | null;
}

const initialState: ContentState = {
  pageData: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    contentPageDataLoaded: (state, action: PayloadAction<ContentPageData | null>) => {
      state.pageData = action.payload;
    },
  },
});

export const { contentPageDataLoaded } = contentSlice.actions;
export default contentSlice.reducer;

export const fetchContentPageData = (pageId: string) => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    const apiResponse = await api.get<ContentPageData>(`/api/cms/${pageId}?pageType=CONTENT_PAGE`);
    dispatch(contentPageDataLoaded(apiResponse.data || null));
    if (apiResponse.isSuccess && apiResponse.data) {
      dispatch(setTagLines(apiResponse.data.tagLines));
      dispatch(setPageType("CONTENT_PAGE"));
    } else {
      dispatch(setTagLines([]));
    }
    return apiResponse;
  };
};
