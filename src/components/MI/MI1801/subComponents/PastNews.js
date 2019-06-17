/*@运维-告警信息*/
import React from 'react';
import {connect} from 'dva';
import HeaderBar from "../../../Common/HeaderBar";
import {Modal, Form, Select, Card, InputNumber,Pagination} from 'antd';
import BossTable from "../../../Common/BossTable";
import {injectIntl} from "react-intl";
import moment from 'moment';
import {domain} from "../../../../utils/commonConsts";

import {commonTranslate, deviceTypeMap, MomentFormatter, parse} from "../../../../utils/commonUtilFunc";

const FormItem = Form.Item;
const Option = Select.Option;

class PastNews extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.this.props.location.search);

        this.state = {
            selectedIds: [],
            processModalShow: false,
            confirmModalShow: false,
            RestrainModalShow: false,
            editId: "",
            start_time: search.from !== 'dashboard' ? MomentFormatter(moment().startOf('month')) : "",
            end_time: search.from !== 'dashboard' ? MomentFormatter(moment()) : "",
            restrain_start_time: "",
            restrain_end_time: "",
            status: "TODO",
            alarm_level: search.alarm_level || "",
            alarm_type: search.alarm_type || "",
            name: "",
            editRecord: {},
            selectedRecords: [],
            ifIgnoreAll: false,
            ifIgnoreCurrent: false,
            page_size: 50,
            page_no: 1,
            companyId:sessionStorage.getItem('role') === 'company' || sessionStorage.getItem('role') === 'companystaff'?sessionStorage.getItem('companyId'):"",
            reason:""
        }
    }
    componentDidMount() {
        this.get_event_case_events_all()
    }
    handleSelectRange = (moments) => {
        this.setState({
            start_time: moments[0] ? MomentFormatter(moments[0], "YYYY-MM-DD 00:00:00") : "",
            end_time: moments[1] ? MomentFormatter(moments[1], "YYYY-MM-DD 23:59:59") : "",
            page_no: 1
        }, () => {
            this.get_event_case_events_all();
        })
    };
    handelSearchSubmit = (value) => {
        this.setState({
            name: value,
            page_no: 1
        }, () => {
            this.get_event_case_events_all();
        })
    };
    //获取历史消息
    get_event_case_events_all = ()=>{
        let payload = {
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            process_status:"resolved",
            company_ids:"",
            company_id:this.state.companyId,
            name: this.state.name,
            p: this.state.page_no,
            limit: this.state.page_size,
            event_type:this.state.alarm_type,
            reason:this.state.reason
        };

        this.props.dispatch({
            type: "mi1801Info/get_event_case_events_all",
            payload: payload
        })
    }
    handleSelectAlarmType = (value) => {
        this.setState({
            alarm_type: value || "",
            page_no: 1
        }, () => {
            this.get_event_case_events_all();
        })
    };
    handleSelectAlarmStatus = (value) => {
        this.setState({
            companyId: value || "",
            page_no: 1
        }, () => {
            this.get_event_case_events_all();
        })
    };
    handelSelectReason = (value) => {
        this.setState({
            reason: value || "",
            page_no: 1
        }, () => {
            this.get_event_case_events_all();
        })
    };
    //详情
    handleCheckAlarm = (record) => {
        //if (record.status === 'DONE') {
            window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi1801/mi1802?alarm_id=" + record.id)
        //}
    };
    gotoLinkInfo = (record) => {
        var level =""
        switch (record.level) {
            case 1:
                level= "@程序问题"
                break
            case 2:
                level=  "@网络质量"
                break
            case 3:
                level=  "@设备OFF" 
                break                   
            case 4:
                level=  "@基础设施"
                break
            default:
                return record.level;
        }
        if (record.company_id) {
            if (record.event_type === "link") {
                window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0501/mi0502?id=" + record.boss_link_id + "&company_id=" + record.company_id + "&sn=" + record.endpoint + "&device_id=" + record.boss_device_id + "&from=link&bandwidth=" + record.bandwidth + "&ifAlarm=true&name=" + record.link_name + "&time=" + record.timestamp + "&remark=" + record.note + "&alarm_level=" + level)
            } else {
                window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0102?id=" + record.boss_device_id + "&sn=" + record.endpoint + "&type=" + record.type + "&from=device&ifAlarm=true&name=" + record.device_name + "&time=" + record.timestamp + "&remark=" + record.note + "&alarm_level=" + level)
            }
        }
    };
    render() {
        //const search = parse(this.props.location.search);
        const ifCompany = sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff";

        const companyCol = [{
            title: "@日期",
            dataIndex: "timestamp",
            key: "timestamp",
        }, {
            title: "@名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)}
                             className={record.company_id ? "common-link-icon" : ""}>{record.event_type === 'device' ? record.device_name : record.link_name}</span>
            }
        }, {
            title: "@故障状态",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                return text === "OK" ? "@修复" : "@故障"
            }
        }, {
            title: "@对象",
            dataIndex: "event_type",
            key: "event_type",
            render: (text) => {
                return text === "link" ? "@链路" : "@设备"
            }
        }, {
            title: "@故障类型",
            dataIndex: "level",
            key: "level",
            render:(text)=>{
                switch (text) {
                    case 1:
                        return "@程序问题"
                    case 2:
                        return "@网络质量"
                    case 3:
                        return "@设备OFF"                    
                    case 4:
                        return "@基础设施"
                    default:
                        return text;
                }
            }
        }, {
            title: "@事件",
            dataIndex: "note",
            key: "note",
        },];
        const options = [
            <Option value="link" key="link">{"@链路"}</Option>,
            <Option value="device" key="device">{"@设备"}</Option>,
        ];
        
        const optionsThree = [
            <Option value="COREDUMP"  key="COREDUMP">{"@COREDUMP"}</Option>, 
            <Option value="LINK UP/DOWN" key="LINK UP/DOWN">{"@LINK UP/DOWN"}</Option>, 
            <Option value="PPPoe"  key="PPPoe">{"@PPPoe"}</Option>, 
            <Option value="系统重启" key="系统重启">{"@系统重启"}</Option>, 
            <Option value="外网质量差"  key= "外网质量差">{"@外网质量差"}</Option>,
            <Option value="测试" key="测试">{"@测试"}</Option>,
            <Option value="其他" key= "其他">{"@其他"}</Option>
        ]

        const optionsCompany=this.props.mi1801Info.companyList.map((item)=>{
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });

        const rowSelection = {
            selectedRowKeys: this.state.selectedIds,
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        const columns = [{
            title: "@日期",
            dataIndex: "timestamp",
            key: "timestamp",
        }, {
            title: "@名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)}
                             className={record.company_id ? "common-link-icon" : ""}>{record.event_type === 'device' ? record.device_name : record.link_name}</span>
            }
        }, {
            title: "@企业名称",
            dataIndex: "company",
            key: "company",
        }, {
            title: "@故障状态",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                return text === "OK" ? "@修复" : "@故障"
            }
        }, {
            title: "@对象",
            dataIndex: "event_type",
            key: "event_type",
            render: (text) => {
                return text === "link" ? "@链路" : "@设备"
            }
        }, {
            title: "@故障类型",
            dataIndex: "level",
            key: "level",
            render:(text)=>{
                switch (text) {
                    case 1:
                        return "@程序问题"
                    case 2:
                        return "@网络质量"
                    case 3:
                        return "@设备OFF"                    
                    case 4:
                        return "@基础设施"
                    default:
                        return text;
                }
            }
        }, {
            title: "@事件",
            dataIndex: "note",
            key: "note",
        },{
            title: "@原因",
            dataIndex: "reason",
            key: "reason",

        },{
            title: "@备注",
            dataIndex: "remark",
            key: "remark",

        }, {
            title: "@操作详情",
            dataIndex: "operation",
            key: "operation",
            width: 100,
            align: "center",
            fixed:"right",
            render:(index,record)=>{
                return <span onClick={() => this.handleCheckAlarm(record)}
                className={"common-link-icon"}>@查看详情</span>
            
            }
        },];
        const search = parse(this.props.this.props.location.search);
        return(<Card className="card">
                                <HeaderBar hasSearch={true} hasSelect={true} hasRangePicker={true}
                                 selectPlaceHolder={"@请选择对象"}
                                 hasSelectTwo={!ifCompany}
                                 selectTwoPlaceHolder={"@请选择企业"}
                                 optionsTwo={optionsCompany}
                                 selectTwoMethod={this.handleSelectAlarmStatus}
                                 hasSelectThree={!ifCompany}
                                selectThreePlaceHolder={"@请选择原因"}
                                selectThreeMethod={this.handelSelectReason}
                                optionsThree={optionsThree}
                                //selectOneDefaultValue={search.alarm_type}
                                //selectThreeDefaultValue={search.alarm_level}
                                extraBtnNameThree={"@批量忽略"}
                                dateRange={search.from !== 'dashboard' ? [moment().startOf('month'), moment()] : []}
                                options={options}
                                rangePickerMethod={this.handleSelectRange}
                                selectOneMethod={this.handleSelectAlarmType} 
                                submit={this.handelSearchSubmit}
                                selectedKeys={this.state.selectedRecords} selectOneWidth={120} 
                                selectThreeWidth={120}
                                hasDownload={true} downloadBtnNm={"@导出"}
                                downloadUrl={domain + "/v1/company/get_history_event_case/?to_export=1&start_time=" + this.state.start_time + "&end_time=" + this.state.end_time + "&process_status=resolved&company_ids=''&company_id=" + this.state.companyId + "&name=" + this.state.name+"&p="+this.state.page_no+"&limit="+this.state.page_size+"&event_type="+this.state.alarm_type+"&reason="+this.state.reason}
                                />
            <BossTable component={this}
                        columns={ifCompany? companyCol : columns}
                        pagination={false}  dataSource={this.props.mi1801Info.pastAlarmList}rowSelection={null}/>
            <Pagination style={{marginTop:10,float:"right"}} pageSizeOptions={["20","50","100"]} size="small" total={this.props.mi1801Info.pastTotal} defaultPageSize={50} showSizeChanger showQuickJumper 
                        onChange={(page, pageSize)=>{this.setState({page_no:page},()=>{this.get_event_case_events_all()})}}
                        onShowSizeChange={(current, size)=>{this.setState({page_size:size,page_no:current},()=>{this.get_event_case_events_all()})}}/>
        </Card>)
    }

}

function mapDispatchToProps({mi1801Info}) {
    return {mi1801Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(PastNews)));