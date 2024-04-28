import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Select } from "antd";
import { searchFeeAsync, searchFeeStatus, searchFeeResult } from "@/store/fee-additional/feeAdditionalSlice";
import { FeeScheduleSelectorModel } from "@/store/fee-additional/feeScheduleModel";

const { Option } = Select;

type FreeScheduleSelectorProps = {
    propKey: string,
    showCode?: boolean,
    showPrice?: boolean,
    value?: FeeScheduleSelectorModel,
    onChange?: any,
}

export function FeeScheduleSelector({ propKey, showCode, showPrice, value, onChange }: FreeScheduleSelectorProps) {

    const dispatch = useAppDispatch();
    const status = useAppSelector(searchFeeStatus);
    const searchResult = useAppSelector(searchFeeResult);

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
        if (initInfo?.item_code === undefined || initInfo?.item_code === "") return;

        if (initInfo.item_code !== selectedValue) {
            console.log(initInfo.item_code, '<=>', selectedValue);
            setSelectedValue(initInfo.item_code);
        }
    }, [value]);

    useEffect(() => {
        if (firstLoad.current === true) {
            firstLoad.current = false;
            return;
        }
        if (searchText.length === 0 || searchText.length >= 3)
            onSearchSchedule(searchText);
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
            let index = searchResult.findIndex(t => t.item_code == selectedValue);
            let itemSelected = searchResult[index];
            if (index > -1) {
                let changedObj: FeeScheduleSelectorModel = {
                    item_code: (itemSelected.item_code || selectedValue || ""),
                    item_name: itemSelected.item_name,
                    type : itemSelected.type,
                    price: itemSelected.price,
                    unit: itemSelected.unit,
                };
                onChange?.({ ...changedObj });
            } else onChangeWithNullObj();
        } else onChangeWithNullObj();

    }, [selectedValue]);

    function onChangeWithNullObj() {
        onChange?.({ 
            item_code: selectedValue,
            item_name: "",
            type: "",
            price: 0,
            unit: "",
        });
    }

    //#region Async
    async function onSearchSchedule(text: string) {
        (async () => {
            await dispatch(searchFeeAsync({ adpKeyWord: text }));
        })();
    }
    //#endregion

    return (
        <Select key={propKey}
            showSearch={true} allowClear={true}
            onClear={() => setSearchText("")}
            style={{ width: '100%' }}
            placeholder="ค่าอุปกรณ์นอกรายการ [ค้นหาและเลือก]"
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
                        <Option key={d.id} style={{ minWidth: '300px' }} value={d.item_code} >
                            {(showCode || false) && (showPrice || false)
                                ? `[${d.item_code}] ${d.item_name} (${d.price} บาท : ${d.unit})`
                                : (showCode || false)
                                    ? `[${d.item_code}] ${d.item_name}`
                                    : (showPrice || false)
                                        ? `${d.item_name} (${d.price} บาท : ${d.unit})`
                                        : d.item_name}
                        </Option>
                    ))
                    : <></>
            }
        </Select>
    );
};