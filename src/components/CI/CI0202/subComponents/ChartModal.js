import React from 'react';
import '../../CI0101New/index.scss';
import {Modal, DatePicker, Button, } from 'antd';
import * as echarts from 'echarts';
import {connect} from 'dva';
import moment from 'moment';

const {RangePicker} = DatePicker

class ChartModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hell: "ass"
        }
    }

    componentDidMount() {

    }

    componentDidUpdate() {
        var trafficChartDom = document.getElementById("trafficChartDom");
        if (trafficChartDom) {
            this.drawChart();
        }
    }


    drawChart() {
        let trafficChartDom = document.getElementById("trafficChartDom");
        let trafficChart = echarts.init(trafficChartDom);
        let option1 = {
            tooltip: {
                trigger: "item"
            },
            title: {
                text: "流量数据",
                x: "center",
            },
            xAxis: {
                type: 'time',
                boundaryGap: [0, 0.01],
                name: "流量数据",
                nameLocation: "middle",
                nameGap: 30,
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
            yAxis: {
                type: 'value',
                name: "Mbps",
                nameLocation: "middle",
                nameGap: 50,
                axisTick:{show:false},axisLine:{show:false},
            },
            series: [{
                data: this.props.ci0202Info.chartData,
                type: 'line',
                smooth: true,
            }],
            color:['#E57E74 ','#128F07', '#FFCA25', '#0476FF',]
        };
        trafficChart.setOption(option1);
    }

    selectTimeInterval = (type) => {
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (type) {
            case 1:
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case 2:
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case 3:
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case 4:
                start_tm = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case 5:
                start_tm = moment().subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;

        }
        this.props.dispatch({
            type: "ci0202Info/getTunnelRateStat",
            payload: {
                item: "tunnel_rate",
                tid: this.props.id,
                start_tm: start_tm,
                end_tm: end_tm,
                companyid: sessionStorage.getItem("companyId")
            }
        })
    };

    changeDateRange=(dates)=>{
        this.props.dispatch({
            type: "ci0202Info/getTunnelRateStat",
            payload: {
                item: "tunnel_rate",
                tid: this.props.id,
                start_tm: dates[0].format("YYYY-MM-DD HH:mm:ss"),
                end_tm: dates[1].format("YYYY-MM-DD HH:mm:ss"),
                companyid: sessionStorage.getItem("companyId")
            }
        })
    };

    reset=()=>{
        this.props.dispatch({
            type:"ci0202Info/reset"
        })
    };

    render() {
        return (
            <Modal maskClosable={false} title={"flow_" + this.props.id} visible={this.props.ifChartVisible}
                   onCancel={this.props.cancel} width="75%" footer={null}>
                <div>
                    <RangePicker style={{marginRight: 8}} onChange={this.changeDateRange}/>
                    <Button style={{marginRight: 8}} onClick={() => this.selectTimeInterval(1)}>最近30分钟</Button>
                    <Button style={{marginRight: 8}} onClick={() => this.selectTimeInterval(2)}>最近6小时</Button>
                    <Button style={{marginRight: 8}} onClick={() => this.selectTimeInterval(3)}>最近24小时</Button>
                    <Button style={{marginRight: 8}} onClick={() => this.selectTimeInterval(4)}>最近一周</Button>
                    <Button style={{marginRight: 8}} onClick={() => this.selectTimeInterval(5)}>最近一个月</Button>
                    <Button onClick={this.reset}>清空</Button>
                </div>
                <div id="trafficChartDom" style={{height: 300, width: "100%",marginTop:24}}>23</div>
            </Modal>
        )
    }
}


function mapDispatchToProps({ci0202Info}) {
    return {ci0202Info};
}

export default connect(mapDispatchToProps)(ChartModal)