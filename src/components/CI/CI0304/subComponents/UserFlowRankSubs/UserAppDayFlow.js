/**
 * 设备流量-用户排行榜-用户流量详情-日流量趋势图
 **/
import React from 'react';
import {DatePicker} from 'antd';
import moment from "moment";
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
const RangePicker=DatePicker.RangePicker;


class UserAppDayFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {

    }

    render() {
        const chartOption={
            id: "dayFlow",
            containerHeight: 400,
            containerWidth:800,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name:"时间",
                    min:moment(this.state.start_tm).format("YYYY-MM-DD"),
                    max:moment(this.state.end_tm).format("YYYY-MM-DD"),
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
                series:[],
            }
        };
        return (
            <div>
                <RangePicker/>
                <BossLineChart {...chartOption}/>
            </div>
        )
    }
}

export default UserAppDayFlow;