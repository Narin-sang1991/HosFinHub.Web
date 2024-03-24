

export type OpdSearchModel = {
    id: string,
    hn: string,
    seq: string,
    dateopd: Date,
    opd_pat: OpdPatientModel[],

}

export type OpdPatientModel = {
    id: string,
    hn: string,
    title: string,
    fname: string,
    person_id: string,
}

export interface OpdSearchReponse {
    TotalItem: number;
    TotalPage: number;
    Items?: OpdSearchModel[];
}

