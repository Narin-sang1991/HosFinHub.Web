import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Select } from "antd";
import { searchDrugAsync, searchDrugStatus, searchDrugResult } from "@/store/fee-additional/feeAdditionalSlice";
import { FeeDrugSelectorModel } from "@/store/fee-additional/feeDrugModel";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

type FeeDrugSelectorProps = {
    propKey: string,
    showCode?: boolean,
    showPrice?: boolean,
    value?: FeeDrugSelectorModel,
    onChange?: any,
}

export function FeeDrugSelector({ propKey, showCode, showPrice, value, onChange }: FeeDrugSelectorProps) {

    const dispatch = useAppDispatch();
    const status = useAppSelector(searchDrugStatus);
    const searchResult = useAppSelector(searchDrugResult);

    const [searchText, setSearchText] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>();
    const isPoked = useRef(false)
    const firstLoad = useRef(false)

    useEffect(() => {
        firstLoad.current = true; 
    }, []);

    useEffect(() => {
        let initInfo = { ...value };
        if (initInfo === undefined || initInfo === null) return;
        if (initInfo?.code === undefined || initInfo?.code === "") return;

        if (initInfo.code !== selectedValue) {
            console.log(initInfo.code, '<=>', selectedValue);
            setSelectedValue(initInfo.code);
        }
    }, [value]);

    useEffect(() => {
        if (firstLoad.current === true) {
            firstLoad.current = false;
            return;
        }
        if (searchText.length === 0 || searchText.length >= 3)
            onSearchDrug(searchText);
    }, [searchText]);

    useEffect(() => {
        if (firstLoad.current === true) {
            firstLoad.current = false;
            return;
        }
        if (isPoked.current === true) {
            isPoked.current = false;
            return;
        }
        
        if (searchResult.length > 0) {
            let index = searchResult.findIndex(t => t.gpuid == selectedValue);
            let itemSelected = searchResult[index];
            if (index > -1) {
                let changedObj: FeeDrugSelectorModel = {
                    id: itemSelected.id || uuidv4(),
                    code: (itemSelected.gpuid || selectedValue || ""),
                    name: itemSelected.generic_name,
                    unitPrice: itemSelected.price,
                    strength: itemSelected.strength,
                };
                onChange?.({ ...changedObj });
            } else onChangeWithNullObj();
        } else onChangeWithNullObj();

    }, [selectedValue]);

    function onChangeWithNullObj() {
        onChange?.({
            id: uuidv4(),
            code: selectedValue,
            name: selectedValue,
            unitPrice: '0',
        });
    }

    //#region Async
    async function onSearchDrug(text: string) {
        (async () => {
            await dispatch(searchDrugAsync({ drugKeyWord: text }));
        })();
    }
    //#endregion

    return (
        <Select key={propKey}
            showSearch={true} allowClear={true}
            onClear={() => setSearchText("")}
            style={{ width: '100%' }}
            placeholder="ค่ายานอกรายการ [ค้นหาและเลือก]"
            optionFilterProp="children"
            loading={status === "loading"}
            value={selectedValue}
            onSearch={(eText) => setSearchText(eText)}
            onChange={setSelectedValue}
            filterOption={false}
        >
            {
                searchResult.length > 0
                    ? (searchResult || []).map((d) => (
                        <Option key={d.id} style={{ minWidth: '300px' }} value={d.gpuid} >
                            {(showCode || false) && (showPrice || false)
                                ? `[${d.gpuid}] ${d.generic_name} (${d.price} บาท : ${d.strength})`
                                : (showCode || false)
                                    ? `[${d.gpuid}] ${d.generic_name}`
                                    : (showPrice || false)
                                        ? `${d.generic_name} (${d.price} บาท : ${d.strength})`
                                        : d.generic_name}
                        </Option>
                    ))
                    : <></>
            }
        </Select>
    );
};