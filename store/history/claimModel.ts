import { IdxModel, IopModel, IpdModel, IrfModel } from "../financial/ipdModel"
import { AdpModel, AerModel, ChaModel, ChtModel, DruModel, InsModel, LabfuModel, OdxModel, OopModel, OpdModel, OrfModel, PatModel } from "../financial/opdModel"

export interface OpdClamHistory {
    opd_claim_number: string
    sent_date: string
    service: [
        {
            opddate: string
            seq: string
            staff_number_claim: string | null
        }
    ]
}

export interface OpdClamService extends OpdModel {
    adp: AdpModel[]
    aer: AerModel[]
    cha: ChaModel[]
    cht: ChtModel[]
    dru: DruModel[]
    ins: InsModel[]
    labfu: LabfuModel[]
    odx: OdxModel[]
    oop: OopModel[]
    orf: OrfModel[]
    pat: PatModel[]
}

export interface IpdClamHistory {
    ipd_claim_number: string
    sent_date: string
    service: [
        {
            ipddate: string
            an: string
            staff_number_claim: string | null,
        }
    ]
}

export interface IpdClamService extends IpdModel {
    pat: PatModel[]
    ins: InsModel[]
    adp: AdpModel[]
    aer: AerModel[]
    cht: ChtModel[]
    cha: ChaModel[]
    dru: DruModel[]
    idx: IdxModel[]
    iop: IopModel[]
    irf: IrfModel[]
}
