import React  from "react";
import Lottie from 'react-lottie';
import { Row, Col } from 'antd';


type Props = {}

const LoadingMain = function LoadingMain(props: Props) {

    return (
        <Row justify="center" align="middle" style={{ width: '100%', height: '60%' }}>
            <Col span={12}>
                <Lottie width='40%' height='40%'
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: "/fin-health-01.json",
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }} />
            </Col>
        </Row>
    );
}

export default LoadingMain;