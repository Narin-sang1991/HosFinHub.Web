
import { axiosHosProvider } from "./axios.interceptor";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";

const modulePath: string = '/api/EntityModule'

export const fetchSearch = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/work/opd-list', criteria)
        .then((response) => {
            const result: { data: OpdSearchModel[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};