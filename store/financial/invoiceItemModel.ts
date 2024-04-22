
export interface InvoiceItemModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  chrgitem: string; // code of payment method in announcement
  amount: number; // amount of invoice item
  person_id: string; // id of person
  seq: string; // transaction key
}

export interface InvoiceItemEditorModel {
  id: string; // unique key of data
  seq: string; // transaction key
  dummyKey: number; // dummy key for UI component
  idDurty: boolean;
  totalAmount: number;
  overAmount: number;
  approvedAmount: number;
  chargeCode: string;
  chargeDetail: string;
  status: number;
  valid?: any[];
}