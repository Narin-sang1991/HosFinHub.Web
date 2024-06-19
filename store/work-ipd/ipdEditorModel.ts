import type { PatientDetailModel } from "@/store/patient/patientModel";
import type { InvoiceDrugModel, InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import type { InsureDetailModel } from "@/store/financial/insureModel";
import type { InvoiceModel, } from "@/store/financial/invoiceModel";
import type { InvoiceItemModel, InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { IpdDianosisModel } from "../dianosis/dianosisModel";
import { LabfuModel } from "../medical-tech/labfuModel";
import { AccidentEmergencyModel } from "../refer/accidentEmergencyModel";
import { IpdReferModel } from "../refer/referModel";
import { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "../fee-additional/additionalModel";
import { IpdOperationModel } from '@/store/operation/operationModel'
import { WorkValidModel } from "../work/workValidModel";

export interface IpdEditorModel {

  /**
   * #origin => ADP
   **/
  additPayments: AdditPaymentModelEditorModel[];

  /**
   * #origin => AER
   **/
  accidenEmergencies: AccidentEmergencyModel[];

  /**
  * #origin => CHT
  **/
  invoices: InvoiceModel[];

  /**
   * #origin => CHA
   **/
  invoiceItems: InvoiceItemEditorModel[];

  /**
  * #origin => DRU
  **/
  drugItems: InvoiceDrugEditorModel[];

  /**
  * #origin => INS
  **/
  insureItems: InsureDetailModel[];

  /**
  * #origin => LABFU
  **/
  labfuItems: LabfuModel[];

  /**
  * #origin => IDX
  **/
  diagnosisItems: IpdDianosisModel[],

  /**
  * #origin => IPD
  **/
  ipdDetail: IpdDetailModel;

  /**
  * #origin => IRF
  **/
  ipdRefer: IpdReferModel;

  /**
  * #origin => PAT
  **/
  patient: PatientDetailModel;

  /**
 * #origin => IOP
 **/
  procedureItems: IpdOperationModel[];

  accidenEmergencyRefer: {
    accidenEmergencyItems?: AccidentEmergencyModel[],
    clinic?: string,
    insRefercl?: string,
    referType?: string,
    referDate?: string,
  };
}

export interface IpdValidModel {
  ipd: WorkValidModel[];
  pat: WorkValidModel[];
  ins: WorkValidModel[];
  adp: WorkValidModel[];
  aer: WorkValidModel[];
  cht: WorkValidModel[];
  cha: WorkValidModel[];
  dru: WorkValidModel[];
  labfu: WorkValidModel[];
  idx: WorkValidModel[];
  iop: WorkValidModel[];
  irf: WorkValidModel[];
}

export interface IpdDataModel {
  adp: AdditionalPaymentModel[];
  aer: AccidentEmergencyModel[];
  cha: InvoiceItemModel[];
  cht: InvoiceModel[];
  dru: InvoiceDrugModel[];
  ins: InsureDetailModel[];
  labfu: LabfuModel[];
  idx: IpdDianosisModel[],
  iop: IpdOperationModel[],
  ipd: IpdDetailModel[];
  irf: IpdReferModel[];
  pat: PatientDetailModel[];
}

export interface IpdResponse {
  data: IpdDataModel;
  error: Array<IpdValidModel>;
}
export interface IpdDetailModel {
  id: string; // unique key of data
  hn: string; // patient number
  an: string; // transaction key
  dateadm: Date;
  timeadm: string;
  datedsc: Date;
  timedsc: string;
  dischs: string;
  discht: string;
  warddsc: string; // code of ward
  dept: string;
  adm_w: number;

  /**
   * #Description => สถานะการใช้สิทธิ์;
   * ใช้สิทธิ์: 1,
   * ไม่ใช้สิทธิ์ ไม่ขอเบิก: 2,
   **/
  uuc: string;

  /**
   * #Description => ประเภทการให้บริการ;
   * IPD : 1,
   * Ambulatory Care: A,
   **/
  svctype: string;

}


export function instanceOfIpdDetail(object: any): object is IpdDetailModel {
  return true;
}
export function instanceOfIpdValid(object: any): object is IpdValidModel {
  return true;
}
export function instanceOfIpdValids(object: any): object is IpdValidModel[] {
  return true;
}