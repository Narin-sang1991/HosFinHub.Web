import React, { useEffect, useState, useRef } from "react";
import { Select } from "antd";
import { allAdditTypes } from "@/client.constant/invoice.addit.payment.constant";

const { Option } = Select;

type AdditPaymentTypeSelectorProps = {
    propKey: string,
    showCode?: boolean,
    allowNull?: boolean,
    value?: { id: string, text: string },
    onChange?: any,
}

export function AdditPaymentTypeSelector({ propKey, showCode,allowNull, value, onChange }: AdditPaymentTypeSelectorProps) {

    const [additTypes, setAdditTypes] = useState(allAdditTypes);
    const [isLoading, setLoading] = useState(false);
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
        if (!allowNull &&( initInfo?.id === undefined || initInfo?.id === "")) return;

        if (initInfo.id !== selectedValue) {
            // console.log(initInfo.item_code, '<=>', selectedValue);
            setSelectedValue(initInfo.id);
        }
    }, [value]);

    useEffect(() => {
        if (firstLoad.current === true) {
            firstLoad.current = false;
            return;
        }
        onSearchAdpType(searchText);
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

        if (additTypes.length > 0) {
            let index = additTypes.findIndex(t => t.id == selectedValue);
            let itemSelected = additTypes[index];
            if (index > -1) {
                let changedObj = {
                    id: itemSelected.id,
                    text: itemSelected.text,
                };
                onChange?.({ ...changedObj });
            } else onChangeWithNullObj();
        } else onChangeWithNullObj();

    }, [selectedValue]);

    function onChangeWithNullObj() {
        onChange?.({
            id: selectedValue,
            text: "",
        });
    }

    //#region Async
    async function onSearchAdpType(textSearch: string) {
        setLoading(true);
        (async () => {
            await filterAdpType(textSearch);
            setLoading(false);
        })();
    }
    async function filterAdpType(textSearch: string) {
        const additTypeItems = await [...allAdditTypes.filter(t => t.text.includes(textSearch) || t.text == textSearch)];
        setAdditTypes(additTypeItems);
    }
    //#endregion

    return (
        <Select key={propKey}
            showSearch={true} allowClear={true}
            onClear={() => setSearchText("")}
            style={{ width: '100%' }}
            placeholder="ประเภท [ค้นหาและเลือก]"
            optionFilterProp="children"
            loading={isLoading}
            value={selectedValue}
            onSearch={(eText) => setSearchText(eText)}
            onChange={setSelectedValue}
            filterOption={false}
        >
            {
                additTypes.length > 0
                    ? (additTypes || []).map((d) => (
                        <Option key={d.id} style={{ minWidth: '300px' }} value={d.id} >
                            {(showCode || false) ? `[${d.id}] ${d.text}` : d.text}
                        </Option>
                    ))
                    : <></>
            }
        </Select>
    );
};