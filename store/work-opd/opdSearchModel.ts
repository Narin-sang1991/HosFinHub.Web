import { SearchPatientModel, WorkSearchModel } from "../work/workSearchModel";


export interface OpdSearchModel extends WorkSearchModel{
  seq: string;
  dateopd: Date;
  opd_pat: SearchPatientModel;  // todo : narin.sa => move to using in WorkSearchModel
  opd_claim_log: any[];         // todo : narin.sa => move to using in WorkSearchModel
}

export interface OpdSearchReponse {
  TotalItem: number;
  TotalPage: number;
  Items?: OpdSearchModel[];
}
