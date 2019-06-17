/*@运维-链路信息*/
import React from 'react';
import './index.scss';
import {Tabs, Card} from 'antd';
import {withRouter, Prompt} from 'react-router-dom'
import {parse} from '../../../utils/commonUtilFunc';
import LinkBaseInfo from './subComponents/Tab-BaseInfo/LinkBaseInfo'
import SysInfo from "../MI0102/subComponents/Tab-SystemInfo/SysInfo";
import TabWanInfo from "../MI0102/subComponents/Tab-WanInfo/TabWanInfo";
import TunnelInfo from "../MI0102/subComponents/Tab-TunnelInfo/TunnelInfo";
import {injectIntl} from "react-intl";
import VersionInfo from "../MI0102/subComponents/Tab-VersionInfo/VersionInfo";
import PathInfo from "./subComponents/Tab-PathInfo/PathInfo";
const TabPane = Tabs.TabPane;

class MI0502C extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            checkRecord: {},
            ifAddModalShow: false,
            alertInfoShow: false,
            defaultActiveKey:search.from === "load"||search.ifAlarm === "true" ? "4" : "2"
        }
    }

    componentDidMount() {
        this.get_wan_info();
        this.get_device_info();
    }


    get_device_info = () => {
        this.props.dispatch({
            type: "mi0102Info/get_device_list",
            payload: {
                id: parse(this.props.location.search).device_id
            }
        })
    };

    get_wan_info() {
        this.props.dispatch({
            type: "mi0102Info/get_wan_info",
            payload: {
                sn: parse(this.props.location.search).sn
            }
        })
    }

    beforeRouterLeave = () => {
        sessionStorage.setItem("fromLink", "true");
        setTimeout(function () {
            sessionStorage.setItem("fromLink", "false");
        }, 120)
    };

    render() {
        const link_name = parse(this.props.location.search).name;
        const time = parse(this.props.location.search).time;
        const percent = parse(this.props.location.search).percent;
        const search=parse(this.props.location.search);
        const role=sessionStorage.getItem("role");
        const ifShowVersionInfo=role==="supercxptechnology"||role==="supercxptechsupport"||role==="supercxptechadmin";
        return (<Card className="card">
            {parse(this.props.location.search).from === "load" ? <div>
                <div className="link-info-link-name">{link_name}</div>
                <div className="link-info-load">{"@发生时间"}:{time}&nbsp;&nbsp;&nbsp;&nbsp;{"@峰值负载率"}:{percent}%</div>
            </div> : ""}
            {search.ifAlarm === "true" ? <div>
                <div className="link-info-link-name">{search.name}</div>
                <div className="link-info-load">
                    <span>@发生时间:{search.time}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>@消息类型:{search.alarm_level}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>@详细描述:{search.remark}</span>
                </div>
            </div> : ""}
            <Tabs defaultActiveKey={this.state.defaultActiveKey}>
                <TabPane tab={"@系统信息"} key="2">
                    <SysInfo sn={search.sn}
                             company_id={search.company_id}/>
                </TabPane>
                <TabPane tab={"@WAN口"} key="3">
                    <TabWanInfo/>
                </TabPane>
                <TabPane tab={"@隧道信息"} key="4">
                    <TunnelInfo/>
                </TabPane>
                {ifShowVersionInfo?<TabPane tab="@路径信息" key="6">
                    <PathInfo/>
                </TabPane>:""}
                <TabPane tab={"@基本信息"} key="1">
                    <LinkBaseInfo/>
                </TabPane>
                {ifShowVersionInfo?<TabPane tab={"@版本信息"} key="5">
                    <VersionInfo/>
                </TabPane>:""}
            </Tabs>
            <Prompt message={this.beforeRouterLeave}/>
        </Card>)
    }
}

export default withRouter(injectIntl(MI0502C));