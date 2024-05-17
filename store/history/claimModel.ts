export interface OpdClamHistory {
    opd_claim_number: string
    sent_date: string
    service: [
        {
            opddate: string
            seq: string
            staff_number_claim: string | null
        }
    ]
}

export interface IpdClamHistory {
    ipd_claim_number: string
    sent_date: string
    service: [
        {
            ipddate: string
            an: string
            staff_number_claim: string | null,
        }
    ]
}