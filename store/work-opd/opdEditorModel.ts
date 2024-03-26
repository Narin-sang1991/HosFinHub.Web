

export type OpdEditorModel = {
    opd: OpdDetailModel[],

}

export type OpdDetailModel = {
    id: string,
    hn: string,
    clinic: string,
    dateopd: Date,
    timeopd: string,
    seq: string,
    detail?: string,
    optype?:string,
    typein: string,
    typeout: string
}
