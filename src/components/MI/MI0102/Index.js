/*@运维-设备信息*/
import React from 'react';
import './index.scss';
import {parse} from '../../../utils/commonUtilFunc'
import {Card, Tabs} from 'antd';
import SysInfo from "./subComponents/Tab-SystemInfo/SysInfo";
import TabWanInfo from "./subComponents/Tab-WanInfo/TabWanInfo";
import TunnelInfo from "./subComponents/Tab-TunnelInfo/TunnelInfo";
import NetworkInfo from "./subComponents/Tab-NetworkInfo/NetworkInfo";
import BaseInfo from "./subComponents/Tab-BaseInfo/BaseInfo";
import {injectIntl} from "react-intl";
import VersionInfo from "./subComponents/Tab-VersionInfo/VersionInfo";
import TunnelInfoHcpe from "./subComponents/Tab-TunnelInfo-HCPE/TunnelInfoHcpe";
import Ap from "./subComponents/Tab-Ap/Ap";


const TabPane = Tabs.TabPane;

class MI0102 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceInfo: {},
        }
    }

    componentDidMount() {
        this.get_device_info();
        this.get_link_list();
    }

    get_device_info = () => {
        this.props.dispatch({
            type: "mi0102Info/get_device_list",
            payload: {
                id: parse(this.props.location.search).id
            }
        })
    };

    get_link_list() {
        this.props.dispatch({
            type: "mi0102Info/get_link_list",
            payload: {
                device_id: parse(this.props.location.search).id
            }
        })
    };


    render() {
        const search = parse(this.props.location.search);
        const role = sessionStorage.getItem("role");
        const ifShowVersionInfo = role === "supercxptechnology" || role === "supercxptechsupport" || role === "supercxptechadmin";//判断是否是技术支持或者运维角色
        return <Card className="card">
            <p className="mi0102deviceName">{"@设备名称"}：<span className="mi0102deviceName">{this.props.mi0102Info.deviceInfo.name}</span></p>
            {search.ifAlarm === "true" ? <div>
                <div className="link-info-link-name">{search.name}</div>
                <div
                    className="link-info-load">{"@发生时间"}:{search.time}&nbsp;&nbsp;&nbsp;&nbsp;{"@消息类型"}:{search.alarm_level}&nbsp;&nbsp;&nbsp;&nbsp;{"@详细描述"}:{search.remark}</div>
            </div> : ""}
            <Tabs defaultActiveKey="2" onChange={this.handleTabChange}>
                <TabPane tab={"@系统信息"} key="2">
                    <SysInfo/>
                </TabPane>
                {search.type === 'AP' ? "" : <TabPane tab={"@WAN口"} key="3">
                    <TabWanInfo/>
                </TabPane>}
                {search.type === 'AP' ? "" : <TabPane tab={"@隧道信息"} key="4">
                    {(search.type === "CSTEP" && search.from === "device" ?
                        <TunnelInfoHcpe/> :
                        <TunnelInfo/>)}
                </TabPane>}
                {search.type === 'AP'||this.props.mi0102Info.deviceInfo.cta_id===0 ||this.props.mi0102Info.deviceInfo.cta_id===undefined ?"" :<TabPane tab={"@网络参数"} key="6">
                <NetworkInfo/>
                    </TabPane>}
                <TabPane tab={search.type === 'AP' ?"@网络参数":"@基本信息"} key="1">
                    {search.type === 'AP' ?<Ap id={this.props.mi0102Info.deviceInfo.id}/>:<BaseInfo type={parse(this.props.location.search).type}/>}
                </TabPane>
                {ifShowVersionInfo && search.type !== 'AP' ? <TabPane tab={"@版本信息"} key="5">
                    <VersionInfo/>
                </TabPane> : ""}
            </Tabs>
        </Card>
    }
}

export default injectIntl(MI0102);