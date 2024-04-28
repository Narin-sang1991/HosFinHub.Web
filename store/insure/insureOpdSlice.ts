import { createAppSlice } from "@/store/createAppSlice";
import { OptionUuc } from "./insureModel";

export interface InsureSelectOption {
    uucOptions: OptionUuc[]
}

const initialState: InsureSelectOption = {
    uucOptions: [{ label: 'ใช้สิทธิขอเบิก', value: '1' }, { label: 'ไม่ใช้สิทธิขอเบิก', value: '2' }]
}

export const insureSelectOptionSlice = createAppSlice({
    name: "insureSelectOptions",
    initialState,
    reducers: (create) => (
        {
            getUucAsync: create.asyncThunk(async (body: any) => body,
                {
                    fulfilled: () => { }
                })
        }),

    selectors: {
        selectUccOption: (uuc) => uuc.uucOptions
    }
})

export const { selectUccOption } = insureSelectOptionSlice.selectors