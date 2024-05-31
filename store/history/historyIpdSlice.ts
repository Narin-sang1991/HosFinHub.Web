import { fetchHistoryNumberIpd, fetchHistoryServiceIpd } from "@/services/history.privider";
import { createAppSlice } from "../createAppSlice";
import { IpdClamHistory, IpdClamService } from "./claimModel";

export interface ClaimHistorIpdSliceState {
    searchResult: IpdClamHistory[]
    searchStatus: "idle" | "loading" | "failed";
    ipdClamService: IpdClamService[]
}

const initialState: ClaimHistorIpdSliceState = {
    ipdClamService: [],
    searchResult: [],
    searchStatus: 'idle'
}

export const historyIpdSlice = createAppSlice({
    name: 'historyIpd',
    initialState,
    reducers: (create) => ({
        searchAsynch: create.asyncThunk(async (body: { startDate: string, endDate: string }) => {
            const response = await fetchHistoryNumberIpd(body)
            return response
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.searchResult = (action.payload as unknown as IpdClamHistory[]).sort((a, b) => a.sent_date < b.sent_date ? 1 : (b.sent_date < a.sent_date ? -1 : 0))
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        }),
        getIpdClaim: create.asyncThunk(async (body: { an: string[] }) => {
            const response = await fetchHistoryServiceIpd(body);
            return response;
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.ipdClamService = action.payload as unknown as IpdClamService[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        })
    }),
    selectors: {
        selectResult: (historyIpd) => historyIpd.searchResult,
        selectStatus: (historyIpd) => historyIpd.searchStatus,
        selectClaimService: (historyIpd) => historyIpd.ipdClamService
    }
})

export const { getIpdClaim, searchAsynch } = historyIpdSlice.actions;
export const { selectResult, selectStatus, selectClaimService } = historyIpdSlice.selectors