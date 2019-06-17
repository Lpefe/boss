/*@商务-商务首页*/
import React from 'react';
import {Form,Col,Row, Card} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
import './subStyle.scss';
class BaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            id: this.props.id
        };

    }
    render() {
        let companyInfo = this.props.bi0001Info.companyInfo;
        return (
            <div>           
                <Row className="Container" gutter={16}>
                    <Card>
                        <Col className="statSect" span={3}>
                            <Row className="Container" gutter={16}>
                                <span className="FormItemLabel info0001right">{'@企业名称'}：</span>
                            </Row>
                            <Row className="Container" gutter={16}>
                                <span className="FormItemLabel info0001right">{'@简称'}：</span>
                            </Row>
                        </Col>
                        <Col className="statSect" span={5}>
                            <Row className="Container" gutter={16}>
                                <span className="info0001left">{companyInfo.company}</span>
                            </Row>
                            <Row className="Container" gutter={16}>
                                <span className="info0001left">{companyInfo.company_abbr}</span>
                            </Row>
                        </Col>
                        <Col className="statSect" span={3}>
                            <Row className="Container" gutter={16}>
                                <span className="FormItemLabel info0001right">{'@客户状态'}：</span>
                            </Row>
                            <Row className="Container" gutter={16}>
                            <span className="FormItemLabel info0001right">{'@企业管理员账号'}：</span>
                                
                            </Row>
                        </Col>
                        <Col className="statSect" span={5}>
                            <Row className="Container" gutter={16}>
                            <span className="info0001left">{companyInfo.status}</span>
                                
                            </Row>
                            <Row className="Container" gutter={16}>
                            <span className="info0001left">{companyInfo.company_admin}</span>
                                
                            </Row>
                        </Col>
                        <Col className="statSect" span={3}>
                            <Row className="Container" gutter={16}>
                            <span className="FormItemLabel info0001right">{'@技术支持'}：</span>
                            </Row>
                            <Row className="Container" gutter={16}>
                            <span className="FormItemLabel info0001right">{'@商务'}：</span>
                            </Row>
                        </Col>
                        <Col className="statSect" span={5}>
                            <Row className="Container" gutter={16}>
                            <span className="info0001left">{companyInfo.techsupport}</span>
                            </Row>
                            <Row className="Container" gutter={16}>
                            <span className="info0001left">{companyInfo.business}</span>
                            </Row>
                        </Col>
                        
                            <Col className="statSect" span={3}><span className="FormItemLabel info0001right">@备注：</span></Col>
                            <Col className="statSect" span={21}> <span className="info0001left">{companyInfo.remark}</span></Col>
                        
                    </Card>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps({bi0001Info}) {
    return {bi0001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(BaseInfo)));