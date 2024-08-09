import { createAppSlice } from "@/store/createAppSlice";
import { HistoryClaimsOpdModel,   RequestHsitoryClaim } from "./claimModel";
import { resultHistoryClaims } from "@/services/claim.status";

export interface ClamHistoryOpdSliceState {
    opdHistoryClaims: HistoryClaimsOpdModel[];
    searchStatus: "idle" | "loading" | "failed";
    //   opdClamService: OpdClamService[];
}

const initialState: ClamHistoryOpdSliceState = {
    opdHistoryClaims: [],
    searchStatus: "idle",
};

export const historyOpdSlice = createAppSlice({
    name: "historyOpd",
    initialState,
    reducers: (create) => ({
        getOpdClaim: create.asyncThunk(
            async (body: RequestHsitoryClaim) => {
                const response = await resultHistoryClaims(body);
                return response;
            },
            {
                pending: (state) => {
                    state.searchStatus = "loading";
                },
                fulfilled: (state, action) => {
                    state.opdHistoryClaims = action.payload as unknown as HistoryClaimsOpdModel[]
                    state.searchStatus = "idle";
                },
                rejected: (state) => {
                    state.searchStatus = "failed";
                },
            }
        ),
    }),
    selectors: {
        selectStatus: (historyOpd) => historyOpd.searchStatus,
        selectOpdHistoryClaims: (historyOpd) => historyOpd.opdHistoryClaims,
    },
});

export const { getOpdClaim } = historyOpdSlice.actions;
export const { selectStatus, selectOpdHistoryClaims } = historyOpdSlice.selectors;
