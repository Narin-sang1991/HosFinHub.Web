import { fetchHistoryNumberIpd, fetchHistoryServiceIpd } from "@/services/history.privider";
import { createAppSlice } from "../createAppSlice";
import { HistoryClaimsIpdModel, IpdClamHistory, IpdClamService, RequestHsitoryClaim } from "./claimModel";
import { resultHistoryClaims } from "@/services/claim.status";


export interface ClamHistoryIpdSliceState {
    ipdHistoryClaims: HistoryClaimsIpdModel[];
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: ClamHistoryIpdSliceState = {
    ipdHistoryClaims: [],
    searchStatus: "idle",
};


export const historyIpdSlice = createAppSlice({
    name: 'historyIpd',
    initialState,
    reducers: (create) => ({

        getIpdClaim: create.asyncThunk(async (body: RequestHsitoryClaim) => {
            const response = await resultHistoryClaims(body);
            return response;
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.ipdHistoryClaims = action.payload as unknown as HistoryClaimsIpdModel[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        })
    }),
    selectors: {
        selectStatus: (state) => state.searchStatus,
        selectIpdHistoryClaims: (state) => state.ipdHistoryClaims,
    }
})

export const { getIpdClaim } = historyIpdSlice.actions;
export const { selectStatus, selectIpdHistoryClaims } = historyIpdSlice.selectors