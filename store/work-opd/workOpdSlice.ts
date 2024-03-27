import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchSearch, fetchGet } from "@/services/work.opd.provider";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import type { OpdResponeModel } from "@/store/work-opd/opdEditorModel";

export interface WorkOpdSliceState {
  searchResult: OpdSearchModel[];
  searchStatus: "idle" | "loading" | "failed";
  getResult?: OpdResponeModel;
  getStatus: "idle" | "loading" | "failed";
}

const initialState: WorkOpdSliceState = {
  searchResult: [],
  searchStatus: "idle",
  getResult: undefined,
  getStatus: "idle",
};

export const workOpdSlice = createAppSlice({
  name: "workOPD",
  initialState,
  reducers: (create) => ({

    searchAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchSearch(body);
        return response;
      },
      {
        pending: (state) => {
          state.searchStatus = "loading";
        },
        fulfilled: (state, action: PayloadAction<OpdSearchModel[]>) => {
          state.searchStatus = "idle";
          state.searchResult = action.payload;
        },
        rejected: (state) => {
          state.searchStatus = "failed";
        },
      },
    ),

    getAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchGet(body);
        return response;
      },
      {
        pending: (state) => {
          state.getStatus = "loading";
        },
        fulfilled: (state, action: PayloadAction<OpdResponeModel>) => {
          state.getStatus = "idle";
          state.getResult = action.payload;
        },
        rejected: (state) => {
          state.getStatus = "failed";
        },
      },
    ),

  }),

  selectors: {
    selectResult: (workOpd) => workOpd.searchResult,
    selectStatus: (workOpd) => workOpd.searchStatus,
    getResult: (workOpd) => workOpd.getResult,
    getStatus: (workOpd) => workOpd.getStatus,
  },

});

export const { searchAsync, getAsync } = workOpdSlice.actions;

export const { selectResult, selectStatus, getResult, getStatus } = workOpdSlice.selectors;