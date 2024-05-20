import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchSearch, fetchGet, fetchSave } from "@/services/work.opd.provider";
import type { OpdSearchModel, OpdSearchReponse } from "@/store/work-opd/opdSearchModel";
import type { OpdDataModel, OpdResponse, OpdValidModel, } from "@/store/work-opd/opdEditorModel";

export interface WorkOpdSliceState {
  searchResult: OpdSearchReponse | undefined;
  tableResult: OpdSearchModel[];
  searchStatus: "idle" | "loading" | "failed";
  getResult?: OpdDataModel;
  getStatus: "idle" | "loading" | "failed";
  getValid?: Array<OpdValidModel>;
  getValidStatus: "idle" | "loading" | "failed";
  saveStatus: "idle" | "loading" | "failed";
}

const initialState: WorkOpdSliceState = {
  searchResult: undefined,
  tableResult: [],
  searchStatus: "idle",
  getResult: undefined,
  getStatus: "idle",
  getValid: undefined,
  getValidStatus: "idle",
  saveStatus: "idle",
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
        fulfilled: (state, action: PayloadAction<OpdSearchReponse>) => {
          state.searchStatus = "idle";
          state.searchResult = action.payload
          state.tableResult = action.payload.data
        },
        rejected: (state) => {
          state.searchStatus = "failed";
        },
      }
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
        fulfilled: (state, action) => {
          const payloadData = action.payload as unknown as OpdResponse
          state.getStatus = "idle";
          state.getResult = payloadData.data
          state.getValid = payloadData.error
        },
        rejected: (state) => {
          state.getStatus = "failed";
        },
      }
    ),

    saveAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchSave(body);
        return response;
      },
      {
        pending: (state) => {
          state.saveStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.saveStatus = "idle";
        },
        rejected: (state) => {
          state.saveStatus = "failed";
        },
      }
    ),

    fillterAsync: create.asyncThunk(async (body: any) => { return body },

      {
        pending: (state) => {
          state.getStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.tableResult = action.payload;
        },
        rejected: (state) => {
          state.getStatus = "failed";
        },
      }
    )
  }),

  selectors: {
    selectResult: (workOpd) => workOpd.searchResult,
    selectTabletResult: (workOpd) => workOpd.tableResult,
    selectStatus: (workOpd) => workOpd.searchStatus,
    getResult: (workOpd) => workOpd.getResult,
    getStatus: (workOpd) => workOpd.getStatus,
    getValid: (workOpd) => workOpd.getValid,
    saveStatus: (workOpd) => workOpd.saveStatus,
  },
});

export const { searchAsync, getAsync, saveAsync, fillterAsync } = workOpdSlice.actions;

export const { selectResult, selectStatus, getResult, getStatus, getValid, saveStatus, selectTabletResult } = workOpdSlice.selectors;
