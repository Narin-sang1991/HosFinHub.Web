

export function getOperType(optype?: string) {
    if (optype == undefined) return "";

    if (optype == '1') return "Principal procedure";
    if (optype == '2') return "Secondary procedure";
    if (optype == '3') return "Others";

    return "-";
}