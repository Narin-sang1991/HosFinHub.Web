import { IpdTransferMode } from "@/store/work-ipd/ipdTransderModel"
import { axiosHosProvider } from "./axios.interceptor"


export const fetchIpdTransfer = async (criteria: { startDate: string, endDate: string }) => {
    const apiResult = await axiosHosProvider.post('/work/ipd-list-transfer', criteria)
        .then((res) => {
            const result: { data: IpdTransferMode[] } = res
            return result
        })
        .catch((e) => console.log("API-Error: ", e))

    return apiResult
}