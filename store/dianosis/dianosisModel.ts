

export interface OpdDianosisModel extends DianosisModel {
    hn: string
    datedx: string
    clinic: string
    person_id: string
    seq: string
}

export interface IpdDianosisModel extends DianosisModel {
    an: string
}

export interface DianosisModel {
    id: string;
    diag: string;
    dxtype: string;
    drdx: string;
}