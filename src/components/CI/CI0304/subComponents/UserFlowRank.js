/*@客户-设备流量*/
import React from 'react';
import {Modal, Select, Input, Button, Tabs} from "antd";
import BossTable from "../../../Common/BossTable";
import {parse} from "../../../../utils/commonUtilFunc";
import {addComma} from "../../../../utils/commonUtilFunc";
import {withRouter} from "react-router-dom";
import UserAppRank from "./UserFlowRankSubs/UserAppRank";
import DayFlowChart from "./AppRankSubs/DayFlowChart";
import {connect} from "dva";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;
const TabPane = Tabs.TabPane;

class UserFlowRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifUserFlowDetailModalShow: false,
            selectedUserIp: "",
            selectedUserFlow: "0",
            top: "5",
            sip: ""
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir = search.tunnel_dir;
        this.tunnel_dir_id = search.tunnel_dir_id;
        this.id = search.id;
        this.ifCompany = (sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")

    }

    componentDidMount() {
        this.get_users_dpi();
    }

    handleCloseUserFlowDetailModal = () => {
        this.setState({
            ifUserFlowDetailModalShow: false,
        })
    };

    handleOpenUserFlowDetailModal = (record) => {
        this.setState({
            ifUserFlowDetailModalShow: true,
            selectedUserIp: record.sip,
            selectedUserFlow: record.flow || 0
        })
    };

    get_users_dpi = () => {
        this.props.dispatch({
            type: "ci0303Info/get_users_dpi",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn: this.sn,
                top: this.state.top,
                sip: this.state.sip,
                companyid: this.ifCompany ? this.id : sessionStorage.getItem("companyId"),
            }
        })
    };

    selectDataNum = (value) => {
        this.setState({
            top: value || ""
        }, () => {
            this.get_users_dpi();
        })
    };

    handleInputChange = (e) => {
        this.setState({
            sip: e.target.value
        }, () => {
            if (this.state.sip === "") {
                this.get_users_dpi();
            }
        })
    };


    render() {
        const columns = [
            {
                title: '@用户IP地址',
                dataIndex: 'sip',
                key: 'ip',
                render: (text, record) => {
                    return <span style={{color: "#1890FF", cursor: "pointer"}}
                                 onClick={() => this.handleOpenUserFlowDetailModal(record)}>{record.sip}</span>
                }
            }, {
                title: '@MAC地址',
                dataIndex: 'mac',
                key: 'cpde4',
            }, {
                title: '@流量(MB)',
                dataIndex: 'flow',
                key: 'flow',
                render: (text) => {
                    return (text / 1024 / 1024).toFixed(4)
                }
            }, {
                title: '@流量占比(%)',
                dataIndex: 'percent',
                key: 'percent',
                render: (text, record) => {
                    return (((record.flow / 1024 / 1024 / this.props.flow) * 100).toFixed(2))
                }

            },];
        const search = parse(this.props.location.search);
        return (
            <div>
                <Select placeholder={"@请选择数据条数"} style={{width: 120, marginRight: 8, marginTop: 16}}
                        className="input"
                        onChange={this.selectDataNum} defaultValue="5">
                    <Option value="5">@5条</Option>
                    <Option value="10">@10条</Option>
                    <Option value="15">@15条</Option>
                    <Option value="20">@20条</Option>
                </Select>
                <Input placeholder={"@请输入关键字"} style={{width: 240, marginRight: 8}} className="input"
                       onChange={this.handleInputChange}/>
                <Button onClick={this.get_users_dpi}>{"@搜索"}</Button>
                <BossTable columns={columns} style={{marginTop: 16}}
                           dataSource={this.props.ci0303Info.userFlowRankTableDataSource}/>
                <Modal title={"@用户流量详情"} footer={null} visible={this.state.ifUserFlowDetailModalShow}
                       width={925}
                       onCancel={this.handleCloseUserFlowDetailModal} destroyOnClose>
                    <header>
                        <div className="title-device-name">{"@用户IP地址"}:{this.state.selectedUserIp}</div>
                        <div className="title-device-info">
                            <span>{"@时间段"}:&nbsp;&nbsp;{search.start_tm}&nbsp;{"@至"}&nbsp;{search.end_tm}</span><span>{"@流量类型"}:&nbsp;&nbsp;{search.tunnel_dir}</span><span>{"@流量大小"}:&nbsp;{addComma((this.state.selectedUserFlow / 1024 / 1024).toFixed(2))}&nbsp;&nbsp;MB</span>
                        </div>
                    </header>
                    <Tabs>
                        <TabPane key="1" tab={"@应用排名"}>
                            <UserAppRank selectedUserIp={this.state.selectedUserIp}/>
                        </TabPane>
                        <TabPane key="2" tab={"@日流量趋势图"}>
                            <DayFlowChart sip={this.state.selectedUserIp}/>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(UserFlowRank)));