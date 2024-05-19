import { fetchIpdTransfer } from "@/services/transfer.ipd.provicer";
import { createAppSlice } from "../createAppSlice";
import { IpdTransferMode } from "./ipdTransderModel";


export interface transferIpdSliceIpdSliceState {
    searchResult: IpdTransferMode[]
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: transferIpdSliceIpdSliceState = {
    searchResult: [],
    searchStatus: 'idle'
}

export const transferIpdSlice = createAppSlice({
    name: "transferIpd",
    initialState,
    reducers: (create) => ({
        searchAsync: create.asyncThunk(async (body: { startDate: string, endDate: string }) => {
            const response = await fetchIpdTransfer(body)
            return response
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.searchResult = action.payload as unknown as IpdTransferMode[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        })
    }),
    selectors: {
        selectResult: (transferIpd) => transferIpd.searchResult,
        selectStatus: (transferIpd) => transferIpd.searchStatus
    }
})

export const { searchAsync } = transferIpdSlice.actions

export const { selectResult, selectStatus } = transferIpdSlice.selectors