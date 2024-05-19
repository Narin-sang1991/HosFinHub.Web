import { fetchOpdTransfer } from "@/services/transfer.ipd.provicer";
import { createAppSlice } from "../createAppSlice";
import { OpdTransferMode } from "./opdTransderModel";


export interface transferOpdSlice {
    searchResultTransferOpd: OpdTransferMode[]
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: transferOpdSlice = {
    searchResultTransferOpd: [],
    searchStatus: 'idle'
}

export const transferOpdSlice = createAppSlice({
    name: "transferOpd",
    initialState,
    reducers: (create) => ({
        searchTransferOpd: create.asyncThunk(async (body: { startDate: string, endDate: string }) => {
            const response = await fetchOpdTransfer(body)
            return response
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.searchResultTransferOpd = action.payload as unknown as OpdTransferMode[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        })
    }),
    selectors: {
        selectResultTransferOpd: (transferOpd) => transferOpd.searchResultTransferOpd,
        selectStatus: (transferOpd) => transferOpd.searchStatus
    }
})

export const { searchTransferOpd } = transferOpdSlice.actions

export const { selectResultTransferOpd, selectStatus } = transferOpdSlice.selectors