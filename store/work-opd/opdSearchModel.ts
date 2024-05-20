import { SearchPatientModel, WorkSearchModel } from "../work/workSearchModel";


export interface OpdSearchModel extends WorkSearchModel{
  seq: string;
  dateopd: Date;
}

export interface OpdSearchReponse {
  rowCount: number;
  pageIndex: number;
  data: OpdSearchModel[];
}
