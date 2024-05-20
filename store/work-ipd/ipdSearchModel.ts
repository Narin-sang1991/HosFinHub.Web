import { SearchPatientModel, WorkSearchModel } from "../work/workSearchModel";


export interface IpdSearchModel extends WorkSearchModel {
  an: string;
  datedsc: Date;
}

export interface IpdSearchReponse {
  rowCount: number;
  pageIndex: number;
  data?: IpdSearchModel[];
}
