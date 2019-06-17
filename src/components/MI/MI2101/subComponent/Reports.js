/*@运维-Pop点峰值负载率*/
import React from 'react';
import './Reports.scss';
import {connect} from 'dva';
import {Table} from 'antd';
import BossTable from "../../../Common/BossTable";
import { withRouter} from 'react-router-dom';
import moment from 'moment';
import {injectIntl} from "react-intl";
import {parse} from '../../../../utils/commonUtilFunc';
import HistoryLoadModal from "./HistoryLoadModal";


class Reports extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            ifShowDetail: true,
            order: "top",
            range: search.range || "80-100",
            companyBandLoadModalShow: false,
            bandLoadChartShow: false,
            company_id: "",
            start_tm: "",
            end_tm: "",
            time: "",
            tid: "",
            company_name: "",
            name: "",
            percent: "",
            historyModalShow:false,
            editId:"",
            editRecord:{},
            top:5
        }
    }

    componentDidMount(){
        const search = parse(this.props.location.search);
        this.get_line_top(search.range ? "All" : undefined);
        if (this.props.tabKey === "1") {
            this.props.onRef1(this);
        } else if (this.props.tabKey === "2") {
            this.props.onRef2(this);
        } else if (this.props.tabKey === "3") {
            this.props.onRef3(this);
        }
    }


    handleChangeOrder = (e) => {
        let vm = this;
        this.setState({
            order: e.target.value
        }, function () {
            vm.get_line_top();
        })
    };

    get_line_top = (ifAll) => {
        this.props.dispatch({
            type: "mi2101Info/get_line_top",
            payload: {
                order: this.state.order,
                /*limit: ifAll ? "" : 20,*/
                range: this.state.range,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                vm: this,
                name:this.props.name
            }
        })
    };


    handleTableDisplayChange = () => {
        let vm = this;
        this.setState({
            ifShowDetail: false,
            range: ""
        }, function () {
            vm.get_line_top();
        })
    };

    handleChooseLinkNumber = (value) => {
        let vm = this;
        this.setState({
            ifShowDetail: true,
            range: value
        }, function () {
            vm.get_line_top("all");
        })
    };



    handleCheckBandLoadChart = (record) => {
        let vm = this;
        this.setState({
            bandLoadChartShow: true,
            company_id: record.company_id,
            start_tm: moment(record.time * 1000).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment(record.time * 1000).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            time: moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss"),
            tid: record.tid,
            company_name: record.company_abbr,
            name: record.name,
            percent: record.percent,
        }, function () {
            vm.get_band_load();
        })
    };
    handleCheckBandLoadChartClose = () => {
        this.setState({
            bandLoadChartShow: false,
            company_id: "",
            start_tm: "",
            end_tm: "",
            time: "",
            tid: "",
            company_name: "",
            name: "",
            percent: "",
        })
    };

    get_band_load = () => {
        this.props.dispatch({
            type: "mi1401Info/get_band_load",
            payload: {
                companyid: this.state.company_id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                tid: this.state.tid
            }
        })
    };


    handleChartModalTimeSelect = (value) => {
        let vm = this;
        let start_tm = "";
        let end_tm = "";
        let time = this.state.time;
        switch (value) {
            case "1":
                start_tm = moment(time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment(time).subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm = moment(time).subtract(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm = moment(time).subtract(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "5":
                start_tm = moment(time).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "6":
                start_tm = moment(time).subtract(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm
        }, function () {
            vm.get_band_load();
        })
    };

    handleOpenHistoryModal=(record)=>{
        this.setState({
            historyModalShow:true,
            editRecord:record,
            recordId:record.id,
            history_start_tm:moment(record.time*1000).subtract(15,'minutes').format("YYYY-MM-DD HH:mm:ss"),
            history_end_tm:moment(record.time*1000).add(15,'minutes').format("YYYY-MM-DD HH:mm:ss"),
        },()=>{
            this.get_line_detail();
            this.get_line_tunnel();
        })
    };

    handleCloseHistoryModal=()=>{
        this.setState({
            historyModalShow:false,
            editRecord:{},
            recordId:""
        })
    };

    get_line_detail=()=>{
        this.props.dispatch({
            type:"mi2101Info/get_line_detail",
            payload:{
                sn:this.state.editRecord.sn,
                isp:this.state.editRecord.isp,
                start_tm:this.state.history_start_tm,
                end_tm:this.state.history_end_tm,
                bandwidth:this.state.editRecord.bandwidth
            }
        })
    };

    get_line_tunnel=()=>{
        this.props.dispatch({
            type:"mi2101Info/get_line_tunnel",
            payload:{
                sn:this.state.editRecord.sn,
                isp:this.state.editRecord.isp,
                start_tm:moment(this.state.editRecord.time*1000).format("YYYY-MM-DD HH:mm:ss"),
                top:this.state.top,
            }
        })
    };

    render() {
        const columns = [{
            title: 'title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            align: "center",
            render: (index, record) => {
                return <span className="loading-title">{record.title}</span>
            }
        }, {
            title: '0',
            dataIndex: '0',
            key: '0',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("0")}>{record["0"]}</span>
            }
        }, {
            title: '0-20',
            dataIndex: '1',
            key: '1',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("0-20")}>{record["1"]}</span>
            }
        }, {
            title: '20-40',
            dataIndex: '2',
            key: '2',
            width: 120,
            align: "center",
            render: (text, record, index) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("20-40")}>{record["2"]}</span>
            }
        }, {
            title: '40-60',
            dataIndex: '3',
            key: '3',
            width: 120,
            align: "center",
            render: (text, record) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("40-60")}>{record["3"]}</span>
            }
        }, {
            title: '60-80',
            dataIndex: '4',
            key: '4',
            width: 120,
            align: "center",
            render: (text, record) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("60-80")}>{record["4"]}</span>
            }
        }, {
            title: '80-100',
            dataIndex: '5',
            key: '5',
            width: 120,
            align: "center",
            render: (text, record) => {
                return <span className="table-range-number"
                             onClick={() => this.handleChooseLinkNumber("80-100")}>{record["5"]}</span>
            }
        }];
        const detailColumns = [{
            title: "@TWS名称",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',

        }, {
            title: "@运营商",
            dataIndex: 'isp',
            key: 'isp',
        }, {
            title: '@线路带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',

        }, {
            title: '@预分配带宽(M)',
            dataIndex: 'pre',
            key: 'pre',
        }, {
            title: "@峰值带宽(M)",
            dataIndex: 'band',
            key: 'band',
            render:(text)=>{
                return text/1000
            }
        }, {
            title: '@峰值负载率(%)',
            dataIndex: 'percent',
            key: 'percent',
            render:(text,record)=>{
                return <span style={{color:"#1890FF",cursor:"pointer"}} onClick={()=>this.handleOpenHistoryModal(record)}>{text}</span>
            }
        }, {
            title: '@发生时间',
            dataIndex: 'time',
            key: 'time',
            render:(text)=>{
                return moment(text*1000).format("YYYY-MM-DD HH:mm:ss")
            }
        },];
        return <div style={{position: "relative"}}>
            <div style={{display: "inline-block"}}>
                <Table columns={columns} bordered={true} showHeader={false}
                       pagination={false}
                       className="rowTest" dataSource={this.props.mi2101Info.stat}/>
            </div>
            <div style={{height: 1, background: "rgba(0,0,0,0.09)", marginTop: 12}}/>
            <div>
                <div className="range-title">{"@峰值负载率在"}{this.state.range}%{"@范围的链路"}</div>
                <BossTable columns={detailColumns} dataSource={this.props.mi2101Info.popBandwidthList}/>
            </div>
            <HistoryLoadModal visible={this.state.historyModalShow} onCancel={this.handleCloseHistoryModal} record={this.state.editRecord} parent={this} history_start_tm={this.state.history_start_tm} history_end_tm={this.state.history_end_tm}/>
        </div>
    }
}


function mapDispatchToProps({mi2101Info}) {
    return {mi2101Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(Reports)))
