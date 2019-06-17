/*@客户-设备流量*/
import React from 'react';
import {DatePicker} from 'antd';
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import moment from "moment";
import {connect} from "dva";
import {withRouter} from "react-router-dom";
import {parse} from "../../../../../utils/commonUtilFunc";

const RangePicker = DatePicker.RangePicker;

class DayFlowChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_tm: moment().subtract(6, 'days'),
            end_tm: moment(),
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir_id = search.tunnel_dir_id;

    }

    componentDidMount() {
        this.get_dpi_days();

    }

    get_dpi_days = () => {
        let payload = {
            start_tm: moment(this.state.start_tm).format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment(this.state.end_tm).format("YYYY-MM-DD HH:mm:ss"),
            tunnel_dir: this.tunnel_dir_id,
            sn:this.sn
        };
        if (this.props.ids !== undefined) {
            payload.ids = this.props.ids;
        }
        if (this.props.sip) {
            payload.sip = this.props.sip;
        }
        this.props.dispatch({
            type: "ci0303Info/get_dpi_days",
            payload: payload
        })
    };

    handleRangePickerChange = (dates) => {
        let vm = this;
        this.setState({
            start_tm: moment(dates[0]).format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment(dates[1]).format("YYYY-MM-DD HH:mm:ss")
        }, ()=> {
            vm.get_dpi_days();
        })
    };

    render() {
        const chartOption = {
            id: "dayFlow",
            containerHeight: 400,
            containerWidth: 850,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: "@时间",
                    min: moment(this.state.start_tm).format("YYYY-MM-DD"),
                    max: moment(this.state.end_tm).format("YYYY-MM-DD"),
                    axisTick: {show: false},
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: "rgba(0,0,0,0.45)"
                        }
                    }
                },
                grid: {
                    left: '6%',
                    right: '6%',
                    bottom: '35%',
                },
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {show: false,lineStyle: {
                                color: "rgba(0,0,0,0.45)"
                            }},
                        name: "@日流量(MB)",
                        axisTick: {show: false},
                    },
                ],
                series: {
                    type: "line",
                    name: "@日流量(MB)",
                    data: this.props.ci0303Info.appDayFlowData,
                    showSymbol: false
                },
            }
        };
        return (
            <div>
                <RangePicker defaultValue={[this.state.start_tm, this.state.end_tm]}
                             onChange={this.handleRangePickerChange}/>
                <BossLineChart {...chartOption}/>
            </div>
        )
    }
}

function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(DayFlowChart));