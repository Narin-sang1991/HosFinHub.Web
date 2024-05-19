import { SearchPatientModel, WorkSearchModel } from "../work/workSearchModel";


export interface IpdSearchModel  extends WorkSearchModel{
  an: string;
  datedsc: Date;
  ipd_pat: SearchPatientModel;  // todo : narin.sa => move to using in WorkSearchModel
  ipd_claim_log: any[];         // todo : narin.sa => move to using in WorkSearchModel
}

export interface IpdSearchReponse {
  TotalItem: number;
  TotalPage: number;
  Items?: IpdSearchModel[];
}
