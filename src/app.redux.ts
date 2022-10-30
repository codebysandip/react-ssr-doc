import { PayloadAction } from "@reduxjs/toolkit";
import { GetState, ThunkApi } from "core/models/common.model.js";
import {
  LeftSideMenu,
  PageType,
} from "src/core/components/app/left-side-menu/left-side-menu.model.js";
import { Footer } from "./app.model.js";
import { AppDispatch } from "./redux/create-store.js";
import { createSlice } from "./redux/redux.imports.js";

export interface DocHeader {
  title: string;
  lastUpdated: string;
}

export type Device = "mobile" | "desktop" | "tablet";
export interface AppState {
  docHeader?: DocHeader;
  sideMenu?: LeftSideMenu;
  tagLines: string[];
  pageType: PageType;
  footer?: Footer;
  device: Device;
  sideMenuActive: boolean;
}

const initialState: AppState = {
  tagLines: [],
  pageType: "CONTENT_PAGE",
  device: "desktop",
  sideMenuActive: false,
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
    return api.get<LeftSideMenu>("/api/cms/sideMenu").then((apiResponse) => {
      dispatch(fetchSideMenuSuccess(apiResponse.data));
      return apiResponse;
    });
  };
};

export const fetchFooter = () => {
  return async (dispatch: AppDispatch, _getState: GetState, api: ThunkApi) => {
    return api.get<Footer>("/api/cms/footer").then((apiResponse) => {
      dispatch(fetchFooterSuccess(apiResponse.data));
      return apiResponse;
    });
  };
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDocHeader: (state, action: PayloadAction<DocHeader | undefined>) => {
      state.docHeader = action.payload;
    },
    fetchSideMenuSuccess: (state, action: PayloadAction<LeftSideMenu | undefined>) => {
      state.sideMenu = action.payload || undefined;
    },
    setTagLines: (state, action: PayloadAction<string[]>) => {
      state.tagLines = action.payload;
    },
    setPageType: (state, action: PayloadAction<PageType>) => {
      state.pageType = action.payload;
    },
    fetchFooterSuccess: (state, action: PayloadAction<Footer | undefined>) => {
      state.footer = action.payload || undefined;
    },
    setDevice: (state, action: PayloadAction<Device>) => {
      state.device = action.payload;
    },
    toggleSideMenuActive: (state) => {
      state.sideMenuActive = !state.sideMenuActive;
    },
  },
});

export const {
  setDocHeader,
  fetchSideMenuSuccess,
  setTagLines,
  setPageType,
  fetchFooterSuccess,
  setDevice,
  toggleSideMenuActive,
} = appSlice.actions;
export default appSlice.reducer;
