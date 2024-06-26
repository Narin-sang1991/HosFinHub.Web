import { createAppSlice } from "@/store/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchSearchDrug, fetchSearchFeeSchedule } from "@/services/free.additional.provider";
import type { FeeDrugModel } from "@/store/fee-additional/feeDrugModel";
import  { FeeScheduleModel } from "./feeScheduleModel";


export interface FeeAdditionalSliceState {
  searchDrugResult: FeeDrugModel[];
  searchDrugStatus: "idle" | "loading" | "failed";
  searchFeeResult: FeeScheduleModel[];
  searchFeeStatus: "idle" | "loading" | "failed";
}

const initialState: FeeAdditionalSliceState = {
  searchDrugResult: [],
  searchDrugStatus: "idle",
  searchFeeResult: [],
  searchFeeStatus: "idle",
};

export const feeAdditionalSlice = createAppSlice({
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
        fulfilled: (state, action) => {
          const payload = action.payload as unknown as FeeDrugModel[]
          state.searchDrugStatus = "idle";
          state.searchDrugResult = payload;
        },
        rejected: (state) => {
          state.searchDrugStatus = "failed";
        },
      }
    ),

    searchFeeAsync: create.asyncThunk(
      async (body: any) => {
        const response = await fetchSearchFeeSchedule(body);
        return response;
      },
      {
        pending: (state) => {
          state.searchFeeStatus = "loading";
        },
        fulfilled: (state, action) => {
          const payload = action.payload as unknown as FeeScheduleModel[]
          state.searchFeeStatus = "idle";
          state.searchFeeResult = payload;
        },
        rejected: (state) => {
          state.searchFeeStatus = "failed";
        },
      }
    ),

  }),

  selectors: {
    searchDrugStatus: (freeAdp) => freeAdp.searchDrugStatus,
    searchDrugResult: (freeAdp) => freeAdp.searchDrugResult,
    searchFeeStatus: (freeAdp) => freeAdp.searchFeeStatus,
    searchFeeResult: (freeAdp) => freeAdp.searchFeeResult,
  },
});

export const { searchDrugAsync, searchFeeAsync } = feeAdditionalSlice.actions;

export const { searchDrugResult, searchDrugStatus, searchFeeResult, searchFeeStatus } = feeAdditionalSlice.selectors;
