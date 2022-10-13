import { PayloadAction } from "@reduxjs/toolkit";
import { GetState, ThunkApi } from "core/models/common.model.js";
import { LeftSideMenu } from "src/core/components/app/left-side-menu/left-side-menu.model.js";
import { HeaderData } from "./app.model.js";
import { AppDispatch } from "./redux/create-store.js";
import { createSlice } from "./redux/redux.imports.js";

export interface DocHeader {
  title: string;
  lastUpdated: string;
}
export interface AppState {
  header: HeaderData;
  docHeader?: DocHeader;
  sideMenu?: LeftSideMenu;
}

const initialState: AppState = {
  header: {
    links: [],
  },
};

export const searchText = (searchText: string) => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    return api.get(`/api/cms/search/${searchText}`).then((apiResponse) => {
      console.log("search!!", apiResponse.data);
      return apiResponse;
    });
  };
};

export const fetchSideMenu = () => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    return api.get("/api/cms/sideMenu").then((apiResponse) => {
      dispatch(fetchSideMenuSuccess(apiResponse.data));
      return apiResponse;
    });
  };
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchHeaderSuccess: (state, action: PayloadAction<HeaderData>) => {
      state.header = action.payload;
    },
    setDocHeader: (state, action: PayloadAction<DocHeader | undefined>) => {
      state.docHeader = action.payload;
    },
    fetchSideMenuSuccess: (state, action) => {
      state.sideMenu = action.payload;
    },
  },
});

export const { fetchHeaderSuccess, setDocHeader, fetchSideMenuSuccess } = appSlice.actions;
export default appSlice.reducer;
