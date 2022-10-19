import { PayloadAction } from "@reduxjs/toolkit";
import { setDocHeader, setPageType } from "src/app.redux.js";
import { GetState, ThunkApi } from "src/core/models/common.model.js";
import { AppDispatch } from "src/redux/create-store.js";
import { createSlice } from "src/redux/redux.imports.js";
import { DocPageData } from "./documentation.model.js";

export interface DocPageState {
  pageData: DocPageData | null;
}

const initialState: DocPageState = {
  pageData: null,
};

export const fetchDocPageData = (pageId: string) => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    const apiResponse = await api.get<DocPageData>(`/api/cms/${pageId}?pageType=DOC_PAGE`);
    dispatch(docPageDataLoaded(apiResponse.data));
    if (apiResponse.data) {
      dispatch(
        setDocHeader({
          title: apiResponse.data.title,
          lastUpdated: apiResponse.data.lastUpdated,
        }),
      );
      dispatch(setPageType("DOC_PAGE"));
    }
    return apiResponse;
  };
};

const docPageSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    docPageDataLoaded: (state, action: PayloadAction<DocPageData | null>) => {
      state.pageData = action.payload;
    },
  },
});

export const { docPageDataLoaded } = docPageSlice.actions;

export default docPageSlice.reducer;
