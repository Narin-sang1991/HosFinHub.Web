import React from "react";
import Lottie from 'react-lottie';
import { Row, Col, Typography } from 'antd';

const { Title } = Typography;
type Props = {}

const LoadingMain = function LoadingMain(props: Props) {

    return (
        <Row justify="space-around" align="middle" style={{ width: '100%', height: '60%' }}>
            <Col span={12}>
                {/* <Lottie width='40%' height='40%'
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: "/fin-health-01.json",
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }} /> */}
                <Title level={3} >Loading</Title>
            </Col>
        </Row>
    );
}

export default LoadingMain;