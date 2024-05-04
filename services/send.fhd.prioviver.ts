import { axiosHosProvider } from "./axios.interceptor";


export const claimOpd = async (value: string[]) => {

    const apiResult = await axiosHosProvider.post('/claim-fdh/opd', { seq: value })
        .then((response) => {
            const result = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};

export const claimIpd = async (value: string[]) => {
    const apiResult = await axiosHosProvider.post('/claim-fdh/opd', { an: value })
        .then((response) => {
            const result = response;
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    return apiResult;
};


