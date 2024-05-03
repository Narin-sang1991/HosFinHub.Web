"use client";
//#region Import
import React from "react";

//#region Import

//#region DataTyep
interface InvoiceServicesType {
  chargeItemNumber: string;
  chargeItemData: any[];
}

export interface InvoiceServicesProps {
  modelServiceOpen?: boolean;
  modelServiceData?: InvoiceServicesType
}
//#region DataTyep

//#region React FC
const InvoiceServices: React.FC<InvoiceServicesProps> = ({ modelServiceOpen, modelServiceData, }) => {

  return (
    <React.Fragment>
      dent
    </React.Fragment>
  )
}
//#region React FC
export default InvoiceServices