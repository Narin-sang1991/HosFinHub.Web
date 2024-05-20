
import { axiosHosProvider } from "./axios.interceptor";
import type { IpdSearchReponse } from "@/store/work-ipd/ipdSearchModel";
import type { IpdResponse } from "@/store/work-ipd/ipdEditorModel";

export const fetchSearch = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/work/ipd-list', criteria)
        .then((response) => {
            const result: { data: IpdSearchReponse[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchGet = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('edit-16f/get-pat-ipd', criteria)
        .then((response) => {
            const result: { data: IpdResponse } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchSave = async (data: any) => {
    const apiResult = await axiosHosProvider.post('edit-16f/update-pat-ipd', data)
        .then((response) => {
            console.log("API-Response: ", response);
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};