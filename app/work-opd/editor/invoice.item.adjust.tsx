"use client";
;
//#region Import
import * as React from 'react';
import { Divider, Form, InputNumber, Space } from 'antd'
//#endregion

type InvoiceAdjustProps = {
}

const InvoiceAdjustPage = function InvoiceAdjust({ }: InvoiceAdjustProps) {

    return (
        <Space style={{ width: '100%' }} direction="horizontal" size="large" align="center" >
            <Form.Item label="ขอเบิก" name="TotalRequest" style={{ marginTop: '20px' }} >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Divider type="vertical" orientation="center" style={{ height: '20px' }} />
            <Form.Item label="เบิกไม่ได้" name="TotalOver" style={{ marginTop: '20px' }} >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
        </Space>
    );
}

export default InvoiceAdjustPage;
