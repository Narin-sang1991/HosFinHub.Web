import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Select } from "antd";
import { searchDrugAsync, searchDrugStatus, searchDrugResult } from "@/store/free-additional/freeAdditionalSlice";
import { FreeDrugModel, FreeDrugSelectorModel } from "@/store/free-additional/freeDrugModel";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

type FreeDrugSelectorProps = {
    showCode?: boolean,
    initInfo?: { value: string, text: string },
    onChange?: any,
    
}

export function FreeDrugSelector({ showCode, initInfo, onChange }: FreeDrugSelectorProps) {

    const dispatch = useAppDispatch();
    const status = useAppSelector(searchDrugStatus);
    const searchResult = useAppSelector(searchDrugResult);

    const [searchText, setSearchText] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const isPoked = useRef(false)
    const firstLoad = useRef(false)

    useEffect(() => {
        firstLoad.current = true;
    }, []);

    useEffect(() => {
        if (initInfo === undefined || initInfo === null) return;

        console.log('initInfo=>', initInfo);

        if (initInfo.value !== selectedValue) {
            let { value, text } = initInfo;
            setSelectedValue(value);
        }
    }, [initInfo]);

    useEffect(() => {
        if (firstLoad.current === true) {
            firstLoad.current = false;
            return;
        }
        if (searchText.length === 0 || searchText.length >= 3)
            onSearchDrug(searchText);
    }, [searchText]);

    useEffect(() => {
        if (isPoked.current === true) {
            isPoked.current = false;
            return;
        }

        if (searchResult.length > 0) {
            let index = searchResult.findIndex(t => t.gpuid == selectedValue);
            let itemSelected = searchResult[index];
            if (index > -1) {
                let changedObj: FreeDrugSelectorModel = {
                    id: itemSelected.id || uuidv4(),
                    code: (itemSelected.gpuid || selectedValue),
                    name: itemSelected.generic_name,
                    unitPrice: itemSelected.price
                };
                onChange?.({ ...changedObj });
            }
        } else {
            onChange?.({
                id: uuidv4(),
                code: selectedValue,
                name: selectedValue,
                unitPrice: '0',
            });
        }
    }, [selectedValue]);

    //#region Async
    async function onSearchDrug(text: string) {
        (async () => {
            await dispatch(searchDrugAsync({ drugKeyWord: text }));
        })();
    }
    //#endregion

    return (
        <Select
            showSearch={true} allowClear={true}
            onClear={() => setSearchText("")}
            style={{ width: '100%' }}
            placeholder="Search to Select"
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
                            {(showCode || false) ? `[${d.gpuid}] ${d.generic_name}` : d.generic_name}
                        </Option>
                    ))
                    : <></>
            }
        </Select>
    );
};