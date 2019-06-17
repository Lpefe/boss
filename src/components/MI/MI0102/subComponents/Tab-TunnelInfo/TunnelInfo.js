/*@运维-设备信息*/
import React from 'react';
import {Select, Card, Radio, Form, DatePicker} from 'antd';
import {connect} from 'dva';
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import moment from 'moment';
import noWan from '../../../../../assets/img/noWan.png';
import {parse} from '../../../../../utils/commonUtilFunc';
import {withRouter} from 'react-router-dom';
import {injectIntl} from "react-intl";
const Option = Select.Option;
const RadioGrp = Radio.Group;
const RangePicker=DatePicker.RangePicker;
class TunnelInfo extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            end_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
            start_tm: search.from === "load"||search.ifAlarm==='true' ? moment(parse(this.props.location.search).time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            intervalType: search.from === "load" ? "4" : "0"
        }
    }

    componentDidMount() {
        this.get_tunnel_data();
        if (parse(this.props.location.search).from !== "device") {
            this.props.dispatch({
                type: "mi0102Info/set_tunnel_info",
                payload: {
                    id: parse(this.props.location.search).id
                }
            })
        }
        if (parse(this.props.location.search).from === 'load' || parse(this.props.location.search).from === 'link') {
            this.props.dispatch({
                type: "mi0102Info/set_tunnel_bandwidth",
                payload: {
                    bandwidth: parse(this.props.location.search).bandwidth
                }
            })
        }
    }

    //在有多条隧道情况下切换隧道
    handleSelectTunnelType = (e) => {
        let offId = sessionStorage.getItem("tunnelOffId");
        clearInterval(offId);

        let tunnelList = this.props.mi0102Info.tunnelList;
        let bandwidth = 0;
        for (let key in tunnelList) {
            if (tunnelList[key].value === e.target.value) {
                bandwidth = tunnelList[key].bandwidth
            }
        }
        this.props.dispatch({
            type: "mi0102Info/changeTunnel",
            payload: {
                tunnel: e.target.value,
                bandwidth: bandwidth
            }
        }).then(()=>{
            this.get_tunnel_data();
        });
    };
    //获取隧道信息的各类数据
    get_tunnel_data = () => {
        const {deviceInfo} = this.props.mi0102Info;
        this.props.dispatch({
            type: "mi0102Info/get_tunnel_data",
            payload: {
                tunnel_id: parse(this.props.location.search).from === "device" ? this.props.mi0102Info.selectedTunnel : parse(this.props.location.search).id,
                companyid: parse(this.props.location.search).company_id||this.props.mi0102Info.deviceInfo.company_id ,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                tid: parse(this.props.location.search).from === "device" ? this.props.mi0102Info.selectedTunnel : parse(this.props.location.search).id,
                sn: deviceInfo.sn || parse(this.props.location.search).sn,
                from: parse(this.props.location.search).from,
            }
        })
    };
    selectTimeInterval = (value) => {
        let vm = this;
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
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
            intervalType: value
        }, function () {
            vm.get_tunnel_data();
        })
    };
    //切换图表刷新间隔时间
    selectRefreshInterval = (value) => {
        let vm = this;
        let timeInterval;
        clearInterval(this.state.offId);
        this.props.mi0102Info.refreshType = value;
        switch (value) {
            case "0":
                return;
            case "1":
                timeInterval = 15 * 1000;
                break;
            case "2":
                timeInterval = 30 * 1000;
                break;
            case "3":
                timeInterval = 60 * 1000;
                break;
            default:
                return;
        }

        let offId = setInterval(function () {
            vm.selectTimeInterval(vm.state.intervalType)
        }, timeInterval);
        this.setState({
            offId: offId
        });
        sessionStorage.setItem("tunnelOffId", offId)
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
                this.get_tunnel_data();
            })
        }
    };

    render() {
        const inEnglish = window.appLocale.locale === "en-US"
        const chartPropsI = {
            id: "tunnelSpeed",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: true,
                    name: "@时间",
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                },
                yAxis: {type: 'value', name: "@速率"+"Mbps",},

                series: this.props.mi0102Info.tunnelInfoSeries.speed
            }
        };
        const chartPropsII = {
            id: "RTT",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: "@时间",
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                },
                yAxis: [
                    {type: 'value', name: "@网络延迟"+"(ms)", axisLine: {show: false}, axisTick: {show: false}},
                    sessionStorage.getItem("role")==='company'||sessionStorage.getItem('role')==='companystaff'?{
                        type: 'value',
                        name: "",
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false}
                    }:{
                        type: 'value',
                        name: "Get(ms)",
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false}
                    }
                ],
                series: this.props.mi0102Info.tunnelInfoSeries.rttGet
            }
        };
        const chartPropsIII = {
            id: "sessionCount",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min: this.state.start_tm,
                    max: this.state.end_tm, axisTick: {show: false},
                },
                yAxis: {type: 'value', name: "@session数量"+"(个)",minInterval:1},

                series: this.props.mi0102Info.tunnelInfoSeries.session
            }
        };
        const chartPropsIV = {
            id: "tunnelStatus",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                    axisTick: {show: false},
                },
                yAxis: {type: 'category', data: ["OFFLINE", "ONLINE", ""], boundaryGap: false,axisLine:{show:true,lineStyle:{color:"rgba(0,0,0,0.45)"}}},

                series: this.props.mi0102Info.tunnelInfoSeries.tunnelStatus
            }
        };
        const {mi0102Info} = this.props;
        const option = [
            <Option value="0" key="0">@最近30分钟</Option>,
            <Option value="1" key="1">@最近6小时</Option>,
            <Option value="2" key="2">@最近一天</Option>,
            <Option value="3" key="3">@最近一周</Option>
        ];

        const loadOption = [
            <Option value="4" key="4">{"@前后15分钟"}</Option>,
            <Option value="5" key="5">{"@前后30分钟"}</Option>,
            <Option value="6" key="6">{"@前后3小时"}</Option>,
            <Option value="7" key="7">{"@前后12小时"}</Option>,
            <Option value="8" key="8">{"@前后1天"}</Option>,
            <Option value="9" key="9">{"@前后3天"}</Option>,
        ];
        //前后30分钟、前后1小时、前后6小时、前后24小时、前后2天和前后1周
        const search = parse(this.props.location.search);
        const tunnelId = parse(this.props.location.search).id;
        const dateFormat = 'YYYY-MM-DD HH:mm:ss'
        return (
            <Card className="card">
                {mi0102Info.tunnelList.length > 0 ? <div>

                    <RadioGrp style={{marginBottom: 16}} value={mi0102Info.selectedTunnel}
                              onChange={this.handleSelectTunnelType}>
                        {search.from === "device" ? mi0102Info.tunnelList.map((item) => {
                            return <Radio key={item.value} value={item.value}>{item.name}</Radio>
                        }) : <Radio key={tunnelId} value={tunnelId}>{"tunnel_" + tunnelId}</Radio>}

                    </RadioGrp>
                    <header style={{marginBottom: 16}}>
                        <Select style={{width: inEnglish?250:150, marginRight: 8}} placeholder={"@请选择时间间隔"}
                                onChange={this.selectTimeInterval}
                                defaultValue={search.from === "load"||search.ifAlarm==='true' ? "4" : "0"}>
                            {search.from === "load"|| search.ifAlarm === "true"  ? loadOption : option}
                        </Select>
                        <RangePicker 
                            style={{width:350,marginRight: 8}} showTime
                            value={[moment(this.state.start_tm, dateFormat), moment(this.state.end_tm, dateFormat)]}
                            disabledDate={this.disabledDate} onCalendarChange={this.handleRangeChange} />
                        {parse(this.props.location.search).from === "load"?"":<Select onChange={this.selectRefreshInterval} style={{width: 150,marginRight:8}} defaultValue="0">
                            <Option value="0" key="0">{"@不刷新"}</Option>
                            <Option value="1" key="1">{"@15秒刷新"}</Option>
                            <Option value="2" key="2">{"@30秒刷新"}</Option>
                            <Option value="3" key="3">{"@60秒刷新"}</Option>
                        </Select>}
                    </header>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsI} ifNotMerge={true}/>
                    </Card>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsII} ifNotMerge={true}/>
                    </Card>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsIII} ifNotMerge={true}/>
                    </Card>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsIV} ifNotMerge={true}/>
                    </Card>
                </div> : <div style={{textAlign: "center"}}>
                    <img src={noWan} alt="" style={{marginTop: 60}}/>
                </div>}
            </Card>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(withRouter(injectIntl(TunnelInfo))));