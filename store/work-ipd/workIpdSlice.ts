import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSearch
  // , fetchGet, fetchSave
} from "@/services/work.ipd.provider";
import type { IpdSearchModel } from "@/store/work-ipd/ipdSearchModel";
// import type { IpdDataModel, IpdResponse, IpdValidModel, } from "@/store/work-ipd/ipdEditorModel";

export interface WorkIpdSliceState {
  searchResult: IpdSearchModel[];
  // tableResult: IpdSearchModel[];
  searchStatus: "idle" | "loading" | "failed";
  // getResult?: IpdDataModel;
  // getStatus: "idle" | "loading" | "failed";
  // getValid?: Array<IpdValidModel>;
  // getValidStatus: "idle" | "loading" | "failed";
  // saveStatus: "idle" | "loading" | "failed";
}

const initialState: WorkIpdSliceState = {
  searchResult: [],
  // tableResult: [],
  searchStatus: "idle",
  // getResult: undefined,
  // getStatus: "idle",
  // getValid: undefined,
  // getValidStatus: "idle",
  // saveStatus: "idle",
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
        fulfilled: (state, action: PayloadAction<IpdSearchModel[]>) => {
          state.searchStatus = "idle";
          state.searchResult = action.payload;
          // state.tableResult = action.payload;
        },
        rejected: (state) => {
          state.searchStatus = "failed";
        },
      }
    ),

    // getAsync: create.asyncThunk(
    //   async (body: any) => {
    //     const response = await fetchGet(body);
    //     return response;
    //   },
    //   {
    //     pending: (state) => {
    //       state.getStatus = "loading";
    //     },
    //     fulfilled: (state, action: PayloadAction<IpdResponse>) => {
    //       state.getStatus = "idle";
    //       state.getResult = action.payload.data;
    //       state.getValid = action.payload.error;
    //     },
    //     rejected: (state) => {
    //       state.getStatus = "failed";
    //     },
    //   }
    // ),

    // saveAsync: create.asyncThunk(
    //   async (body: any) => {
    //     const response = await fetchSave(body);
    //     return response;
    //   },
    //   {
    //     pending: (state) => {
    //       state.saveStatus = "loading";
    //     },
    //     fulfilled: (state, action) => {
    //       state.saveStatus = "idle";
    //     },
    //     rejected: (state) => {
    //       state.saveStatus = "failed";
    //     },
    //   }
    // ),

    // fillterAsync: create.asyncThunk(async (body: any) => { return body },

    //   {
    //     pending: (state) => {
    //       state.getStatus = "loading";
    //     },
    //     fulfilled: (state, action) => {
    //       state.tableResult = action.payload;
    //     },
    //     rejected: (state) => {
    //       state.getStatus = "failed";
    //     },
    //   }
    // )
  }),

  selectors: {
    selectResult: (workIpd) => workIpd.searchResult,
    // selectTabletResult: (workIpd) => workIpd.tableResult,
    selectStatus: (workIpd) => workIpd.searchStatus,
    // getResult: (workIpd) => workIpd.getResult,
    // getStatus: (workIpd) => workIpd.getStatus,
    // getValid: (workIpd) => workIpd.getValid,
    // saveStatus: (workIpd) => workIpd.saveStatus,
  },
});

export const { searchAsync,
  //  getAsync, saveAsync, fillterAsync
} = workIpdSlice.actions;

export const { selectResult, selectStatus
  //  , getResult, getStatus, getValid, saveStatus, selectTabletResult
} = workIpdSlice.selectors;