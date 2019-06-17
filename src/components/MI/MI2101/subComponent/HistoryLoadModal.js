/*@运维-Pop点峰值负载率*/
import React from 'react';
import './HistoryLoadModal.scss';
import {connect} from 'dva';
import { Modal, Select} from 'antd';
import BossTable from "../../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import BossLineChart from "../../../Common/Charts/Line/BossLineChart";
import {injectIntl} from "react-intl";

const Option = Select.Option;

class HistoryLoadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history_start_tm:"",
            history_end_tm:"",
        }
    }

    componentDidMount() {

    }



    handleHistoryLoadModalTimeSelect=(value)=>{
        const parent=this.props.parent;
        const time=this.props.record.time*1000;
        let start_tm=moment(time).subtract(15,'minutes').format("YYYY-MM-DD HH:mm:ss");;
        let end_tm=moment(time).add(15,'minutes').format("YYYY-MM-DD HH:mm:ss");
        switch(value){
            case "1":
                start_tm=moment(time).subtract(15,'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm=moment(time).add(15,'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm=moment(time).subtract(30,'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm=moment(time).add(30,'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm=moment(time).subtract(3,'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm=moment(time).add(3,'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm=moment(time).subtract(12,'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm=moment(time).add(12,'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                break;
        }
        parent.setState({
            history_start_tm:start_tm,
            history_end_tm:end_tm,
        },()=>{
            parent.get_line_detail();
        })
    };

    handleSelectRank=(value)=>{
        const parent=this.props.parent;
        parent.setState({
            top:value
        },()=>{
            parent.get_line_tunnel();
        })
    };



    render() {
        const __ = this.props.intl.formatMessage;
        const record=this.props.record;
        const loadOption = [
            <Option value="1" key='1'>{"@前后15分钟"}</Option>,
            <Option value="2" key='2'>{"@前后半小时"}</Option>,
            <Option value="3" key='3'>{"@前后3小时"}</Option>,
            <Option value="4" key='4'>{"@前后12小时"}</Option>,
        ];

        const rankOption=[
            <Option value="1" key='1'>Top5</Option>,
            <Option value="2" key='2'>Top10</Option>,
        ];
        const columns=[{
            title: "@序号",
            dataIndex: 'index',
            key: 'index',
            render:(text,record,index)=>{
                return index+1;
            }
        },{
            title:"硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        },{
            title: "@链路名称",
            dataIndex: 'name',
            key: 'name',
        },{
            title: "@隧道ID",
            dataIndex: 'tid',
            key: 'tid',
        },{
            title: "@带宽(M)",
            dataIndex: 'band',
            key: 'band',
            render:(text)=>{
                return (text/1000).toFixed(2)
            }
        },{
            title: "@带宽占比(%)",
            dataIndex: 'percent',
            key: 'percent',
            render:(text,records)=>{
                return (records.band/10/record.bandwidth).toFixed(2)
            }
        },];
        const chartOption={
            id: "historyLoad",
            containerHeight: 400,
            option: {
                grid:{
                    left:"10%"
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name:"@时间",
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    },
                    min: this.state.history_start_tm||this.props.history_start_tm,
                    max: this.state.history_end_tm||this.props.history_end_tm,
                },
                yAxis: [
                    {type: 'value', name: "%",axisLine:{show:false},axisTick:{show:false}},
                ],
                series:this.props.mi2101Info.lineDetailSeries,
                legend:{
                    show:false
                }
            }
        };
        return <Modal style={{position: "relative"}} bodyStyle={{padding:0}} title="@历史负载率" visible={this.props.visible} onCancel={this.props.onCancel} width={750} footer={null} destroyOnClose={true}>
            <div className="history-modal-header">
                <h3>@机房名称:{record.room_name}</h3>
                <section>
                    <div>@发生时间:&nbsp;&nbsp;{moment(record.time*1000).format("YYYY-MM-DD HH:mm:ss")}</div>
                    <div>@峰值负载率:&nbsp;&nbsp;{record.percent}</div>
                    <div>ISP:&nbsp;&nbsp;{record.isp}</div>
                    <div>@带宽(M):&nbsp;&nbsp;{record.bandwidth}</div>
                </section>
            </div>
            <div className="history-modal-body">
                <Select style={{width: 200}} defaultValue="1" onChange={this.handleHistoryLoadModalTimeSelect}>
                    {loadOption}
                </Select>
                <BossLineChart {...chartOption} containerWidth={"110%"}/>
                <div className="divide-line" style={{height: 1}}/>
                <div>
                    <div className="table-title">@设备占用POP点线路带宽排行</div>
                    <Select style={{width: 100}} defaultValue="1" onChange={this.handleSelectRank}>
                        {rankOption}
                    </Select>
                </div>
                <BossTable columns={columns} dataSource={this.props.mi2101Info.lineTunnelDataSource}/>
            </div>
        </Modal>
    }
}


function mapDispatchToProps({mi2101Info}) {
    return {mi2101Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(HistoryLoadModal)))
