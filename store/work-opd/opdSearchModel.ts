import type { PatientModel } from "@/store/patient/patientModel";
import type { InsureModel } from "@/store/financial/insureModel";
import { OpdValids } from "./opdEditorModel";

export interface OpdSearchModel {
  id: string;
  hn: string;
  seq: string;
  dateopd: Date;
  opd_pat: OpdPatientModel;
  uuc: string,
  error: OpdValids[]
  opd_claim_log: any[]
}

export interface OpdPatientModel extends PatientModel {
  pat_ins: InsureModel[];
}

export interface OpdSearchReponse {
  TotalItem: number;
  TotalPage: number;
  Items?: OpdSearchModel[];
}
