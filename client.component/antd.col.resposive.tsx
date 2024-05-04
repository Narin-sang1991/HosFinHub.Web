import { Col } from 'antd';


export const getColResponsive = <T extends { key: string, children: any, span?: number }>(propCol: T) => {
    let lgPercent = propCol.span != undefined ? 33.33 * propCol.span : 33.33;
    let smPercent = propCol.span != undefined ? 50 * propCol.span : 50;
    return <Col key={propCol.key}
        xs={{ flex: '100%' }}
        sm={{ flex: `${smPercent}%` }}
        lg={{ flex: `${lgPercent}%` }}
    >{propCol.children} </Col>
}
