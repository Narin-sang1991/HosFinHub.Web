import type { PatientModel } from "@/store/patient/patientModel";
import type { InsureModel } from "@/store/financial/insureModel";
import { OpdValids } from "./opdEditorModel";

export interface OpdSearchModel {
  id: string;
  hn: string;
  seq: number;
  dateopd: Date;
  opd_pat: OpdPatientModel;
  error: OpdValids[]
}

export interface OpdPatientModel extends PatientModel {
  pat_ins: InsureModel[];
}

export interface OpdSearchReponse {
  TotalItem: number;
  TotalPage: number;
  Items?: OpdSearchModel[];
}
