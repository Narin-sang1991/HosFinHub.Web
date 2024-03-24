export type Company = {
    CompanyID: number,
    CompanyCode: string,
    CompanyShortName: string,
    CompanyFullName: string,
    CompanyType: number,
    CompanyTypeDisplay: string,
    CompanyGroupCode: string,
    Revision: string
}

export interface CompanyReponse {
    TotalItem: number;
    TotalPage: number;
    Items?:  Company[];
}

