
import { ClaimStatusModel } from "@/store/claim-status/claimStatusSlice";
import { axiosHosProvider } from "./axios.interceptor";
import { HistoryClaimsIpdModel, HistoryClaimsOpdModel, RequestHsitoryClaim } from "@/store/history/claimModel";

export const fetchClaimStatus = async () => {
    const res = await axiosHosProvider.get('/catalogs/claim-status')
        .then(res => {
            const result: { data: ClaimStatusModel[] } = res
            return result
        })
        .catch((e) => console.log('API-Error: ', e))
    return res
}

export const resultHistoryClaims = async (body: RequestHsitoryClaim) => {
    const result = await axiosHosProvider.post('/history-list/historys', body)
        .then(res => {
            const result: { data: HistoryClaimsOpdModel[] | HistoryClaimsIpdModel[] } = res
            return result
        })

    return result
}