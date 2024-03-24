import React from "react";
import { Space, Row, Col, Typography } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;
export type ErrorMainProps = { pageName: string, error: any }

export const ErrorMain = function ErrorCompany({ pageName, error }: ErrorMainProps) {
    console.log(`${pageName} Page Error :`, error);

    return (
        <Row justify="space-around" align="middle" style={{ width: '100%', height: '50%' }}>
            <Col span={12}>
                <Space size={"large"} align="start">
                    <WarningTwoTone style={{ fontSize: '50px' }} twoToneColor="orange" />
                    <Space direction="vertical" align="baseline">
                        <Title level={3}>{`${pageName} Page Error :`}</Title>
                        <Text type="danger">{error ? error.message : ""}</Text>
                    </Space>
                </Space>
            </Col>
        </Row>
    );
}