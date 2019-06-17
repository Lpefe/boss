/*@4G流量-历史流量图表*/

import React from 'react';
import './index.scss';
import {DatePicker,Card } from 'antd';
import {parse} from '../../../utils/commonUtilFunc';
import BossLineChart from '../../Common/Charts/Line/BossLineChart';
import moment from 'moment';
import {injectIntl} from "react-intl";
const MonthPicker = DatePicker.MonthPicker;

class CI1802 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editRecord: {},
            editId: "",
            month:moment().format("YYYY-MM")+"-01 00:00:00",
            selectedMonth:moment()
        }
    }

    componentDidMount(){
        this.get_4g_flow();
        this.get_days4g();
    }



    get_4g_flow=()=>{
        this.props.dispatch({
            type:"ci1802Info/get_4g_flow",
            payload:{
                sns:[parse(this.props.location.search).sn]
            }
        })
    };

    get_days4g=()=>{
        this.props.dispatch({
            type:"ci1802Info/get_days4g",
            payload:{
                month:this.state.month,
                sn:parse(this.props.location.search).sn,
                companyid:parse(this.props.location.search).company_id,
            }
        })
    };
    handleMonthChange=(value)=>{
        this.setState({
            selectedMonth:value
        });
        this.props.dispatch({
            type:"ci1802Info/get_days4g",
            payload:{
                month:moment(value).format("YYYY-MM")+"-01 00:00:00",
                sn:parse(this.props.location.search).sn,
                companyid:parse(this.props.location.search).company_id,
            }
        })
    };


    render() {
        let isCurrentMonth=moment(this.state.selectedMonth).month()===moment().month();
        const chartOption={
            id: "dayFlow",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    },
                    name:'@时间',
                    min:moment(this.state.selectedMonth).startOf('month').format("YYYY-MM-DD"),
                    max:isCurrentMonth?moment().format("YYYY-MM-DD"):moment(this.state.selectedMonth).endOf('month').format("YYYY-MM-DD"),
                },
                yAxis: [
                    {type: 'value', name: "MB",axisLine:{show:false},axisTick:{show:false}},
                ],
                series:this.props.ci1802Info.daySeries,
            }
        };
        const chartOptionTwo={
            id: "monthFlow",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    name:'@时间',
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
                    {type: 'value', name: "MB",axisLine:{show:false},axisTick:{show:false}},
                ],
                series:this.props.ci1802Info.monthSeries,
            }
        };
        return <div>
            <Card className="card">
            <header className="headBar">
                <div className="day">
                    <span className="dayLabel"> {'@日流量'}({parse(this.props.location.search).device_name})</span>
                </div>
                <div className="month">
                    <span>{'@本月流量'}: {this.props.ci1802Info.monthTotal} MB</span>
                </div>
                <div className="select">
                    <span>{'@请选择月份'}:&nbsp;</span>
                    <MonthPicker placeholder="@请选择月份" defaultValue={moment()} onChange={this.handleMonthChange}/>
                </div>
            </header>
            <BossLineChart {...chartOption}/>
            </Card>
            <Card className="card">
            <header className="headBar">
                <div className="day">
                    <span className="dayLabel">{'@月流量'}({parse(this.props.location.search).device_name})</span>
                </div>
            </header>
            <BossLineChart {...chartOptionTwo}/>
            </Card>
        </div>
    }
}

export default injectIntl(CI1802);
