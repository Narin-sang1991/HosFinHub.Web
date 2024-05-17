import { createAppSlice } from "@/store/createAppSlice";
import { OpdClamHistory } from "./claimModel";
import { fetchHistoryNumberOpd } from "@/services/history.privider";
import { PayloadAction } from "@reduxjs/toolkit";

export interface ClamHistoryOpdSliceState {
    searchResult: OpdClamHistory[];
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: ClamHistoryOpdSliceState = {
    searchResult: [],
    searchStatus: "idle"
}

export const historyOpdSlice = createAppSlice({
    name: 'historyOpd',
    initialState,
    reducers: (create) => ({
        searchAsync: create.asyncThunk(async (body: { startDate: string; endDate: string; }) => {
            const response = await fetchHistoryNumberOpd(body);
            return response;
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action: PayloadAction<OpdClamHistory[]>) => {
                state.searchStatus = 'idle'
                state.searchResult = action.payload
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        }
        )
    }),
    selectors: {
        selectResult: (historyOpd) => historyOpd.searchResult,
        selectStatus: (historyOpd) => historyOpd.searchStatus,
    }
})

export const { searchAsync } = historyOpdSlice.actions;
export const { selectResult, selectStatus } = historyOpdSlice.selectors