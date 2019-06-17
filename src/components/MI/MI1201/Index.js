/*@运维-流量分析*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {Card, Icon, Select} from 'antd';
import {Link} from 'react-router-dom';
import BossTable from "../../Common/BossTable";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class MI1201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            status: ""
        }
    }

    componentDidMount() {
        this.getCompanyList();
    }

    getCompanyList() {
        this.props.dispatch({
            type: "bi0101Info/getCompanyList",
            payload: {
                company: this.state.company,
                status: this.state.status,
            }
        })
    }

    search = (value) => {
        this.setState({
            company: value || ""
        }, () => {
            this.getCompanyList();
        })
    };

    handleSelectCompanyStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.getCompanyList();
        })
    };


    render() {
        let columns = [{
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                switch(text){
                    case '正式':
                        return '@正式';
                    case '试用':
                        return '@试用';
                    case '停用':
                        return '@停用';
                    default:
                        return "";
                }
            }
        }, {
            title: '@DPI流量分析',
            dataIndex: 'deviceflow',
            key: 'deviceflow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0303", search: "?id=" + record.id}}><Icon
                    type="bar-chart" style={{color: "#1890ff"}}/></Link>
            }
        },
         {
            title: '@设备流量分析',
            dataIndex: 'flow',
            key: 'flow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0302", search: "?id=" + record.id}}><Icon
                    style={{color: "#1890ff"}} type="dot-chart"/></Link>
            }
        }, {
            title: '@日流量统计',
            dataIndex: 'dayflow',
            key: 'dayflow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0401", search: "?id=" + record.id}}><Icon
                    style={{color: "#1890ff"}} type="area-chart"/></Link>
            }
        }, {
            title: '@流量压缩分析',
            dataIndex: 'compress',
            key: 'compress',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi1201/mi1202",
                    search: "?id=" + record.id + "&company_abbr=" + record.company_abbr + "&status=" + record.status
                }}><Icon
                    style={{color: "#1890ff"}} type="bar-chart"/></Link>
            }
        }, {
            title: '@流量去重分析',
            dataIndex: 'depress',
            key: 'depress',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi1201/mi1203",
                    search: "?id=" + record.id + "&company_abbr=" + record.company_abbr + "&status=" + record.status
                }}><Icon
                    style={{color: "#1890ff"}} type="bar-chart"/></Link>
            }
        },];
        const options = [
            <Option key="正式" value="正式">{"@正式"}</Option>,
            <Option key="试用" value="试用">{"@试用"}</Option>,
            <Option key="停用" value="停用">{"@停用"}</Option>,
        ];
        return (
            <Card className="card">
                <HeaderBar options={options} hasDelete={false} hasSearch={true} hasSelect={true}
                           selectPlaceHolder={"@请选择客户状态"}
                           inputPlaceHolder={"@请输入企业名称"} submit={this.search}
                           selectOneMethod={this.handleSelectCompanyStatus}/>
                <BossTable columns={columns} dataSource={this.props.bi0101Info.companyList}/>
            </Card>
        )
    }
}

export default injectIntl(MI1201);