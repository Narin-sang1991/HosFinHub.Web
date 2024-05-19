
import { axiosHosProvider } from "./axios.interceptor";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import type { OpdResponse } from "@/store/work-opd/opdEditorModel";

export const fetchSearch = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('/work/opd-list', criteria)
        .then((response) => {
            const result: { data: OpdSearchModel[] } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchGet = async (criteria: any) => {
    const apiResult = await axiosHosProvider.post('edit-16f/get-pat-opd', criteria)
        .then((response) => {
            const result: { data: OpdResponse } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const fetchSave = async (data: any) => {
    const apiResult = await axiosHosProvider.post('edit-16f/update-pat-opd', data)
        .then((response) => {
            console.log("API-Response: ", response);
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};