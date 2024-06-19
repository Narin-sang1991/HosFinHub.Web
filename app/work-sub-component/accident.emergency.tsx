"use client";

//#region Import
import React, { useState, useEffect } from "react"
import { AccidentEmergencyModel } from '@/store/refer/accidentEmergencyModel'

import AccidentEmergencyEditor from "./accident.emergency.editor";
import { Divider, Space } from "antd";
//#endregion

interface AccidentEmergencyProps {
    accidenEmergencyItems?: AccidentEmergencyModel[],
    onChange?: any,
}

const AccidentEmergencyTab = function AccidentEmergency({ accidenEmergencyItems, onChange }: AccidentEmergencyProps) {

    const [referIn, setReferIn] = useState<AccidentEmergencyModel>();
    const [referOut, setReferOut] = useState<AccidentEmergencyModel>();

    useEffect(() => {
        let aerIn: AccidentEmergencyModel | undefined = (accidenEmergencyItems || []).find(t => t.refmaini != '' && t.refmaino == '');
        setReferIn(aerIn);

        let aerOut: AccidentEmergencyModel | undefined = (accidenEmergencyItems || []).find(t => t.refmaini == '' && t.refmaino != '');
        setReferOut(aerOut);
    }, [accidenEmergencyItems]);

    //#region Local Filter & Function
    function triggerChange(changedData: AccidentEmergencyModel, claimReferData: boolean): void {
        if (accidenEmergencyItems == undefined) return;
        let tmpItems = [...accidenEmergencyItems];
        const index = tmpItems.findIndex(t => t.id == changedData.id);
        if (claimReferData) {
            if (index < 0) tmpItems.push({ ...changedData });
            else tmpItems.splice(index, 1, { ...changedData });
        } else {
            if (index < 0) return;
            tmpItems.splice(index, 1);
        }

        if (onChange) onChange({ accidenEmergencyItems: tmpItems });
    }
    //#endregion

    return (
        <React.Fragment>
            <Space direction="vertical" size="small" >
                <Divider orientation="left" plain style={{ margin: 0 }}><h4>รับเข้า</h4></Divider>
                <AccidentEmergencyEditor key='refer-in'
                    accidentEmergency={referIn} isReferIn={true}
                    onChange={triggerChange}
                />
                <Divider orientation="left" plain style={{ margin: 0 }}><h4>ส่งต่อ</h4></Divider>
                <AccidentEmergencyEditor key='refer-out'
                    accidentEmergency={referOut} isReferIn={false}
                    onChange={triggerChange}
                />
            </Space>
        </React.Fragment >
    )
}

export default AccidentEmergencyTab