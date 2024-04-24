export interface OpdModel {
    id: string
    hn: string
    clinic: string
    dateopd: string
    timeopd: string
    seq: string
    uuc: string
    detail: string
    btemp: string
    sbp: string
    dbp: string
    pr: string
    rr: string
    optype: string
    typein: string
    typeout: string
}

export interface AdpModel {
    id: string
    hn: string
    an: string
    dateopd: string
    type: string
    code: string
    qty: string
    rate: string
    seq: string
    cagcode: string
    dose: string
    ca_type: string
    serialno: string
    totcopay: string
    use_status: string
    total: string
    tmltcode: string
    status1: string
    bi: string
    clinic: string
    itemsrc: string
    provider: string
    gravida: string
    ga_week: string
    dcip_e_screen: string
    lmp: string
}

// export interface AerModel {
//     id: string
//     hn: string
//     an: string
//     dateopd: string
//     authae: string
//     aedate: string
//     aetime: string
//     aetype: string
//     refer_no: string
//     refmaini: string
//     ireftype: string
//     refmaino: string
//     oreftype: string
//     ucae: string
//     emtype: string
//     seq: string
//     aestatus: string
//     dalert: string
//     talert: string
// }

export interface ChaModel {
    id: string
    hn: string
    an: string
    date: string
    chrgitem: string
    amount: string
    person_id: string
    seq: string
}

export interface ChtModel {
    id: string
    hn: string
    an: string
    date: string
    total: string
    paid: string
    pttype: string
    person_id: string
    seq: string
    opd_memo: string
    invoice_no: string
    invoice_lt: string
}

export interface DruModel {
    id: string
    hcode: string
    hn: string
    an: string
    clinic: string
    person_id: string
    date_serv: string
    did: string
    didname: string
    amount: string
    drugprice: string
    drugcost: string
    didstd: string
    unit: string
    unit_pack: string
    seq: string
    drugremark: string
    pa_no: string
    totcopay: string
    use_status: string
    total: string
    sigcode: string
    sigtext: string
    provider: string
}

export interface InsModel {
    id: string
    hn: string
    inscl: string
    subtype: string
    hcode: string
    dateexp: string
    hospmain: string
    hospsub: string
    govcode: string
    govname: string
    permitno: string
    docno: string
    ownrpid: string
    ownname: string
    an: string
    seq: string
    subinscl: string
    relinscl: string
    htype: string
}

// export interface LabfuModel {
//     id: string
//     hcode: string
//     hn: string
//     person_id: string
//     dateserv: string
//     seq: string
//     labtest: string
//     labresult: string

// }

// export interface OdxModel {
//     id: string
//     hn: string
//     datedx: string
//     clinic: string
//     diag: string
//     dxtype: string
//     drdx: string
//     person_id: string
//     seq: string
// }

export interface OopModel {
    id: string
    hn: string
    dateopd: string
    clinic: string
    oper: string
    dropid: string
    person_id: string
    seq: string
    servprice: string
}

// export interface OrfModel {
//     id: string
//     hn: string
//     dateopd: string
//     clinic: string
//     refer: string
//     refertype: string
//     seq: string
//     referdate: string
// }

export interface PatModel {
    id: string
    hcode: string
    hn: string
    changwat: string
    amphur: string
    dob: string
    sex: string
    marriage: string
    occupa: string
    nation: string
    person_id: string
    namepat: string
    title: string
    fname: string
    lname: string
    idtype: string
}