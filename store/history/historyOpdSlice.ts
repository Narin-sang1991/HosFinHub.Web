import { createAppSlice } from "@/store/createAppSlice";
import { OpdClamHistory, OpdClamService } from "./claimModel";
import {
    fetchHistoryNumberOpd,
    fetchHistoryServiceOpd,
} from "@/services/history.privider";

export interface ClamHistoryOpdSliceState {
    searchResult: OpdClamHistory[];
    searchStatus: "idle" | "loading" | "failed";
    opdClamService: OpdClamService[];
}

const initialState: ClamHistoryOpdSliceState = {
    searchResult: [],
    searchStatus: "idle",
    opdClamService: [],
};

export const historyOpdSlice = createAppSlice({
    name: "historyOpd",
    initialState,
    reducers: (create) => ({
        searchAsync: create.asyncThunk(
            async (body: { startDate: string; endDate: string }) => {
                const response = await fetchHistoryNumberOpd(body);
                return response;
            },
            {
                pending: (state) => {
                    state.searchStatus = "loading";
                },
                fulfilled: (state, action) => {
                    state.searchStatus = "idle";
                    state.searchResult = (action.payload as unknown as OpdClamHistory[]).sort((a, b) => a.sent_date < b.sent_date ? 1 : (b.sent_date < a.sent_date ? -1 : 0))
                },
                rejected: (state) => {
                    state.searchStatus = "failed";
                },
            }
        ),

        getOpdClaim: create.asyncThunk(
            async (body: { seq: string[] }) => {
                const response = await fetchHistoryServiceOpd(body);
                return response;
            },
            {
                pending: (state) => {
                    state.searchStatus = "loading";
                },
                fulfilled: (state, action) => {
                    state.opdClamService = action.payload as unknown as OpdClamService[]
                    state.searchStatus = "idle";
                },
                rejected: (state) => {
                    state.searchStatus = "failed";
                },
            }
        ),
    }),
    selectors: {
        selectResult: (historyOpd) => historyOpd.searchResult,
        selectStatus: (historyOpd) => historyOpd.searchStatus,
        selectClaimService: (historyOpd) => historyOpd.opdClamService,
    },
});

export const { searchAsync, getOpdClaim } = historyOpdSlice.actions;
export const { selectResult, selectStatus, selectClaimService } =
    historyOpdSlice.selectors;
