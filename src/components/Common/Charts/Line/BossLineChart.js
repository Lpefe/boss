import React from 'react';
import PropTypes from 'prop-types';
import * as echarts from 'echarts/lib/echarts';
import moment from 'moment';
import {chartColor} from "../../../../utils/commonConsts";
import merge from 'deepmerge';

class BossLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {
        this.chart = echarts.init(document.getElementById(this.props.id));
        if(this.props.onClick){
            this.chart.on('click',this.props.onClick)
        }
        this.initChart(this.chart);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (JSON.stringify(nextProps.option) !== JSON.stringify(this.props.option))
    }

    componentDidUpdate() {
        this.initChart(this.chart)
    }


    initChart = (el) => {
        let option = {
            legend: {
                left: "center",
                bottom: 0,
                icon: "circle",
                type:"scroll",
                width:850,
            },
            grid: {
                left: '6%',
                right: '18%',
                bottom: '35%',
            },
            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'none',
                    bottom: 50,
                },
            ],
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: "rgba(0,0,0,0.45)"
                    }
                },
                axisTick: {show: false},
                splitLine: {
                    show: false
                },
            },
            yAxis: {
                axisTick: {show: false}, axisLine: {show: false},
            },
            color: chartColor,
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#333",
                extraCssText: 'box-shadow: 0 2px 2px 0 rgba(24,24,24,0.60);border-radius: 2px 2px 0 0 0 2px 2px;',
                formatter: function (data) {
                    let res = '';
                    if (moment.unix(data[0].axisValue / 1000).format("YYYY-MM-DD HH:mm:ss") === "Invalid date") {
                        for (let i = 0; i < data.length; i++) {
                            res += ('<tr><td><span style="display:inline-block;height:12px;lineheight:12px;font-size:32px;margin-top:5px;color:' + data[i].color + '">&middot;</span></td><td>' + data[i].seriesName + '</td><td>' + data[i].data[1] + '<td/><td>' + data[i].axisValue + '</td></tr>')
                        }
                        return '<div class="line-tooltip"><table class="line-tooltip-table" style="border-bottom: none">' + res + '<table/></div>'
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            res += ('<tr><td><span style="display:inline-block;height:12px;lineheight:12px;font-size:32px;margin-top:5px;color:' + data[i].color + '">&middot;</span></td><td>' + data[i].seriesName + '</td><td>' + data[i].data[1] + '<td/><td>' + data[i].data[0] + '</td></tr>')
                        }
                        return '<div class="line-tooltip"><table class="line-tooltip-table" style="border-bottom: none">' + res + '<table/></div>'
                    }

                },
                axisPointer: {
                    axis: 'x'
                },

            },
        };
        option = merge(option, this.props.option);
        el.setOption(option, {notMerge: this.props.ifNotMerge});
    };


    render() {
        return <div id={this.props.id} style={{width: this.props.containerWidth, height: this.props.containerHeight}}>

        </div>
    }
}

BossLineChart.propTypes = {
    id: PropTypes.string,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
    ifNotMerge: PropTypes.bool,
    onClick:PropTypes.func
};

BossLineChart.defaultProps = {
    containerWidth: document.body.clientWidth - 300,
    containerHeight: 720,
    ifNotMerge: true
};

export default BossLineChart;