"use client";

import React from 'react';
import { Form, Row, Input, Select, } from 'antd';
import { getColResponsive } from "@/client.component/antd.col.resposive";

const PatientInfoTab = function PatientInfo() {
    return (
        <Row gutter={[16, 4]} >
            {
                getColResponsive({
                    key: 'CardType',
                    children: <Form.Item label="ประเภทบัตร" name="CardType" >
                        <Select disabled
                            placeholder="ID type"
                            style={{ flex: 1 }}
                            options={[
                                { value: '1', label: 'บัตรประชาชน' },
                                { value: '2', label: 'หนังสือเดินทาง' },
                                { value: '3', label: 'หนังสือต่างด้าว' },
                                { value: '4', label: 'หนังสือ/เอกสารอื่นๆ' },
                                { value: '5', label: 'บัตร ปกส. ต่างด้าว' },
                            ]}
                        />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'PersonID',
                    children: <Form.Item label="เลขบัตรประชาชน" name="PersonID" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'AgeAtOPD',
                    children: <Form.Item label="อายุ" name="AgeAtOPD" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'PrefixName ',
                    children: <Form.Item label="คำนำหน้า" name="PrefixName" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'FirstName',
                    children: <Form.Item label="ชื่อ" name="FirstName" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'LastName',
                    children: <Form.Item label="นามสกุล" name="LastName" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'DateOfBorn',
                    children: <Form.Item label="วัน/เดือน/ปี เกิด" name="DateOfBorn" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'Nation',
                    children: <Form.Item label="สัญชาติ" name="Nation" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'Marriage',
                    children: <Form.Item label="สถานภาพ" name="Marriage" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'PatientSex',
                    children: <Form.Item label="เพศ" name="PatientSex" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
            {
                getColResponsive({
                    key: 'Occupation',
                    children: <Form.Item label="อาชีพ" name="Occupation" >
                        <Input readOnly />
                    </Form.Item>
                })
            }
        </Row>
    );
}

export default PatientInfoTab;