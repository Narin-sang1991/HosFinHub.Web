export interface PatIns {
    id: string
    cid: string
    inscl: string
    subtype: string
    an: string
}

export interface IpdPat {
    id: string
    hn: string
    title: string
    fname: string
    lname: string
    person_id: string
    pat_ins: PatIns[]
}

interface IpdLog {
    an: string
    ipd_claim_date: string
    status_code: string
    status: {
        description: string
    }
}

interface IpdError {

}

export interface IpdTransferMode {
    hn: string
    an: string
    datedsc: string
    uuc: string
    error: any[]
    work_pat: IpdPat
    claim_log: IpdLog[]
}
