/**
 * 设备流量-用户排行榜-用户流量详情-应用排名
 **/
import React from 'react';
import {} from 'antd';
import * as echarts from "echarts";
import {Select} from "antd";
import {Input} from "antd";
import {Button} from "antd";
import {connect} from "dva";
import {withRouter} from "react-router-dom";
import {parse} from "../../../../../utils/commonUtilFunc";
import {chartColor, pieChartColor} from "../../../../../utils/commonConsts";

const Option = Select.Option;

class UserAppRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            top:"5",
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir = search.tunnel_dir;
        this.tunnel_dir_id=search.tunnel_dir_id;
        this.company_id=search.id;
        this.ifCompany=(sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")
    }

    componentDidMount() {
        this.element = echarts.init(document.getElementById('user-app-rank'));
        this.get_step_apps();
    }

    componentDidUpdate() {
        this.renderChart(this.element);
    }


    get_step_apps = () => {
        this.props.dispatch({
            type: "ci0303Info/get_step_apps",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn:this.sn,
                top:this.state.top,
                sip:this.props.selectedUserIp,
                name:this.state.name,
                company_id:this.ifCompany?this.company_id:sessionStorage.getItem("companyId"),
            }
        })
    };

    selectDataNum=(value)=>{
        let vm=this;
        vm.setState({
            top:value
        },function(){
            vm.get_step_apps();
        })
    };

    handleSearchInputChange=(e)=>{
        let vm=this;
        this.setState({
            name:e.target.value
        },()=>{
            if(this.state.name===""){
                vm.get_step_apps();
            }
        })
    };

    renderChart = (el) => {
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '7%',
                bottom: '10%',
                top: "5%",
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick:{show:false},
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                },
                name:"MB"
            },
            yAxis: {
                type: 'category',
                axisTick:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        type:"dashed",
                        color:"rgba(0,0,0,0.45)"
                    }
                },
                inverse:true
            },
            series: [
                {
                    name: '流量',
                    type: 'bar',
                    data: this.props.ci0303Info.step_apps_flow,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return pieChartColor[params.dataIndex % chartColor.length]
                            }
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
                    barCategoryGap: "60%",
                    barMinHeight: "10",
                    barMaxWidth:32
                },
            ],
            color: ["red", "yellow"]
        };
        el.setOption(option);
    };

    render() {
        return (
            <div>
                <Select placeholder="请选择数据条数" style={{width: 120, marginRight: 8, marginTop: 16}} className="input"
                        onChange={this.selectDataNum} defaultValue="5">
                    <Option value="5">@5条</Option>
                    <Option value="10">@10条</Option>
                    <Option value="15">@15条</Option>
                    <Option value="20">@20条</Option>
                </Select>
                <Input placeholder="请输入关键字" style={{width: 240, marginRight: 8}} className="input"
                       onChange={this.handleSearchInputChange}/>
                <Button onClick={this.get_step_apps}>搜索</Button>
                <div id="user-app-rank" style={{width: 900, height: 400}}>

                </div>
            </div>
        )
    }
}

function mapDispatchToProps({ ci0303Info }) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(UserAppRank));