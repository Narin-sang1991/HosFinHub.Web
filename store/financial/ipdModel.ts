import { AdpModel, AerModel, ChtModel, DruModel, InsModel, PatModel } from "./opdModel";

export interface PatIpdModel extends PatModel { }

export interface InsIpdModel extends InsModel { }

export interface AdpIpdModel extends AdpModel { }

export interface AerIpdModel extends AerModel { }

export interface ChtIpdModel extends ChtModel { }

export interface DruIpdModel extends DruModel { }

export interface IpdModel {
    id: string
    hn: string
    an: string
    dateadm: string
    timeadm: string
    datedsc: string
    timedsc: string
    dischs: string
    discht: string
    warddsc: string
    dept: string
    adm_w: string
    uuc: string
    svctype: string
}

export interface IdxModel {
    id: string
    an: string
    diag: string
    dxtype: string
    drdx: string
}
export interface IopModel {
    id: string
    an: string
    oper: string
    optype: string
    dropid: string
    datein: string
    timein: string
    dateout: string
    timeout: string
}

export interface IrfModel {
    id: string
    an: string
    refer: string
    refertype: string
}

export interface LvdModel {
    id: string
    seqlvd: string
    an: string
    dateout: string
    timeout: string
    datein: string
    timein: string
    qtyday: string
}