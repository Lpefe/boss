/*@客户-首页*/
import React from 'react';

import {Select,} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import {connect} from 'dva';
import {Link} from 'react-router-dom';
import BossTable from "../../../Common/BossTable";
import {injectIntl} from 'react-intl';
import {statusMap} from "../../../../utils/commonUtilFunc";
const Option = Select.Option;

class LinkStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "",
            name: "",
            status: "",
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                link_type: this.state.type,
                name: this.state.name,
                status: this.state.status,
            }
        })
    };

    handleSelectType = (value) => {
        this.setState({
            type: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };


    render() {
        const pagination = {
            pageSize: 20
        };

        const columns = [{
            title:"@链路名称",
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi0501/mi0502",
                    search: "?id=" + record.id + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id
                }}>{record.name}</Link>
            }
        }, {
            title: "@状态",
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return statusMap(text)
            }
        }, {
            title: "@节点名称",
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title:"@链路类型",
            dataIndex: 'type',
            key: 'type',
        }, {
            title: "@带宽"+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, ];
        const option = [
            <Option value="ONLINE" key="ONLINE">{"@在线"}</Option>,
            <Option value="INIT" key="INIT">{"@未激活"}</Option>,
            <Option value="OFFLINE" key="OFFLINE">{"@离线"}</Option>
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">{"@国内组网"}</Option>,
            <Option value="全球组网" key="全球组网">{"@全球组网"}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{"@国内SaaS加速"}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{"@全球SaaS加速"}</Option>
        ];

        return (
            <div>
                <HeaderBar hasAdd={false} hasDelete={false} hasUpload={false} hasSearch={true} hasSelectTwo={true}
                           hasSelect={true} selectPlaceHolder={"@请选择状态"}
                           selectTwoPlaceHolder={"@请选择类型"} options={option} optionsTwo={optionTwo}
                           selectTwoMethod={this.handleSelectType} selectOneMethod={this.handleSelectStatus}
                           submit={this.handleSubmit}/>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0201Info.dataSource}/>
            </div>
        )
    }
}


function mapDispatchToProps({ci0201Info}) {
    return {ci0201Info};
}

export default connect(mapDispatchToProps)(injectIntl(LinkStat));