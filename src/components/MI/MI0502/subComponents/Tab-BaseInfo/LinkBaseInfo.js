/*@运维-链路信息*/
import React from 'react';
import './index.scss';
import {Form, Card, Icon} from 'antd';
import {commonTranslate, mainBackupMap, parse} from '../../../../../utils/commonUtilFunc';
import TunnelList from '../TunnelList';
import BossTable from "../../../../Common/BossTable";
import {connect} from 'dva';
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import {injectIntl} from "react-intl";
import {deviceTypeMap} from "../../../../../utils/commonUtilFunc";
import mapMessages from "../../../../../locales/mapMessages";

class LinkBaseInfo extends React.Component {
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
        this.get_link_path();
    }


    get_link = () => {
        this.props.dispatch({
            type: "ci0202Info/get_link",
            payload: {
                id: parse(this.props.location.search).id,
            }
        });
    };

    get_link_path = () => {
        this.props.dispatch({
            type: "ci0202Info/get_link_path",
            payload: {
                link_id: parse(this.props.location.search).id,
            }
        });
    };


    render() {
        const __=commonTranslate(this);
        const deviceInfoColumns = [{
            title: '@设备类型',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: '@型号',
            dataIndex: 'model',
            key: 'model',
        }, {
            title: '@设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@所在节点',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '@部署方式',
            dataIndex: 'mode',
            key: 'mode',
        }, {
            title:"@上次启动时间",
            dataIndex: 'run_time',
            key: 'run_time',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        },];

        const linkInfoColumn = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (index, record) => {
                return record.create_time ? moment(record.create_time).format("YYYY-MM-DD HH:mm:ss") : ""
            }

        }, {
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@链路状态',
            dataIndex: 'status',
            key: 'status',
        },{
            title: '@主/备',
            dataIndex: 'm_b',
            key: 'm_b',
            render:(text)=>{
                return mainBackupMap(text)
            }
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type2',
        }, {
            title: '@计费模式',
            dataIndex: 'charge_type',
            key: 'charge_type',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        },{
            title: '@RTT基准值'+"(ms)",
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        },{
            title: '@协议',
            dataIndex: 'path_proto',
            key: 'path_proto',
            render:(text)=>{
                const protoMap={
                    "1":"TCP",
                    "2":"UDP",
                    "3":"TCP+UDP"
                };
                return protoMap[text]
            }
        },{
            title: '@人工选路',
            dataIndex: 'manual-select',
            key: 'manual-select',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="fork"
                              style={record.assign_type === "auto" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.assign_type === "auto" ? "@未启用" : "@已启用"}
                    </div>

                )
            }
        }, {
            title: '@智能去重',
            dataIndex: 'operation',
            key: 'operation',
            width:150,
            fixed:'right',
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="safety"
                              style={record.deduplication === "OFF" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.deduplication === "OFF" ? "@未启用" : "@已启用"}
                    </div>

                )
            }
        }];

        const nodeInfoColumns = [{
            title: '@节点类型',
            dataIndex: 'type',
            key: 'type',
            render: (index, record) => {
                return record.type === "STEP" ? "@边缘" : "@中心"
            }
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: '@名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@IP/IP段',
            dataIndex: 'iptables',
            key: 'iptables',
        }, {
            title: '@外网IP',
            dataIndex: 'isp',
            key: 'isp',
        }, {
            title: '@所在国家',
            dataIndex: 'level1_name',
            key: 'level1_name',
            render: (text) => {
                return __(mapMessages[text],text)
            }
        }, {
            title: '@所属城市',
            dataIndex: 'level3_name',
            key: 'level3_name',
        }];

        return (
            <div>
                <h3 style={{marginTop: 16}}>{"@链路信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={linkInfoColumn}
                               dataSource={[this.props.ci0202Info.link_info]}/>
                </Card>
                <h3 style={{marginTop: 16}}>{"@节点信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={nodeInfoColumns}
                               dataSource={this.props.ci0202Info.agency_list}/>
                </Card>
                <h3 style={{marginTop: 16}}>{"@设备信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={deviceInfoColumns}
                               dataSource={this.props.ci0202Info.dataSource}/>
                </Card>
                {sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "companystaff" || sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxpbizadmin" ? "" :
                    <Card>
                        <h3 style={{marginTop: 16}}>{"@路径信息"}</h3>
                        <div style={{width: '100%'}}>
                            <TunnelList tunnelData={this.props.ci0202Info.link_path}/>
                        </div>
                    </Card>}
            </div>
        )
    }
}

function mapDispatchToProps({ci0202Info}) {
    return {ci0202Info};
}

const LinkBaseInfoF = Form.create()(withRouter(injectIntl(LinkBaseInfo)));

export default connect(mapDispatchToProps)(LinkBaseInfoF);