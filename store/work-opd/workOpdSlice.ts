import { createAppSlice } from "@/store/createAppSlice";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchSearch } from "@/services/work.opd.provider";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";

export interface WorkOpdSliceState {
  searchResult: OpdSearchModel[];
  status: "idle" | "loading" | "failed";
}

const initialState: WorkOpdSliceState = {
  searchResult: [],
  status: "idle",
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
          state.status = "loading";
        },
        fulfilled: (state, action: PayloadAction<OpdSearchModel[]>) => {
          state.status = "idle";
          state.searchResult = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    )

  }),

  selectors: {
    selectResult: (workOpd) => workOpd.searchResult,
    selectStatus: (workOpd) => workOpd.status,
  },

});

export const { searchAsync } = workOpdSlice.actions;

export const { selectResult, selectStatus } = workOpdSlice.selectors;