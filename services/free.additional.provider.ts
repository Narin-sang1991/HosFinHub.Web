
import { axiosHosProvider } from "./axios.interceptor";
import { FeeScheduleModel } from "@/store/fee-additional/feeScheduleModel";
import type { FeeDrugModel } from "@/store/fee-additional/feeDrugModel";

export const fetchSearchDrug = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/catalogs/free-schedule-drug', criteria)
        .then((response) => {
            const result: { data: FeeDrugModel[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchSearchFeeSchedule = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/catalogs/free-schedule-adp', criteria)
        .then((response) => {
            const result: { data: FeeScheduleModel[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};