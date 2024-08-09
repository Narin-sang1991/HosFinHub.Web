import { DashboardModel } from "@/store/dashboard/dashboard.entity";
import { axiosHosProvider } from "./axios.interceptor";

export const fetchDashboardOpd = async () => {
    const res = await axiosHosProvider.get('/dashboard/static-opd')
        .then(res => {
            const result: { data: DashboardModel[] } = res
            return result
        })
        .catch((e) => console.log('API-Error: ', e))

    return res
}

export const fetchDashboardIpd = async () => {
    const res = await axiosHosProvider.get('/dashboard/static-ipd')
        .then(res => {
            const result: { data: DashboardModel[] } = res
            return result
        })
        .catch((e) => console.log('API-Error: ', e))

    return res
}