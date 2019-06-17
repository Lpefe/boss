/*@商务-账单管理*/

import React from 'react';
import './index.scss';
import {Select, DatePicker, Button,Modal} from 'antd';
import BossTable from "../../Common/BossTable";
import {Link, withRouter,Prompt} from 'react-router-dom';
import moment from 'moment';
import {parse} from '../../../utils/commonUtilFunc';
import {injectIntl} from "react-intl";

const {MonthPicker} = DatePicker;
const Option = Select.Option;

class BI0702 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            billStartTime: moment().startOf('month').format("YYYY-MM-DD"),
            billEndTime: moment().endOf('month').format("YYYY-MM-DD"),
            billName: moment().startOf('month').format("YYYYMMDD") + "-" + moment().endOf('month').format("YYYYMMDD"),
            company_id: ""
        }
    }

    componentDidMount() {
        let vm = this;
        this.get_company_list();
        let queryData = parse(this.props.location.search);
        if (queryData.edit === "true") {
            this.setState({
                billStartTime: moment(queryData.start_time).startOf('month').format("YYYY-MM-DD"),
                billEndTime: moment(queryData.start_time).endOf('month').format("YYYY-MM-DD"),
                billName: moment(queryData.start_time).startOf('month').format("YYYYMMDD") + "-" + moment(queryData.start_time).endOf('month').format("YYYYMMDD"),
            }, function () {
                vm.get_bill_links();
            })
        }else{
            if(queryData.company_id){
                this.setState({
                    company_id:queryData.company_id,
                    billStartTime: moment(queryData.start_time).startOf('month').format("YYYY-MM-DD"),
                    billEndTime: moment(queryData.start_time).endOf('month').format("YYYY-MM-DD"),
                    billName: moment(queryData.start_time).startOf('month').format("YYYYMMDD") + "-" + moment(queryData.start_time).endOf('month').format("YYYYMMDD"),
                }, function () {
                    if(sessionStorage.getItem("fromLink")!=="true"){
                        this.props.dispatch({
                            type: "bi0702Info/get_link_list",
                            payload: {
                                company_id: this.state.company_id
                            }
                        })
                    }
                })
            }
        }
        if(queryData.edit==="true"||queryData.company_id===undefined){
            this.props.dispatch({
                type: "bi0702Info/resetLink",
                payload: {}
            })
        }

    }

    get_bill_links = () => {
        this.props.dispatch({
            type: "bi0702Info/get_bill_links",
            payload: {
                bill_id: parse(this.props.location.search).bill_id
            }
        })
    };


    get_company_list = () => {
        this.props.dispatch({
            type: "bi0702Info/get_company_list",
            payload: {}
        })
    };

    handleCancel = () => {
        this.props.history.push("/main/bi0701")
    };

    handleSelectCompany = (value) => {
        this.props.history.replace("/main/bi0701/bi0702/?company_id=" + value + "&start_time=" + this.state.billStartTime + "&end_time=" + this.state.billEndTime)
        //在修改企业时,往url里面push所需参数,保证在跳转到链路详情之后回退时还能获取到当前选中的公司和账期
        this.setState({
            company_id: value
        }, function () {
            this.props.dispatch({
                type: "bi0702Info/get_link_list",
                payload: {
                    company_id: this.state.company_id
                }
            })
        });
    };

    handleBillCycleChange = (value) => {
        let queryData = parse(this.props.location.search);
        if (queryData.edit !== "true") {
            this.props.history.replace("/main/bi0701/bi0702/?company_id=" + this.state.company_id + "&start_time=" + moment(value).startOf('month').format("YYYY-MM-DD") + "&end_time=" + moment(value).endOf('month').format("YYYY-MM-DD"))
        }
        this.setState({
            billStartTime: moment(value).startOf('month').format("YYYY-MM-DD"),
            billEndTime: moment(value).endOf('month').format("YYYY-MM-DD"),
            billName: moment(value).startOf('month').format("YYYYMMDD") + "-" + moment(value).endOf('month').format("YYYYMMDD")
        })
    };

    handleChangeChargeType = (record) => {
        this.props.dispatch({
            type: "bi0702Info/update_charge_type",
            payload: {
                id: record.id
            }
        });
    };

    create_bill = () => {
        if(this.state.company_id){
            this.props.dispatch({
                type: "bi0702Info/create_bill",
                payload: {
                    update: {
                        company_id: this.state.company_id,
                        start_time: this.state.billStartTime,
                        end_time: this.state.billEndTime,
                        name: this.state.billName,
                    },
                    vm: this,

                }
            })
        }else{
            Modal.warning({title:"@请选择企业"})
        }

    };

    update_bill = () => {
        this.props.dispatch({
            type: "bi0702Info/update_bill",
            payload: {
                update: {
                    company_id: parse(this.props.location.search).company_id,
                    start_time: this.state.billStartTime,
                    end_time: this.state.billEndTime,
                    name: this.state.billName,
                    id: parse(this.props.location.search).bill_id,
                    record:{total_charge:parse(this.props.location.search).total_charge,total_no_charge:parse(this.props.location.search).total_no_charge,}
                },
                vm: this,
            }
        })
    };

    routerBeforeLeave=()=>{
        sessionStorage.setItem("fromLink","false")
    };

    render() {
        const isEdit = parse(this.props.location.search).edit;
        const queryData = parse(this.props.location.search);
        const columnsOne = [{
            title: '@服务等级',
            dataIndex: 'title',
            key: 'title',
            className:"green",
            render: (index, record) => {
                switch (record.title) {
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
            className:"orange",
            children: [{
                title: '@国内组网',
                dataIndex: '国内组网1',
                key: '国内组网1',
                align:"center",
            }, {
                title: '@国内SaaS加速',
                dataIndex: '国内SaaS加速1',
                key: '国内SaaS加速1',
                align:"center",
            }, {
                title: '@全球组网',
                dataIndex: '全球组网1',
                key: '全球组网1',
                align:"center",
            }, {
                title: '@全球SaaS加速',
                dataIndex: '全球SaaS加速1',
                key: '全球SaaS加速1',
                align:"center",
            }, {
                title: '@链路数量',
                dataIndex: 'total1',
                key: 'total1',
                align:"center",
            },]
        }, {
            title: '@不计费链路',
            className:"blue",
            children: [{
                title: '@国内组网',
                dataIndex: '国内组网0',
                key: '国内组网0',
                align:"center",
            }, {
                title: '@国内SaaS加速',
                dataIndex: '国内SaaS加速0',
                key: '国内SaaS加速0',
                align:"center",
            }, {
                title: '@全球组网',
                dataIndex: '全球组网0',
                key: '全球组网0',
                align:"center",
            }, {
                title: '@全球SaaS加速',
                dataIndex: '全球SaaS加速0',
                key: '全球SaaS加速0',
                align:"center",
            }, {
                title: '@链路数量',
                dataIndex: 'total0',
                key: 'total0',
                align:"center",
            },]
        },];

        const columnsTwo = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                if (isEdit) {
                    return record.name
                } else {
                    return <Link to={{
                        pathname: "/main/bi0701/bi0704",
                        search: "?id=" + record.id + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id
                    }}>{record.name}</Link>
                }

            }
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
                switch (record.grade) {
                    case "CLOUD_VPN":
                        return "@云VPN";
                    case "CLOUD_SPLINE":
                        return "@云专线";
                    case "SUPER_CLOUD_SPLINE":
                        return "@超级云专线";
                    default:
                        return ""
                }
            }
        }, {
            title: '@链路类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@计费类型',
            dataIndex: 'bill_type',
            key: 'bill_type',
            render: (index, record) => {
                return <span>{record.bill_type === "increment" ? "@增量链路" : "@存量链路"}</span>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:75,
            fixed:'right',
            render: (index, record) => {
                return <span className="bill-operation"
                             onClick={() => this.handleChangeChargeType(record)}>{record.is_charge ? "@计费" : "@不计费"}</span>
            }
        },];


        return <div>
            <section style={{position: "relative"}}>
                <Select style={{width: 200, marginRight: 8}} placeholder={"@请选择企业"} onChange={this.handleSelectCompany}
                        defaultValue={parseInt(queryData.company_id,10) ? parseInt(queryData.company_id,10) : undefined}
                        disabled={isEdit === "true"}>
                    {this.props.bi0702Info.companyList.map((item) => {
                        return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
                    })}
                </Select>
                {"@请选择账期"}: <MonthPicker style={{marginRight: 8}} allowClear={false}
                                    defaultValue={isEdit ? moment(queryData.start_time) : (queryData.start_time?moment(queryData.start_time):moment())}
                                    onChange={this.handleBillCycleChange}/>
                {"@账单名称"}:{this.state.billName}
                <Button style={{position: "absolute", right: 96}} onClick={this.handleCancel}>{"@取消"}</Button>
                <Button type="primary" style={{position: "absolute", right: 0}}
                        onClick={queryData.edit === "true" ? this.update_bill : this.create_bill}>{"@保存账单"}</Button>
            </section>
            <section style={{marginTop: 16}}>
                <h3>{"@本期数据汇总"}</h3>
                <BossTable columns={columnsOne} dataSource={this.props.bi0702Info.billLinkStat} rowKey={record=>record.id} rowClassName="not"/>
            </section>
            <section style={{marginTop: 16}}>
                <h3>{"@链路清单"}</h3>
                <BossTable columns={columnsTwo} dataSource={this.props.bi0702Info.linkList}
                           rowKey={record => record.title}/>
            </section>
            <Prompt message={this.routerBeforeLeave}/>
        </div>
    }
}

export default withRouter(injectIntl(BI0702));