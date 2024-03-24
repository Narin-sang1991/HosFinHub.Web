
import { axiosProvider } from "./axios.interceptor";
import * as serializer from "./criteria.serializer";
import type { CompanyReponse } from "@/store/company/companyModel";

const modulePath: string = '/api/EntityModule'

export const fetchSearch = async (criteria: any) => {
    let body = serializer.SerializeCriteria({ criteria, defaultSorting: "CompanyCode" });
    const apiResult = await axiosProvider.post(`${modulePath}/MasterCompany/Search/v1`, body)
        .then((response) => {
            const result: { data: CompanyReponse } = response;
            // console.log("Company-Response: ", result);
            return result;
        })
        .catch((e) => console.log("API-Error: ", e))
    // console.log("Company-apiResult: ", apiResult);
    return apiResult;
};