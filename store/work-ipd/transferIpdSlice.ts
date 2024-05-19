import { fetchIpdTransfer } from "@/services/transfer.ipd.provicer";
import { createAppSlice } from "../createAppSlice";
import { IpdTransferMode } from "./ipdTransderModel";
export interface transferIpdSliceIpdSliceState {
    searchResultTransferIpd: IpdTransferMode[]
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: transferIpdSliceIpdSliceState = {
    searchResultTransferIpd: [],
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
                const paload = action.payload as unknown as IpdTransferMode[]
                console.log(paload);

                state.searchStatus = 'idle'
                state.searchResultTransferIpd = paload
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        })
    }),
    selectors: {
        selectIpdTransferReady: (transferIpd) => transferIpd.searchResultTransferIpd,
        selectStatus: (transferIpd) => transferIpd.searchStatus
    }
})

export const { searchAsync } = transferIpdSlice.actions

export const { selectIpdTransferReady, selectStatus } = transferIpdSlice.selectors