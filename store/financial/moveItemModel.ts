

export interface MoveInvoiceItemModel   {
    id: string;         // unique key of data
    sourceFileID : string,
    chargeCodeFrom?: string, // type code of invoice item
    chargeCodeTo: string, // type code of invoice item
    name: string,
}
