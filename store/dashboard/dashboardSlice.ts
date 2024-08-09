import { fetchDashboardOpd, fetchDashboardIpd } from "@/services/dashboard.provider";
import { createAppSlice } from "../createAppSlice";
import { DashboardModel } from "./dashboard.entity"


export interface DashboardStateModel {
    opdDashboard: DashboardModel[]
    ipdDashboard: DashboardModel[]
    searchStatus: "idle" | "loading" | "failed";
}

const initialState: DashboardStateModel = {
    ipdDashboard: [],
    opdDashboard: [],
    searchStatus: 'idle'
}

export const dashboardSlice = createAppSlice({
    name: "dashboard",
    initialState,
    reducers: (create) => ({
        getDashboardOpd: create.asyncThunk(
            async () => {
                const responst = await fetchDashboardOpd();
                return responst
            }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.opdDashboard = action.payload as unknown as DashboardModel[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        }),
        getDashboardIod: create.asyncThunk(async () => {
            const responst = await fetchDashboardIpd();
            return responst
        }, {
            pending: (state) => {
                state.searchStatus = 'loading'
            },
            fulfilled: (state, action) => {
                state.searchStatus = 'idle'
                state.ipdDashboard = action.payload as unknown as DashboardModel[]
            },
            rejected: (state) => {
                state.searchStatus = 'failed'
            }
        }),
    }),
    selectors: {
        selectStatus: state => state.searchStatus,
        selectOpdDashboard: state => state.opdDashboard,
        selectIpdDashboard: state => state.ipdDashboard
    }
})

export const { getDashboardIod, getDashboardOpd } = dashboardSlice.actions
export const { selectIpdDashboard, selectOpdDashboard, selectStatus } = dashboardSlice.selectors