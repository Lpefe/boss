/*@运维-设备信息*/
import React from 'react';
import {Select, Form, Card, DatePicker,Dropdown,Icon,Menu} from 'antd';
import {connect} from 'dva';
import BossTable from "../../../../Common/BossTable";
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import moment from 'moment';
import {parse} from "../../../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
import {withRouter} from 'react-router-dom';
const MonthPicker = DatePicker.MonthPicker;
const Option = Select.Option;
const RangePicker=DatePicker.RangePicker;
class Wan4G extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            end_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
            start_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            intervalType: search.from === "load"||search.ifAlarm==='true' ? "4" : "0",//取值时间范围
            selectedMonth:moment()
        }
    }

    selectTimeInterval = (value) => {
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        this.props.mi0102Info.timeInterval4G=value;
        let time = parse(this.props.location.search).time;
        switch (value) {
            case "0":
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm = moment(time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "5":
                start_tm = moment(time).subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "6":
                start_tm = moment(time).subtract(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "7":
                start_tm = moment(time).subtract(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "8":
                start_tm = moment(time).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "9":
                start_tm = moment(time).subtract(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm,
        }, ()=> {
            this.get_wans();
        })
    };

    get_wans = () => {
        const {deviceInfo, selectedWanInfo} = this.props.mi0102Info;
        this.props.dispatch({
            type: "mi0102Info/get_wans",
            payload: {
                sn: deviceInfo.sn,
                companyid: deviceInfo.company_id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                iface: selectedWanInfo.interface
            }
        })
    };

    handleMonthChange = (value) => {
        const {deviceInfo} = this.props.mi0102Info;
        this.setState({
            selectedMonth:value
        });
        this.props.dispatch({
            type: "mi0102Info/get_days4g",
            payload: {
                sn:deviceInfo.sn,
                companyid: deviceInfo.company_id,
                month:moment(value).format("YYYY-MM")+"-01 00:00:00"
            }
        })
    };

    disabledDate=(current)=>{
        return (current.diff(this.state.start_tm, 'days') < -5) || (current.diff(this.state.start_tm, 'days') > 6)
    };
    handleRangeChange=(moment)=>{
        if(moment.length===1){
            this.setState({
                start_tm:moment[0].format("YYYY-MM-DD HH:mm:ss")
            })
        }else if(moment.length===2){
            this.setState({
                start_tm:moment[0].format("YYYY-MM-DD HH:mm:ss"),
                end_tm:moment[1].format("YYYY-MM-DD HH:mm:ss")
            },()=>{
                this.get_wans();
            })
        }
    };

    render() {
        const inEnglish = window.appLocale.locale === "en-US";
        const columns = [
            {
                title: '@端口',
                dataIndex: 'interface',
                key: 'interface',
            }, {
                title: '@状态',
                dataIndex: 'linkstatus',
                key: 'linkstatus',
                render:(index,record)=> {
                    if (record.upDownInfo.length>0) {
                        const menu = (
                            <Menu>
                                {record.upDownInfo.map((item, index) => {
                                    return <Menu.Item key={index}>
                                        {item.action} | {moment.unix(item.time).format("YYYY-MM-DD HH:mm:ss")}
                                    </Menu.Item>
                                })}
                            </Menu>
                        );
                        return <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link">
                                {record.upDownInfo.length > 0 ? record.upDownInfo[0].action : ""}<Icon type="down"/>
                            </a>
                        </Dropdown>
                    }else{
                        return ""
                    }
                }
            }, {
                title: '@时间',
                dataIndex: 'model',
                key: 'model',
                render:(index,record)=>{
                    return <span>{record.upDownInfo.length>0?moment.unix(record.upDownInfo[0].time).format("YYYY-MM-DD HH:mm:ss"):""}</span>
                }
            }, {
                title: '@工作模式',
                dataIndex: 'lte_info',
                key: 'lte_info',
            }, {
                title: '@运营商',
                dataIndex: 'isp',
                key: 'isp',
            }, {
                title: '@线路类型',
                dataIndex: 'acctype',
                key: 'acctype',
            }, {
                title: '@IP地址',
                dataIndex: 'ip',
                key: 'ip',
            }, {
                title: '@子网掩码',
                dataIndex: 'netmask',
                key: 'netmask',
            }, {
                title: '@网关地址',
                dataIndex: 'gateway',
                key: 'gateway',
            }, {
                title: '@首选DNS服务器',
                dataIndex: 'dns',
                key: 'dns',
            }];
        const chartPropsI = {
            id: "speed",
            containerHeight: 500,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: "@时间",
                    min:this.state.start_tm,
                    max:this.state.end_tm,
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    }
                },
                yAxis: [
                    {type: 'value', name: "@速率"+"(Mbps)",axisLine:{show:false},axisTick:{show:false}},
                ],
                series: this.props.mi0102Info.wanInfoDataSeries.speed,
            }
        };
        const chartPropsII = {
            id: "getPost",
            containerHeight: 500,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min:this.state.start_tm,
                    max:this.state.end_tm,
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    }
                },
                yAxis: [
                    {type: 'value', name: "@网络延迟"+"(ms)",axisLine:{show:false},axisTick:{show:false}},
                    {type: 'value', name: "@网络丢包"+"(%)", boundaryGap: false,max: 100,axisLine:{show:false},axisTick:{show:false}}
                ],
                series: this.props.mi0102Info.wanInfoDataSeries.rttMiss,
            }
        };
        let isCurrentMonth=moment(this.state.selectedMonth).month()===moment().month();
        const chartPropsIII = {
            id: "lost",
            containerHeight: 500,
            option: {
                xAxis: {
                    type: 'time',
                    axisTick:{show:false},
                    boundaryGap: false,
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    },
                    min:moment(this.state.selectedMonth).startOf('month').format("YYYY-MM-DD"),
                    max:isCurrentMonth?moment().format("YYYY-MM-DD"):moment(this.state.selectedMonth).endOf('month').format("YYYY-MM-DD"),//本月的话显示本月天数,非本月显示改月所有天数
                },
                yAxis: [
                    {type: 'value', name: "@日流量统计"+"(MB)",axisLine:{show:false},axisTick:{show:false}},
                ],
                series: this.props.mi0102Info.days4gSeries
            }
        };
        const option = [
            <Option value="0" key="0">最近30分钟</Option>,
            <Option value="1" key="1">最近6小时</Option>,
            <Option value="2" key="2">最近一天</Option>,
            <Option value="3" key="3">最近一周</Option>
        ];

        const loadOption = [
            <Option value="4" key="4">{"@前后15分钟"}</Option>,
            <Option value="5" key="5">{"@前后30分钟"}</Option>,
            <Option value="6" key="6">{"@前后3小时"}</Option>,
            <Option value="7" key="7">{"@前后12小时"}</Option>,
            <Option value="8" key="8">{"@前后1天"}</Option>,
            <Option value="9" key="9">{"@前后3天"}</Option>,
        ];
        const search=parse(this.props.location.search);
        const {mi0102Info}=this.props;
        const dateFormat = 'YYYY-MM-DD HH:mm:ss'
        return (
            <div>
                <BossTable columns={columns} style={{marginBottom: 16}}
                           dataSource={[mi0102Info.selectedWanInfo]} pagination={false}/>
                <header>
                    <RangePicker 
                    value={[moment(this.state.start_tm, dateFormat), moment(this.state.end_tm, dateFormat)]} showTime
                    style={{width:350,marginRight: 8}}  disabledDate={this.disabledDate} onCalendarChange={this.handleRangeChange} />
                    <Select style={{width: inEnglish?250:150, marginRight: 8}} placeholder={"@请选择时间间隔"}
                            onChange={this.selectTimeInterval}
                            defaultValue={search.from === "load"||search.ifAlarm==="true" ? "4" : "0"}>
                        {search.from === "load"||search.ifAlarm==="true" ? loadOption : option}
                    </Select>
                </header>
                <div className="divide-line"/>
                <Card style={{marginBottom: 16}}>
                    <BossLineChart {...chartPropsI} ifNotMerge={true}/>
                </Card>
                <Card style={{marginBottom: 16}}>
                    <BossLineChart {...chartPropsII} ifNotMerge={true}/>
                </Card>
                <header>
                    <MonthPicker placeholder={"@请选择月份"} onChange={this.handleMonthChange} defaultValue={moment()}/>
                    <span style={{marginLeft: 24}}>{"@本月流量"}:{mi0102Info.monthTotal}M</span>
                </header>
                <div className="divide-line"/>
                <Card style={{marginBottom: 16}}>
                    <BossLineChart {...chartPropsIII} ifNotMerge={true}/>
                </Card>
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(injectIntl(withRouter(Wan4G))));