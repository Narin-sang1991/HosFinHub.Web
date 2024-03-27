
import { axiosHosProvider } from "./axios.interceptor";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import type { OpdResponeModel } from "@/store/work-opd/opdEditorModel";

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
    const apiResult = await axiosHosProvider.post('edit-16f/opd', criteria)
        .then((response) => {
            const result: { data: OpdResponeModel } = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};