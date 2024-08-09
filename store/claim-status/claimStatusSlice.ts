import { fetchClaimStatus } from "@/services/claim.status";
import { createAppSlice } from "../createAppSlice";

export interface ClaimStatusModel {
    fdh_number_process: string
    fdh_status_process: string
    fdh_status_process_th: string
}

interface ClaimStatusStateModel {
    status: "idle" | "loading" | "failed";
    claimStatus: ClaimStatusModel[]
}

const initialState: ClaimStatusStateModel = {
    claimStatus: [],
    status: "idle"
}

export const claimStatusSlice = createAppSlice({
    name: 'claimStatus',
    initialState,
    reducers: (create) => ({
        getClaimStatus: create.asyncThunk(async () => {
            const response = await fetchClaimStatus()
            return response
        }, {
            pending: (state) => {
                state.status = 'loading'
            },
            fulfilled: (state, action) => {
                state.status = "idle"
                state.claimStatus = action.payload as unknown as ClaimStatusModel[]
            },
            rejected: (state) => {
                state.status = 'failed'
            }
        })
    }),
    selectors: {
        selectClaimStatus: (state) => state.claimStatus
    }
})

export const { getClaimStatus } = claimStatusSlice.actions
export const { selectClaimStatus } = claimStatusSlice.selectors