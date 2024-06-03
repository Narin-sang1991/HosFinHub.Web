import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchSearch, fetchGet, fetchSave, fetchReProcessGetHosOS } from "@/services/work.ipd.provider";
import type { IpdSearchReponse } from "@/store/work-ipd/ipdSearchModel";
import type { IpdDataModel, IpdResponse, IpdValidModel, } from "@/store/work-ipd/ipdEditorModel";

export interface WorkIpdSliceState {
  searchResult: IpdSearchReponse | undefined;
  searchStatus: "idle" | "loading" | "failed";
  getResult?: IpdDataModel;
  getStatus: "idle" | "loading" | "failed";
  getValid?: Array<IpdValidModel>;
  getValidStatus: "idle" | "loading" | "failed";
  saveStatus: "idle" | "loading" | "failed";
  reProcessStatus: "idle" | "loading" | "failed";
}

const initialState: WorkIpdSliceState = {
  searchResult: undefined,
  searchStatus: "idle",
  getResult: undefined,
  getStatus: "idle",
  getValid: undefined,
  getValidStatus: "idle",
  saveStatus: "idle",
  reProcessStatus: "idle",
};

export const workIpdSlice = createAppSlice({
  name: "workIPD",
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
        fulfilled: (state, action: PayloadAction<IpdSearchReponse>) => {
          state.searchStatus = "idle";
          state.searchResult = action.payload;
          // state.tableResult = action.payload.data;
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
        fulfilled: (state, action: PayloadAction<IpdResponse>) => {
          state.getStatus = "idle";
          state.getResult = action.payload.data;
          state.getValid = action.payload.error;
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

    reProcessAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchReProcessGetHosOS(body);
        return response;
      },
      {
        pending: (state) => {
          state.reProcessStatus = "loading";
        },
        fulfilled: (state, action) => {
          state.reProcessStatus = "idle";
        },
        rejected: (state) => {
          state.reProcessStatus = "failed";
        },
      }
    ),

  }),

  selectors: {
    selectResult: (workIpd) => workIpd.searchResult,
    selectStatus: (workIpd) => workIpd.searchStatus,
    getResult: (workIpd) => workIpd.getResult,
    getStatus: (workIpd) => workIpd.getStatus,
    getValid: (workIpd) => workIpd.getValid,
    saveStatus: (workIpd) => workIpd.saveStatus,
    reProcessStatus: (workIpd) => workIpd.reProcessStatus,
  },
});

export const { searchAsync, getAsync, saveAsync,
  reProcessAsync } = workIpdSlice.actions;

export const { selectResult, selectStatus, getResult,
  getStatus, getValid, saveStatus,
  reProcessStatus } = workIpdSlice.selectors;
