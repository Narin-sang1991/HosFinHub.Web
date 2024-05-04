
export interface InvoiceModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  total: number; // total of payment
  paid: number; // paid
  pttype: number;
  person_id: string; // id of person
  seq: string; // transaction key
  opd_memo?: string;
  invoice_no?: string; // invoice number
  invoice_lt?: string; // invoice number of service point
}