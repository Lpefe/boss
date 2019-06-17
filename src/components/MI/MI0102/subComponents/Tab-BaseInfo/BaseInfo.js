/*@运维-设备信息*/
import React from 'react';
import BossTable from "../../../../Common/BossTable";
import TunnelList from "./TunnelList";
import {Radio, Form, Card} from 'antd';
import {connect} from 'dva';
import moment from "moment";
import {injectIntl} from "react-intl";
import {commonTranslate, deviceTypeMap,} from "../../../../../utils/commonUtilFunc";
import mapMessages from "../../../../../locales/mapMessages";
const RadioGrp = Radio.Group;

class BaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    handleSelectLink = (e) => {
        this.props.dispatch({
            type: "mi0102Info/handleSelectLink",
            payload: {
                link_id: e.target.value
            }
        })
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
            render: (text) => {
                switch (text) {
                    case "INIT":
                        return <span>@未激活</span>
                    case "ONLINE":
                        return <span>@在线</span>
                    case "OFFLINE":
                        return <span>@离线</span>
                    default:
                        return text;
                }
            }
        }, {
            title: '@部署方式',
            dataIndex: 'mode',
            key: 'mode',
        }, {
            title: "@上次启动时间",
            dataIndex: 'run_time',
            key: 'run_time',
        }, {
            title: '@硬件ID',
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
        }, {
            title: '@服务等级',
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? "@云VPN" : (record.grade === "CLOUD_SPLINE" ? "@云专线" : "@超级云专线")
            }
        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type2',
        }, {
            title: '@计费模式',
            dataIndex: 'charge_type',
            key: 'charge_type',
        }, {
            title: "@带宽"+'(M)',
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
        },];

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
                {this.props.type === "STEP" ?
                    <RadioGrp value={this.props.mi0102Info.selectedLinkId} onChange={this.handleSelectLink}>
                        {this.props.mi0102Info.linkList.map((item) => {
                            return <Radio key={item.id} value={item.id}>{item.name}</Radio>
                        })}
                    </RadioGrp> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 ?
                    <h3 style={{marginTop: 16}}>{"@链路信息"}</h3> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 ?
                    <Card className="card"><BossTable bordered={false} pagination={false} columns={linkInfoColumn}
                                                      dataSource={this.props.mi0102Info.linkInfo}/></Card> : ""}
                <h3 style={{marginTop: 16}}>{"@节点信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={nodeInfoColumns}
                               dataSource={this.props.type === "STEP" ? (this.props.mi0102Info.agencyinfo.length === 0 ? [this.props.mi0102Info.deviceInfo] : this.props.mi0102Info.agencyinfo) : [this.props.mi0102Info.deviceInfo]}/></Card>
                <h3 style={{marginTop: 16}}>{"@设备信息"}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={deviceInfoColumns}
                               dataSource={this.props.type ==="STEP" ? (this.props.mi0102Info.deviceList.length > 0 ? this.props.mi0102Info.deviceList : [this.props.mi0102Info.deviceInfo]) : [this.props.mi0102Info.deviceInfo]}/>
                </Card>
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 &&(sessionStorage.getItem('role')!=="company"&&sessionStorage.getItem('role')!=="companystaff")?
                    <h3 style={{marginTop: 16}}>{"@路径信息"}</h3> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0&&(sessionStorage.getItem('role')!=="company"&&sessionStorage.getItem('role')!=="companystaff") ? <Card className="card">
                    <div style={{width: 700}}>
                        <TunnelList tunnelData={this.props.mi0102Info.link_path}/>
                    </div>
                </Card> : ""}
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(injectIntl(BaseInfo)));