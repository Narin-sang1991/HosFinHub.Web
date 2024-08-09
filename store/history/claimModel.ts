import { IdxModel, IopModel, IpdModel, IrfModel } from "../financial/ipdModel";
import {
  AdpModel,
  AerModel,
  ChaModel,
  ChtModel,
  DruModel,
  InsModel,
  LabfuModel,
  OdxModel,
  OopModel,
  OpdModel,
  OrfModel,
  PatModel,
} from "../financial/opdModel";

export interface OpdClamHistory {
  opd_claim_number: string;
  sent_date: string;
  service: [
    {
      opddate: string;
      seq: string;
      staff_number_claim: string | null;
    }
  ];
}

export interface OpdClamService extends OpdModel {
  adp: AdpModel[];
  aer: AerModel[];
  cha: ChaModel[];
  cht: ChtModel[];
  dru: DruModel[];
  ins: InsModel[];
  labfu: LabfuModel[];
  odx: OdxModel[];
  oop: OopModel[];
  orf: OrfModel[];
  pat: PatModel[];
  fdh: any[];
}

export interface IpdClamHistory {
  ipd_claim_number: string;
  sent_date: string;
  service: [
    {
      ipddate: string;
      an: string;
      staff_number_claim: string | null;
    }
  ];
}

export interface IpdClamService extends IpdModel {
  pat: PatModel[];
  ins: InsModel[];
  adp: AdpModel[];
  aer: AerModel[];
  cht: ChtModel[];
  cha: ChaModel[];
  dru: DruModel[];
  idx: IdxModel[];
  iop: IopModel[];
  irf: IrfModel[];
  fdh: any[];
}


export interface RequestHsitoryClaim {
  endDate: string
  serviceType: "opd" | 'ipd'
  startDate: string
  statusProcess: string
}

export interface HistoryClaimsOpdModel {
  dateopd: string
  fdh_process_status: string
  fdh_status_message: string
  fdh_status_message_th: string
  fname: string
  lname: string
  hn: string
  inscl: string
  opd_claim_date: string
  seq: string
  subinscl: string
  subtype: string
  timeopd: string
  title: string
}

export interface HistoryClaimsIpdModel {
  dateopd: string
  fdh_process_status: string
  fdh_status_message: string
  fdh_status_message_th: string
  fname: string
  lname: string
  hn: string
  inscl: string
  opd_claim_date: string
  an: string
  subinscl: string
  subtype: string
  timeopd: string
  title: string
}