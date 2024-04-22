import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchSearchDrug } from "@/services/free.additional.provider";
import type { FreeDrugModel } from "@/store/free-additional/freeDrugModel";


export interface FreeAdditionalSliceState {
  searchDrugResult: FreeDrugModel[];
  searchDrugStatus: "idle" | "loading" | "failed";
}

const initialState: FreeAdditionalSliceState = {
  searchDrugResult: [],
  searchDrugStatus: "idle",

};

export const freeAdditionalSlice = createAppSlice({
  name: "freeAdditional",
  initialState,
  reducers: (create) => ({
    searchDrugAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchSearchDrug(body);
        return response;
      },
      {
        pending: (state) => {
          state.searchDrugStatus = "loading";
        },
        fulfilled: (state, action: PayloadAction<FreeDrugModel[]>) => {
          state.searchDrugStatus = "idle";
          state.searchDrugResult = action.payload;
        },
        rejected: (state) => {
          state.searchDrugStatus = "failed";
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
    //     fulfilled: (state, action: PayloadAction<OpdResponst>) => {
    //       state.getStatus = "idle";
    //       state.getResult = action.payload.data;

    //       state.getValid = action.payload.error;
    //     },
    //     rejected: (state) => {
    //       state.getStatus = "failed";
    //     },
    //   }
    // ),

  }),

  selectors: {
    searchDrugStatus: (freeAdp) => freeAdp.searchDrugStatus,
    searchDrugResult: (freeAdp) => freeAdp.searchDrugResult,
  },
});

export const { searchDrugAsync } = freeAdditionalSlice.actions;

export const { searchDrugResult, searchDrugStatus } = freeAdditionalSlice.selectors;
