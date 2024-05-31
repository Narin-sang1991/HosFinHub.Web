import { IpdClamHistory, OpdClamHistory } from "@/store/history/claimModel";
import { axiosHosProvider } from "./axios.interceptor";

export const fetchHistoryNumberOpd = async (criteria: { startDate: string, endDate: string }) => {
    const apiResult = await axiosHosProvider.post('/history-list/opd-claim-numbers', criteria)
        .then((response) => {
            const result: { data: OpdClamHistory[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchHistoryServiceOpd = async (criteria: { seq: string[] }) => {
    const apiResult = await axiosHosProvider.post('/history-list/opd-claim-service', criteria)
        .then((response) => {
            const result: { data: OpdClamHistory[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchHistoryNumberIpd = async (criteria: { startDate: string, endDate: string }) => {
    const apiResult = await axiosHosProvider.post('/history-list/ipd-claim-numbers', criteria)
        .then((response) => {
            const result: { data: IpdClamHistory[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchHistoryServiceIpd = async (criteria: { an: string[] }) => {
    const apiResult = await axiosHosProvider.post('/history-list/ipd-claim-service', criteria)
        .then((response) => {
            const result: { data: IpdClamHistory[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};
