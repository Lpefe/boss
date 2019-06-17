/*@商务-账单管理*/
import React from 'react';
import './index.scss';
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import {parse} from '../../../utils/commonUtilFunc';
import {Card,Button} from 'antd';
import {domain} from "../../../utils/commonConsts";
class BI0703 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"
    }

    componentDidMount() {
        this.get_bill_links();
    }

    get_bill_links = () => {
        this.props.dispatch({
            type: "bi0703Info/get_bill_links",
            payload: {
                bill_id: parse(this.props.location.search).bill_id
            }
        })
    };


    handleCancel = () => {
        this.props.history.push("/main/bi0701")
    };

    render() {
        const columnsOne = [{
            title: '@服务等级',
            dataIndex: 'title',
            key: 'title',
            render:(index,record)=>{
                switch(record.title){
                    case "CLOUD_VPN":
                        return "@云VPN";
                    case "CLOUD_SPLINE":
                        return "@云专线";
                    case "SUPER_CLOUD_SPLINE":
                        return "@超级云专线";
                    case "total":
                        return "@合计";
                    default:
                        return ""
                }
            }

        }, {
            title: '@计费链路',
            children: [{
                title: '@国内组网',
                dataIndex: '国内组网1',
                key: '国内组网1',
                align:"center"
            }, {
                title: '@国内SaaS加速',
                dataIndex: '国内SaaS加速1',
                key: '国内SaaS加速1',
                align:"center"
            }, {
                title: '@全球组网',
                dataIndex: '全球组网1',
                key: '全球组网1',
                align:"center"
            }, {
                title: '@全球SaaS加速',
                dataIndex: '全球SaaS加速1',
                key: '全球SaaS加速1',
                align:"center"
            }, {
                title: '@链路数量',
                dataIndex: 'total1',
                key: 'total1',
                align:"center"
            },]
        },];

        const unChargeColumn={
            title: '@不计费链路',
            children: [{
                title: '@国内组网',
                dataIndex: '国内组网0',
                key: '国内组网0',
                align:"center"
            }, {
                title: '@国内SaaS加速',
                dataIndex: '国内SaaS加速0',
                key: '国内SaaS加速0',
                align:"center"
            }, {
                title: '@全球组网',
                dataIndex: '全球组网0',
                key: '全球组网0',
                align:"center"
            }, {
                title: '@全球SaaS加速',
                dataIndex: '全球SaaS加速0',
                key: '全球SaaS加速0',
                align:"center"
            }, {
                title: '@链路数量',
                dataIndex: 'total0',
                key: 'total0',
                align:"center"
            },]
        };
        if(this.isBusiness){
            columnsOne.push(unChargeColumn);
        }

        const columnsTwo = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@启用日期',
            dataIndex: 'start_date',
            key: 'start_date',
        }, {
            title: '@最近结算日',
            dataIndex: 'recent_bill_date',
            key: 'recent_bill_date',
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
            key: 'type',

        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        },];
        const extraColumns=[ {
            title: '@计费类型',
            dataIndex: 'bill_type',
            key: 'bill_type',
            render: (index, record) => {
                return <span>{record.bill_type === "increment" ? "@增量链路" : "@存量链路"}</span>
            }
        }, {
            title: '@是否计费',
            dataIndex: 'operation',
            key: 'operation',
            width:150,
            fixed:'right',
            render: (index, record) => {
                return <span>{record.is_charge ? "@计费" : "@不计费"}</span>
            }
        },];
        if(this.isBusiness){
            columnsTwo.concat(extraColumns);
        }
        const queryInfo = parse(this.props.location.search);
        const search=parse(this.props.location.search)
        return <Card className="card">
            <section style={{position: "relative", textAlign: "center",marginTop:24}}>
                <span className="bill-info-title">{queryInfo.company_abbr + queryInfo.bill_cycle}<span>@账单详情</span></span>
            </section>
            <section style={{marginTop: 16}}>
                <h3>@本期数据汇总</h3>
                <BossTable columns={columnsOne} dataSource={this.props.bi0703Info.billLinkStat}/>
            </section>
            <section style={{marginTop: 16}}>
                <h3>@链路清单 <Button href={domain + "/v1/company/download_bill_link/?bill_id="+search.bill_id+"&bill_name="+search.name}>@导出</Button></h3>
                <BossTable columns={columnsTwo} dataSource={this.props.bi0703Info.linkList}
                           rowKey={record => record.title}/>
            </section>
        </Card>
    }
}

export default withRouter(BI0703);