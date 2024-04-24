
export interface InsureModel   {
    id: string,         // unique key of data
    cid: string,        // claim key id
    inscl: string,      // code of insurance
    subtype: number, 
    seq: string, 
}

export interface InsureDetailModel   {
    id: string
    hn: string,         // patient number
    inscl: string
    subtype: string
    hcode: string,      // key of hospital
    dateexp: Date, 
    hospmain: string,
    hospsub: string,
    govcode?: string,
    govname?: string,
    permitno?: string,
    docno?: string,
    ownrpid?: string,
    ownname?: string,
    an?: string,
    subinscl?: string,
    relinscl?: string,
    htype?: string,
}