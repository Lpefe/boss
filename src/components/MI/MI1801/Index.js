/*@运维-告警信息*/
import React from 'react';
import {Card, Modal, Select,Tabs,Table,Pagination} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import {BossMessage} from "../../Common/BossMessages";

import moment from 'moment';
import BossEditModal from "../../Common/BossEditModal";
import PastNews from "./subComponents/PastNews"
import BossTable from "../../Common/BossTable"
import {deviceTypeMap, MomentFormatter, parse} from "../../../utils/commonUtilFunc";
import {domain} from "../../../utils/commonConsts";
import {injectIntl} from "react-intl";
const TabPane = Tabs.TabPane;

const Option = Select.Option;

class MI1801 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            selectedIds: [],
            selectedIds2:[],
            editId2:"",
            event_caseId:"",
            ignoreModalShow: false,
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
            selectedRecords2:[],
            ifIgnoreAll: false,
            ifIgnoreCurrent: false,
            page_size: 50,
            page_no: 1,
            visible:false,
            companyList: [],
            companyId:"",
            interval:false
        };
        this.refresh=""
    }

    componentDidMount() {
        this.get_redis_alarm();
        this.get_company_list();
        clearInterval(this.refresh)
    }
    componentWillUnmount() {
        clearInterval(this.refresh)
    }
    //新消息
    get_company_list=()=>{
        this.props.dispatch({
            type:"mi1801Info/getCompanyList",
            payload:{}
        })
    }
    interval = (index)=>{
        let vm = this
        this.setState({
            interval:!this.state.interval
        },()=>{

            if(this.state.interval){
                BossMessage(true,"@定时刷新开启成功，时间间隔为1分钟");
                vm.refresh = setInterval(function(){
                    let payload = {
                        start_time: vm.state.start_time,
                        end_time:  MomentFormatter(moment(),"YYYY-MM-DD 23:59:59"),
                        process_status:"unresolved",
                        name: vm.state.name,
                        p: vm.state.page_no,
                        limit: vm.state.page_size,
                        event_type:vm.state.alarm_type,
                    };
                    if (sessionStorage.getItem('role') === 'company' || sessionStorage.getItem('role') === 'companystaff') {
                        payload.company_id = sessionStorage.getItem('companyId');
                    }
                    if(vm.state.companyId){
                        payload.company_id = vm.state.companyId
                    }
                    vm.props.dispatch({
                        type: "mi1801Info/get_redis_alarm",
                        payload: payload
                    })
                },60000)
            }else{
                BossMessage(true,"@定时刷新已关闭");
                clearInterval(vm.refresh)
            }
        })
    }
    get_redis_alarm = () => {
        // let payload = {
        //     start_time: this.state.start_time,
        //     end_time: this.state.end_time,
        //     status: this.state.status,
        //     alarm_level: this.state.alarm_level,
        //     alarm_type: this.state.alarm_type,
        //     name: this.state.name,
        //     page_no: this.state.page_no,
        //     page_size: this.state.page_size
        // };
        let payload = {
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            process_status:"unresolved",
            name: this.state.name,
            p: this.state.page_no,
            limit: this.state.page_size,
            event_type:this.state.alarm_type,
        };
        if (sessionStorage.getItem('role') === 'company' || sessionStorage.getItem('role') === 'companystaff') {
            payload.company_id = sessionStorage.getItem('companyId');
        }
        if(this.state.companyId){
            payload.company_id = this.state.companyId
        }
        this.props.dispatch({
            type: "mi1801Info/get_redis_alarm",
            payload: payload
        })
    };
    //忽略
    handleIgnoreModalShow = (record) => {
        this.setState({
            ignoreModalShow: true,
            editId: record.id,
            ifIgnoreAll: false,
            ifIgnoreCurrent: false
        })
    };
    //批量
    handleIgnoreModalBatchShow = () => {
        this.setState({
            ignoreModalShow: true,
            ifIgnoreAll: false,
            ifIgnoreCurrent: false
        })
    };
    handleRestrainModalBatchShow = ()=>{
        this.setState({
            RestrainModalShow: true,
        })
    }
    //抑制
    RestrainModalShow = (record) => {
        this.setState({
            RestrainModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };
    //处理
    handleProcessModalShow = (record) => {
        if (record.deal_status === "DOING") {
            return;
        }
        this.setState({
            processModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };
    //忽略close
    handleCloseIgnoreModal = () => {
        this.setState({
            ignoreModalShow: false,
            editId: "",

        })
    };
    //处理close
    handleCloseProcessModal = () => {
        this.setState({
            processModalShow: false,
            editId: ""
        })
    };
    //抑制close
    handleCloseConfirmModal = () => {
        this.setState({
            confirmModalShow: false,
            processModalShow: false,
            RestrainModalShow: false,
            editId: ""
        })
    };
    
    handleSelectRange = (moments) => {
        this.setState({
            start_time: moments[0] ? MomentFormatter(moments[0], "YYYY-MM-DD 00:00:00") : "",
            end_time: moments[1] ? MomentFormatter(moments[1], "YYYY-MM-DD 23:59:59") : "",
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmType = (value) => {
        this.setState({
            alarm_type: value || "",
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmLevel = (value) => {
        this.setState({
            alarm_level: value || "",
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmStatus = (value) => {
        this.setState({
            companyId: value || "",
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };
    handelSearchSubmit = (value) => {
        this.setState({
            name: value,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };
    
    handleIgnoreModalShowBatch = () => {
        if (this.state.selectedIds.length > 0) {
            this.setState({
                editId: this.state.selectedIds
            }, () => {
                this.handleIgnoreModalBatchShow()
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };
    handleIgnoreModalShowBatch2 = () => {
        if (this.state.selectedIds.length > 0) {
            this.setState({
                editId: this.state.selectedIds
            }, () => {
                this.handleRestrainModalBatchShow()
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };
    handleIgnoreModalShowBatch3 = () => {
        if (this.state.selectedIds2.length > 0) {
            this.setState({
                editId2: this.state.selectedIds2
            }, () => {
                this.handleIgnoreModalBatchShow()
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
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
    gotoNote = (record) =>{
        this.props.dispatch({
            type: "mi1801Info/get_event_case_events",
            payload: {
                start_time: this.state.start_time,
                end_time: MomentFormatter(moment(),"YYYY-MM-DD 23:59:59"),
                p: this.state.page_no,
                limit: 100,
                event_caseId:record.id,
                deal_status:0
            }
        }).then(()=>{
            this.setState({
                event_caseId:record.id,
                visible: true
            })
        })
    }
    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };
    changeTabs=()=> {
        clearInterval(this.refresh)
        this.setState({
            interval:false
        })
        
    }
    validateIgnore = (rule, value, callback) => {
        let ignore_all = this.ignoreModalComponent.props.form.getFieldValue("ignore_all");
        let ignore_current = this.ignoreModalComponent.props.form.getFieldValue("ignore_current");
        if (!(ignore_all || ignore_current)) {
            callback("@请选择忽略当前消息或全部消息")
        }
        callback();
    };
    // operationMenuRender = (index, record) => {
    //     return <Menu>
    //         <Menu.Item key="1" onClick={() => this.RestrainModalShow(record)}>@抑制</Menu.Item>
    //         {record.status === "TODO" ? <Menu.Item key="2"
    //                                                onClick={() => this.handleIgnoreModalShow(record)}>{'@忽略'}</Menu.Item> : ""}
    //         {record.device_type === "STEP" ?
    //             <Menu.Item key="3" style={record.status === "DOING" ? {color: "rgba(0,0,0,0.25)"} : {}}
    //                        onClick={() => this.handleProcessModalShow(record)}>{'@处理'}</Menu.Item> : ""}
    //         <Menu.Item key="4" onClick={() => this.handleCheckAlarm(record)}
    //                    style={record.status === "TODO" ? {color: "rgba(0,0,0,0.25)"} : {}}>{'@详情'}</Menu.Item>
    //     </Menu>
    // };
    cancel=()=>{
        this.setState({
            visible:false,
            editId2:"",
            selectedIds2:[]
        })
    }
    Submit=()=>{
        this.setState({
            visible:false,
            editId2:"",
            selectedIds2:[]
        })
    }
    handelUploadModalShow=()=>{
        this.props.dispatch({
            type: "mi2001Info/deleteDataSource",
            payload: {
                deleteIds:this.state.selectedRowKeys
            }
        }).then(()=>{
            this.setState({
                selectedRowKeys:[]
            },)
        }
        )
    }
    render() {
        const search = parse(this.props.location.search);
        const ifCompany = sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff";
        // let payload = {
        //     start_time: this.state.start_time,
        //     end_time: this.state.end_time,
        //     status: this.state.status,
        //     alarm_level: this.state.alarm_level,
        //     alarm_type: this.state.alarm_type,
        //     name: this.state.name,
        // };
        const optionsCompany=this.props.mi1801Info.companyList.map((item)=>{
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        let payload = {
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            name: this.state.name,
            process_status: "unresolved",
            event_type:this.state.alarm_type,
            p: this.state.page_no,
            limit: this.state.page_size,
        };
        if (ifCompany) {
            payload.company_id = sessionStorage.getItem('companyId');
        }
        if(this.state.companyId){
            payload.company_id = this.state.companyId
        }
        const columns = [{
            title: "@时间",
            dataIndex: "timestamp",
            key: "timestamp",
        }, {
            title: "@名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)} className={record.company_id ? "common-link-icon" : ""}>
                    {record.event_type === 'device' ? (record.device_name?record.device_name:record.endpoint) : (record.link_name?record.link_name:record.endpoint)}
                </span>
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
            render:(index,record)=>{
                return <span onClick={() => this.gotoNote(record)}
                className={"common-link-icon"}>{index+"("+record.event_num+"@次"+")"}</span>
            }
                
            
        }, {
            title: "@操作",
            dataIndex: "operation",
            key: "operation",
            width: 150,
            fixed:"right",
            align: "center",
            // render: (index, record) => {
            //     return <Dropdown overlay={this.operationMenuRender(index, record)}>
            //         <Icon type="ellipsis"/>
            //     </Dropdown>
            // }
            render:(text,record)=>{
                return  <div>
                    <span onClick={()=>this.RestrainModalShow(record)} style={{display:"inline-block",fontSize:"14px",cursor:"pointer"}} className="operations-edit-btn">@抑制</span>
                    <span onClick={()=>this.handleProcessModalShow(record)} style={{display:"inline-block",fontSize:"14px",cursor:"pointer"}} className="operations-delete-btn">@处理</span>
                    <span onClick={()=>this.handleIgnoreModalShow(record)} style={{display:"inline-block",fontSize:"14px",cursor:"pointer"}} className="operations-delete-btn">@忽略</span>
            </div>
            }
            // render: (text, record) => {
            //     return <div className="common-link-icon">
            //         {record.status === "TODO" ? <span style={{marginRight: 8}}onClick={() => this.handleIgnoreModalShow(record)}>{"@忽略"}</span> : ""}
            //         {record.device_type === "STEP" ?<span style={record.status === "DOING" ? {marginRight: 8,color: "rgba(0,0,0,0.25)"} : {marginRight: 8}} onClick={() => this.handleProcessModalShow(record)}>{"@处理"}</span> : ""}
            //         <span onClick={() => this.handleCheckAlarm(record)} style={record.status === "TODO" ? {color: "rgba(0,0,0,0.25)"} : {}}>{"@详情"}</span>
            //     </div>
            // }
            
        },];
        const companyCol = [{
            title: "@时间",
            dataIndex: "timestamp",
            key: "timestamp",
        }, {
            title: "@名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)}className={record.company_id ? "common-link-icon" : ""}>
                    {record.event_type === 'device' ? (record.device_name?record.device_name:record.endpoint) : (record.link_name?record.link_name:record.endpoint)}  
                 </span>
            }
        },{
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
            render:(index,record)=>{
                return <span onClick={() => this.gotoNote(record)}
                className={"common-link-icon"}>{index+"("+record.event_num+"@次"+")"}</span>
            }
        },];
        const options = [
            <Option value="link" key="link">{"@链路"}</Option>,
            <Option value="device" key="device">{"@设备"}</Option>,
        ];
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
        const rowSelection2 = {
            selectedRowKeys: this.state.selectedIds2,
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds2: selectedRowKeys,
                    selectedRecords2: selectedRecords,
                })
            }
        };

        const IgnoreModalOptions = {
            title: "@忽略",
            visible: this.state.ignoreModalShow,
            onCancel: this.handleCloseIgnoreModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId2?"mi1801Info/deal_sub_event_case":"mi1801Info/ignore",
            initPayload: payload,
            hasSubmitCancel: true,
            submitCancel: () => {
                this.setState({
                    ignoreModalShow: false,
                    editId: "",
                    selectedIds: [],
                    selectedRecords: [],
                })
            },
            extraUpdatePayload: {ids:this.state.editId instanceof Array? this.state.editId:[this.state.editId],ids2:this.state.editId2,event_caseId:this.state.event_caseId},
            initialValues: {
                restrain_type: "current"
            },
            bodyHeight: 250,
            InputItems: [{
                type: "Select",
                labelName: "@原因",
                valName: "reason",
                nativeProps: {
                    placeholder: "@请选择原因",
                },
                children: [{name: "COREDUMP", value: "COREDUMP", key: "COREDUMP"}, {
                    name: "LINK UP/DOWN",
                    value: "LINK UP/DOWN",
                    key: "LINK UP/DOWN"
                }, {name: "PPPoe", value: "PPPoe", key: "PPPoe"}, {
                    name: "@系统重启",
                    value: "系统重启",
                    key: "系统重启"
                }, {name: "@外网质量差", value: "外网质量差", key: "外网质量差"}, {
                    name: "@测试",
                    value: "测试",
                    key: "测试"
                },{
                    name:"@其他",
                    value: "其他",
                    key: "其他"
                }],
                rules: [{required: true, message: "@请选择原因"}]
            },{
                type:"TextArea",
                labelName:"@备注",
                valName:"remark",
                nativeProps:{
                    placeholder:"@请输入备注"
                }
            }]
        };
        const RestrainModalOptions = {
            title: "@消息抑制设置",
            visible: this.state.RestrainModalShow,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/ignore",
            extraUpdatePayload: {
                ids:  this.state.editId instanceof Array?this.state.editId:[this.state.editId],
                start_time: this.state.restrain_start_time,
                end_time: this.state.restrain_end_time,
                reason:""
            },
            initialValues: {restrain_type: "current"},
            onCancel: this.handleCloseConfirmModal,
            initPayload: payload,
            width: 535,
            InputItems: [{
                type: "Radio",
                labelName: "@类型",
                valName: "restrain_type",
                children: [{
                    name: "@抑制该告警信息",
                    value: "current",
                    key: "1"
                }, {
                    name: "@抑制设备所有告警信息",
                    value: "all",
                    key: "2"
                }],
                rules: [{required: true, message: "@请选择类型"}],

            }, {
                type: "RangePicker",
                labelName: "@抑制时间段",
                valName: "time",
                nativeProps: {
                    format: "YYYY-MM-DD HH:mm:ss",
                    showTime: {format: 'HH:mm:ss'}
                },
                onChange: (value, modalComponent) => {
                    this.setState({
                        restrain_start_time: value[0] ? MomentFormatter(value[0], "YYYY-MM-DD HH:mm:ss") : "",
                        restrain_end_time: value[1] ? MomentFormatter(value[1], "YYYY-MM-DD HH:mm:ss") : "",
                    }, () => {
                        const val = modalComponent.props.form.getFieldsValue();
                        if (value[1] - value[0] > 86400000 && val.is_cycle === true) {
                            modalComponent.props.form.setFieldsValue({"is_cycle": undefined})
                            Modal.warning({
                                title: "@抑制时间不能超过24小时"
                            })
                        }
                    })
                },
                rules: [{required: true, message: "@请选择时间"}],
            }, {
                type: "CheckBox",
                labelName: '',
                valName: "is_cycle",
                checkBoxName: "@按天循环(启用该功能时，抑制时间不能超过24小时)",
                nativeProps: {},
                initialValue: false,
                customerFormLayout: {
                    wrapperCol: {
                        xs: {span: 16, offset: 5},
                    }
                },
                onChange: (e, modalComponent) => {
                    const val = modalComponent.props.form.getFieldsValue();
                    if (val.time) {
                        if (val.time[1] - val.time[0] > 86400000 && e.target.checked === true) {
                            modalComponent.props.form.setFieldsValue({"time": undefined})
                            Modal.warning({
                                title: "@抑制时间不能超过24小时"
                            })
                        }
                    }

                }
            }, {
                type: "TextArea",
                labelName: "@说明",
                valName: "remark",
                nativeProps: {
                    placeholder:"@请输入说明",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 256, message: "@说明最多不超过256字符"}]

            }]
        };
        const ProcessModalOptions = {
            title: "@消息处理",
            visible: this.state.processModalShow,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/process",
            extraUpdatePayload: {alarm_id: this.state.editId, sn: this.state.editRecord.endpoint},
            initialValues: {},
            bodyHeight:500,
            hasSubmitCancel: true,
            onCancel: this.handleCloseProcessModal,
            submitCancel: (modal) => {
                let values = modal.props.form.getFieldsValue();
                if (values.debug === "1" && values.process === undefined) {
                    Modal.warning({
                        title: "@请至少选择一项操作"
                    })
                } else {
                    this.setState({
                        confirmModalShow: true
                    })
                }

            },
            width: 535,
            InputItems: [{
                type: "Plain",
                height:35,
                labelName: "@设备名称",
                content: this.state.editRecord.device_name
            }, {
                type: "Plain",
                height:35,
                labelName: "@硬件ID",
                content: this.state.editRecord.endpoint
            }, {
                type: "Plain",
                height:35,
                labelName: "@设备类型",
                content: deviceTypeMap(this.state.editRecord.type)
            }, {
                type: "Plain",
                labelName: "@链路名称",
                height:35,
                content: this.state.editRecord.link_name
            }, {
                type: "Radio",
                labelName: "@处理",
                valName: "debug",
                style: {
                    background: "#f2f2f2",
                    marginBottom: 0,
                    paddingBottom: 16,
                    marginTop:32
                },
                children: [{
                    name: "@关闭Debug日志",
                    value: "close_step_main_debug",
                    key: "6"
                }, {
                    name: "@开启Debug日志",
                    value: "open_step_main_debug",
                    key: "5"
                }, {name: "@重启step_main服务", value: "restart_step_main", key: "1"}, {
                    name: "@获取step_main日志",
                    value: "up_step_main_log", key: "2"
                }, {name: "@重启dyagent服务", value: "restart_dyagent", key: "3"}, {
                    name: "@获取dyagent日志",
                    value: "up_dyagent_log", key: '4'
                }]
            }, {
                type: "TextArea",
                labelName: "@说明",
                valName: "remark",
                style: {
                    background: "#f2f2f2",
                    marginBottom: 0,
                    paddingBottom: 32
                },
                nativeProps: {
                    placeholder: "@请输入说明",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 256, message: "@说明最多不超过256字符"}]
            }]
        };

        const ConfirmModalOptions = {
            title: "@请输入验证密码",
            visible: this.state.confirmModalShow,
            onCancel: this.handleCloseConfirmModal,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/confirm",
            extraUpdatePayload: {id: this.state.editId},
            initPayload: payload,
            initialValues: {
                userNm: sessionStorage.getItem("userNm")
            },
            bodyHeight: 200,
            InputItems: [{
                type: "Input",
                labelName: "@用户名",
                valName: "userNm",
                nativeProps: {
                    disabled: true,
                },
            }, {
                type: "Input",
                labelName: "@密码",
                valName: "password",
                rules: [{required: true, message: "@请输入密码"}],
                nativeProps: {
                    type: 'password',
                },
            }]
        };
        const Columns = [
            {
                title: "@时间",
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: "@故障状态",
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    return text === 1 ? "@修复" : "@故障"
                }
            },
            {
                title: "@故障持续时间",
                dataIndex: 'recovery_time',
                key: 'recovery_time',
            }];
        return (
        <Card className="card">
            <Tabs onChange={this.changeTabs} defaultActiveKey='1'>
                <TabPane tab={'@新消息'} key="1">
                    <div className="card">
                        <HeaderBar hasSearch={true} hasSelect={true} hasRangePicker={true} hasSelectTwo={!ifCompany}
                                selectPlaceHolder={"@请选择对象"}
                                selectTwoPlaceHolder={"@请选择企业"} 
                                hasExtraBtnThree={!ifCompany}
                                extraBtnNameThree={"@批量忽略"}
                                btnThreeFunc={this.handleIgnoreModalShowBatch}
                                hasExtraBtnFour={!ifCompany}
                                extraBtnNameFour="@批量抑制"
                                btnFourFunc={this.handleIgnoreModalShowBatch2}
                                dateRange={search.from !== 'dashboard' ? [moment().startOf('month'), moment()] : []}
                                options={options} optionsTwo={optionsCompany}
                                rangePickerMethod={this.handleSelectRange}
                                selectOneMethod={this.handleSelectAlarmType} selectTwoMethod={this.handleSelectAlarmStatus}
                                submit={this.handelSearchSubmit}
                                selectedKeys={this.state.selectedRecords} selectOneWidth={120} selectTwoWidth={120}
                                hasSwitch={true}
                                checkedChildren="@开启"
                                unCheckedChildren="@关闭"
                                checked={this.state.interval}
                                switchName="@定时刷新"
                                handleSwitchtChange={this.interval}
                                />
                        <BossTable component={this}
                                columns={ifCompany ? companyCol : columns}
                                pagination={false} dataSource={this.props.mi1801Info.alarmList}
                                rowSelection={ifCompany?null:rowSelection}/>
                        <Pagination style={{marginTop:10,float:"right"}} pageSizeOptions={["20","50","100"]} size="small" total={this.props.mi1801Info.total} defaultPageSize={50} showSizeChanger showQuickJumper 
                        onChange={(page, pageSize)=>{this.setState({page_no:page},()=>{this.get_redis_alarm()})}}
                        onShowSizeChange={(current, size)=>{this.setState({page_size:size,page_no:current},()=>{this.get_redis_alarm()})}}
                        />
                        <BossEditModal {...IgnoreModalOptions} refs={this.onRef}/>
                        <BossEditModal {...ProcessModalOptions}/>
                        <BossEditModal {...ConfirmModalOptions}/>
                        <BossEditModal {...RestrainModalOptions}/>
                        <Modal width="600px" maskClosable={false} visible={this.state.visible} title="@事件"
                           footer={null} onCancel={this.cancel}  destroyOnClose >
                             {ifCompany?"":<HeaderBar hasExtraBtnThree={true}
                                extraBtnNameThree={"@批量忽略"}
                                btnThreeFunc={this.handleIgnoreModalShowBatch3}  selectedKeys={this.state.selectedRowKeys}/>}
                            <Table bordered size="middle" rowKey={record => record.id} pagination={false} onRow={this.onRow}
                    rowClassName="normal" rowSelection={ifCompany?null:rowSelection2} columns={Columns} dataSource={this.props.mi1801Info.noteList}/>
                        </Modal>
                    </div>
                </TabPane>
                <TabPane tab={'@历史消息'} key="2">
                        <PastNews this={this}></PastNews>
                </TabPane>
            </Tabs>
        </Card>

        )
    }
}

export default injectIntl(MI1801);