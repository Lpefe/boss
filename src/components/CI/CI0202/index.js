import React from 'react';
import './index.scss';
import {Row, Col, Form,} from 'antd';
import {withRouter} from 'react-router-dom'
import {parse} from '../../../utils/commonUtilFunc';
import BossTable from "../../Common/BossTable";

const FormItem = Form.Item;

class CI0202C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkRecord: {},
            ifAddModalShow: false,
            alertInfoShow: false,
        }
    }

    componentDidMount() {
        this.get_link();
    }


    get_link = () => {
        this.props.dispatch({
            type: "ci0202Info/get_link",
            payload: {
                id: parse(this.props.location.search).id,
            }
        });
    };


    render() {
        const modalFormLayout = {
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const columns = [{
            title: '@所在节点',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '@类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '@型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@工作模式',
            dataIndex: 'net_type',
            key: 'net_type',
        }, {
            title: '@序列号',
            dataIndex: 'sn',
            key: 'sn',
        },];

        const pagination = {
            pageSize: 20
        };

        const link_info = this.props.ci0202Info.link_info;
        return (
            <div>
                <h3>@链路信息</h3>
                <Row className="link-info-container">
                    <Col span={8}>
                        <Form>
                            <FormItem label={<span className="label">@链路名称</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.name}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@节点名称</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{parse(this.props.location.search).branch}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@等级</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.grade}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@链路类型</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.type}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@边缘节点IP/IP段</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.branch_iptables}</span>
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={8}>
                        <Form>
                            <FormItem label={<span className="label">@链路状态</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.status}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@总部名称</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{parse(this.props.location.search).main}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@计费模式</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.charge_type}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@带宽</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.bandwidth + "M"}</span>
                            </FormItem>
                            <FormItem label={<span className="label">@中心节点IP/IP段</span>} {...modalFormLayout}
                                      style={{margin: 4, padding: 4}}>
                                <span className="item-value">{link_info.main_iptables}</span>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <h3>@设备列表</h3>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0202Info.dataSource}/>
            </div>
        )
    }
}

export default withRouter(CI0202C);