
export interface AccidentEmergencyModel {
    id: string
    hn: string
    an: string
    dateopd: string
    authae?: string
    aedate: string
    aetime?: string
    aetype?: string
    refer_no: string
    refmaini: string
    ireftype: string
    refmaino: string
    oreftype: string
    ucae?: string
    emtype?: string
    seq: string
    aestatus: string
    dalert: string
    talert: string
}

export interface AccidentEmergencyEditorModel {
    DateText: string,
    ReferNo: string,
    HospitalRefCode: string,
    Diagnose: boolean;
    Heal: boolean;
    KeepHeal: boolean;
    DemandOfPatient: boolean;
}
