
import { axiosHosProvider } from "./axios.interceptor";
import type { FreeDrugModel } from "@/store/free-additional/freeDrugModel";

export const fetchSearchDrug = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/catalogs/free-schedule-drug', criteria)
        .then((response) => {
            const result: { data: FreeDrugModel[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};