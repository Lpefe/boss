/*@技术支持-流量分析*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import { Icon, Select, Card} from 'antd';
import {Link,} from 'react-router-dom';
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";

const Option = Select.Option;

class BI0501 extends React.Component {
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
        let vm=this;
        this.setState({
            company: value || ""
        }, function () {
            vm.getCompanyList();
        })
    };

    handleSelectCompanyStatus = (value) => {
        let vm=this;
        this.setState({
            status: value || ""
        }, function () {
            vm.getCompanyList();
        })
    };


    render() {
        let columns = [{
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company',
            width: 300,
        }, {
            title: '@状态',
            dataIndex: 'status',
            key: 'status',
            render:(text)=>{
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

        },  {
            title: '@DPI流量分析',
            dataIndex: 'deviceFlow',
            key: 'deviceFlow',
            width: 150,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0303", search: "?id=" + record.id}}><Icon
                    type="bar-chart" className="common-link-icon"/></Link>
            }
        },{
            title: '@设备流量分析',
            dataIndex: 'bandTimeFlow',
            key: 'time',
            width: 150,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0302", search: "?id=" + record.id}}><Icon type="dot-chart" className="common-link-icon"/></Link>
            }
        }, {
            title: '@日流量统计',
            dataIndex: 'dayFlow',
            key: 'dayFlow',
            width: 150,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0401", search: "?id=" + record.id}}><Icon type="bar-chart" className="common-link-icon"/></Link>
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
                           submit={this.search}
                           selectOneMethod={this.handleSelectCompanyStatus}/>
                <BossTable columns={columns} dataSource={this.props.bi0101Info.companyList}/>
            </Card>
        )
    }
}

export default injectIntl(BI0501);