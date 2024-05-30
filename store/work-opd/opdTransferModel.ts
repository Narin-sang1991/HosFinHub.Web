interface PatIns {
    id: string
    cid: string
    inscl: string
    subtype: string

}

interface OpdPat {
    id: string
    hn: string
    title: string
    fname: string
    lname: string
    person_id: string
    pat_ins: PatIns[]
}

interface OpdLog {
    seq: string
    ipd_claim_date: string
    status_code: string
    status: {
        description: string
    }
}

interface OpdError {

}

export interface OpdTransferMode {
    hn: string
    seq: string
    datedsc: string
    uuc: string
    error: any[]
    opd_pat: OpdPat
    opd_claim_log: OpdLog[]
}
