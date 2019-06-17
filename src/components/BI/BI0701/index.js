/*@商务-账单管理*/
import React from 'react';
import './index.scss';
import {Icon, Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter, Link} from 'react-router-dom';
import Operations from "../../Common/Operations";
import moment from 'moment';
import {injectIntl} from "react-intl";

class BI0701 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"
    }

    componentDidMount() {
        this.get_bills();
    }

    //跳转至添加账单页面
    handleCreateBill = () => {
        this.props.history.push("/main/bi0701/bi0702")
    };
    //获取账单列表
    get_bills = () => {
        this.props.dispatch({
            type: "bi0701Info/get_bills",
            payload: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "companystaff") ? {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name
            } : {
                name: this.state.name
            }
        })
    };
    //跳转至编辑账单页面
    handleEditBill = (record) => {
        this.props.history.push("/main/bi0701/bi0702?bill_id=" + record.id + "&company_id=" + record.company_id + "&edit=true&start_time=" + record.start_time + "&end_time=" + record.end_time + "&total_charge="+record.total_charge+"&total_no_charge="+record.total_no_charge)
    };

    //删除账单
    handleDeleteBill = (record) => {
        this.props.dispatch({
                type: "bi0701Info/delete_bill",
                payload: {
                    ids: [record.id],
                    records:[record]
                }
            }
        )
    };

    searchBill = (value) => {
        let vm=this;
        this.setState({
            name: value
        }, function () {
            vm.get_bills();
        })
    };


    render() {
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (index, record) => {
                return record.create_time ? moment(record.create_time).format("YYYY-MM-DD HH:mm:ss") : ""
            }
        }, {
            title: '@账期',
            dataIndex: 'type',
            key: 'type',
            render: (index, record) => {
                return moment(record.start_time).format("YYYYMMDD") + "-" + moment(record.end_time).format("YYYYMMDD")
            }
        }, {
            title: this.isBusiness ? '@计费链路数' : '@链路数量',
            dataIndex: 'total_charge',
            key: 'total_charge',
        }, {
            title: '@账单查看',
            dataIndex: 'checkBill',
            key: 'checkBill',
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/bi0701/bi0703",
                    search: "?bill_id=" + record.id + "&company_abbr=" + record.company_abbr + "&bill_cycle=" + moment(record.start_time).format("YYYYMMDD") + "-" + moment(record.end_time).format("YYYYMMDD")+'&name='+record.name
                }}><Icon type="file-text"/></Link>
            }
        },];

        const unChargeColumn = {
            title: '@不计费链路数',
            dataIndex: 'total_no_charge',
            key: 'total_no_charge',
        };
        const companyName = {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        };
        const superCloud = {
            title: '@超级云专线',
            dataIndex: 'super_cloud_spline',
            key: 'super_cloud_spline',
        };
        const cloud = {
            title: '@云专线',
            dataIndex: 'cloud_spline',
            key: 'cloud_spline',
        };
        const vpn = {
            title: '@云VPN',
            dataIndex: 'cloud_vpn',
            key: 'cloud_vpn',
        };
        if (this.isBusiness) {
            columns.splice(4, 0, unChargeColumn);
            columns.splice(2, 0, companyName);
        } else {
            columns.splice(3, 0, vpn);
            columns.splice(3, 0, cloud);
            columns.splice(3, 0, superCloud);


        }

        const operation = {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:'right',
            render: (index, record) => {
                return <Operations hasEdit={record.can_edit} hasDelete={record.can_edit}
                                   edit={() => this.handleEditBill(record)}
                                   delete={() => this.handleDeleteBill(record)}/>
            }

        };
        if (sessionStorage.getItem("role") !== "company"&&sessionStorage.getItem("role") !== "companystaff") {
            columns.push(operation);
        }
        return <Card className="card">
            <HeaderBar hasAdd={sessionStorage.getItem("role") !== "company"&&sessionStorage.getItem("role") !== "companystaff"} hasSearch={true}
                       addAlias={'@新建账单'}

                       add={this.handleCreateBill} submit={this.searchBill}/>
            <BossTable columns={columns} dataSource={this.props.bi0701Info.billList}/>
        </Card>
    }
}

export default withRouter(injectIntl(BI0701));