
import { WorkValidModel } from "./workValidModel";
import { InsureModel } from "../financial/insureModel";
import { PatientModel } from "../patient/patientModel";


export interface WorkSearchModel {
    id: string;
    hn: string;
    uuc: string;
    work_pat: SearchPatientModel;
    error: WorkValidModel[];
    claim_log: any[];
  }
  
  export interface SearchPatientModel extends PatientModel {
    pat_ins: InsureModel[];
  }
  