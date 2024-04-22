import type { DrugModel, InvoiceDrugEditorModel } from "@/store/patient/drugModel";
import { OpdValidModel, OpdValids } from "@/store/work-opd/opdEditorModel";

export function genarateDrugEditors(
  drugItems: DrugModel[],
  validItems: OpdValidModel[] | undefined
) {
  let results: InvoiceDrugEditorModel[] = [];
  drugItems.forEach((drugItem, i) => {
    //assing Error
    const itemDruError = validItems?.filter((i) => i.dru)[0][
      "dru"
    ] as unknown as OpdValids[];
    const assignItemError = itemDruError.filter((i) => i.id === drugItem.id);

    let dummyKey: number = i + 1;
    let data: InvoiceDrugEditorModel = {
      ...drugItem,
      dummyKey,
      idDurty: false,
      totalreq: 0.00,
      hasError: (assignItemError.length !== 0),
      validError: assignItemError,
    };
    results.push(data);
  });
  return results;
} 
