/*@运维-链路负载率*/
import React from 'react';
import './Reports.scss';
import {connect} from 'dva';
import { Table, Radio, Modal, Select, Row, Col} from 'antd';
import BossTable from "../../../Common/BossTable";
import {Link,withRouter} from 'react-router-dom';
import moment from 'moment';
import BossLineChart from "../../../Common/Charts/Line/BossLineChart";
import {injectIntl} from "react-intl";
import {parse} from '../../../../utils/commonUtilFunc';
const RadioGrp = Radio.Group;
const Option = Select.Option;

class Reports extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            ifShowDetail: true,
            order: "top",
            range: search.range||"80-100",
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
        }
    }

    componentDidMount() {
        const search=parse(this.props.location.search);
        this.get_band_load_all(search.range?"All":undefined);
        if(this.props.tabKey==="1"){
            this.props.onRef1(this);
        }else if(this.props.tabKey==="2"){
            this.props.onRef2(this);
        }else if(this.props.tabKey==="3"){
            this.props.onRef3(this);
        }
    }



    handleChangeOrder = (e) => {
        let vm=this;
        this.setState({
            order: e.target.value
        },function(){
            vm.get_band_load_all();
        })
    };

    get_band_load_all = (ifAll) => {
        this.props.dispatch({
            type: "mi1401Info/get_band_load_all",
            payload: {
                order: this.state.order,
                limit: ifAll?"":20,
                company_status: this.props.company_stat,
                range: this.state.range,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
                company_id:this.props.company_id||"",
                vm:this,
            }
        })
    };

    get_band_load_all_company = (company_id) => {
        this.props.dispatch({
            type: "mi1401Info/get_band_load_all_company",
            payload: {
                company_id: company_id,
                start_tm: this.props.start_tm,
                end_tm: this.props.end_tm,
            }
        })
    };

    handleTableDisplayChange = () => {
        let vm=this;
        this.setState({
            ifShowDetail: false,
            range: ""
        },function(){
            vm.get_band_load_all();
        })
    };

    handleChooseLinkNumber = (value) => {
        let vm=this;
        this.setState({
            ifShowDetail: true,
            range: value
        },function(){
            vm.get_band_load_all("all");
        })
    };

    handleCheckCompanyBandLoadInfo = (record) => {
        let vm=this;
        this.setState({
            company_id: record.company_id,
            companyBandLoadModalShow: true
        }, function () {
            vm.get_band_load_all_company(this.state.company_id)
        })
    };

    handleCheckCompanyBandLoadInfoClose = () => {
        this.setState({
            company_id: "",
            companyBandLoadModalShow: false
        })
    };

    handleCheckBandLoadChart = (record) => {
        let vm=this;
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
            type:"mi1401Info/get_band_load",
            payload: {
                companyid: this.state.company_id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                tid: this.state.tid
            }
        })
    };


    handleChartModalTimeSelect = (value) => {
        let vm=this;
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
            start_tm:start_tm,
            end_tm:end_tm
        },function(){
            vm.get_band_load();
        })
    };

    render() {
        const isBusiness=sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin";
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

        const rangeColumns = [{
            title: '@序号',
            dataIndex: 'title',
            key: 'title',
            render: (text, record, index) => {
                return index + 1
            }
        }, {
            title: '@链路名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
            render: (text, record) => {
                return <Link to={{
                    pathname: isBusiness?"/main/bi0401/bi0402":"/main/mi0501/mi0502",
                    search: "?id=" + record.tid + "&company_id=" + record.company_id + "&sn=" + record.sn + "&device_id=" + record.device_id + "&name=" + record.name + "&from=load&percent=" + record.percent + "&time=" + moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")+"&bandwidth="+record.bandwidth
                }}>{record.name}</Link>
            }
        }, {
            title: '@链路状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
            render: (text, record) => {
                return <span style={{color: "#1890ff", cursor: "pointer"}}
                             onClick={() => this.handleCheckCompanyBandLoadInfo(record)}>{record.company_abbr}</span>
            }
        }, {
            title: '@客户状态',
            dataIndex: 'company_status',
            key: 'company_status',
        }, {
            title: '@峰值负载率'+'(%)',
            dataIndex: 'percent',
            key: 'percent',
            render: (text, record) => {
                return <span style={{color: "#1890ff", cursor: "pointer"}}
                             onClick={() => this.handleCheckBandLoadChart(record)}>{record.percent}%</span>
            }
        }, {
            title: '@带宽'+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@发生时间',
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")
            }
        }];
        const detailColumns = [{
            title: '@链路名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
            render: (text, record) => {
                return <Link to={{
                    pathname: isBusiness?"/main/bi0401/bi0402":"/main/mi0501/mi0502",
                    search: "?id=" + record.tid + "&company_id=" + record.company_id + "&sn=" + record.sn + "&device_id=" + record.device_id + "&name=" + record.name + "&from=load&percent=" + record.percent + "&time=" + moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                }}>{record.name}</Link>
            }
        }, {
            title: '@链路状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
            render: (text, record) => {
                return <span style={{color: "#1890ff", cursor: "pointer"}}
                             onClick={() => this.handleCheckCompanyBandLoadInfo(record)}>{record.company_abbr}</span>
            }
        }, {
            title: '@客户状态',
            dataIndex: 'company_status',
            key: 'company_status',
        }, {
            title: '@峰值负载率'+'(%)',
            dataIndex: 'percent',
            key: 'percent',
            render: (text, record) => {
                return <span style={{color: "#1890ff", cursor: "pointer"}}
                             onClick={() => this.handleCheckBandLoadChart(record)}>{record.percent}%</span>
            }
        }, {
            title: '@带宽'+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@发生时间',
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")
            }
        }];
        const detailColumnsCompany = [{
            title: '@链路名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
            render: (text, record) => {
                return record.device_id?<Link to={{
                    pathname: isBusiness?"/main/bi0401/bi0402":"/main/mi0501/mi0502",
                    search: "?id=" + record.tid + "&company_id=" + record.company_id + "&sn=" + record.sn + "&device_id=" + record.device_id + "&name=" + record.name + "&from=load&percent=" + record.percent + "&time=" + moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")
                }}>{record.name}</Link>:<span>{record.name}</span>
            }
        }, {
            title: '@链路状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
            render: (text, record) => {
                return <span onClick={() => this.handleCheckCompanyBandLoadInfo(record)}>{record.company_abbr}</span>
            }
        }, {
            title: '@客户状态',
            dataIndex: 'company_status',
            key: 'company_status',
        }, {
            title: '@峰值负载率'+'(%)',
            dataIndex: 'percent',
            key: 'percent',
            render: (text, record) => {
                return <span style={{color: "#1890ff", cursor: "pointer"}}
                             onClick={() => this.handleCheckBandLoadChart(record)}>{record.percent}%</span>
            }
        }, {
            title: '@带宽'+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '@发生时间',
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return moment(record.time * 1000).format("YYYY-MM-DD HH:mm:ss")
            }
        }];

        const chartOption = {
            id: "bandLoadChart",
            containerHeight: 400,
            containerWidth: 750,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: "@时间",
                    axisTick:{show:false},
                    min: moment(this.state.start_tm).format("YYYY-MM-DD HH:mm:ss"),
                    max: moment(this.state.end_tm).format("YYYY-MM-DD HH:mm:ss"),
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
                    {type: 'value', name: "%",axisLine:{show:false},axisTick:{show:false}},
                ],
                series: this.props.mi1401Info.bandLoadChartSeries,
            }
        };

        const loadOption = [
            <Option value="1" key='1'>{"@前后15分钟"}</Option>,
            <Option value="2" key='2'>{"@前后半小时"}</Option>,
            <Option value="3" key='3'>{"@前后3小时"}</Option>,
            <Option value="4" key='4'>{"@前后12小时"}</Option>,
            <Option value="5" key='5'>{"@前后1天"}</Option>,
            <Option value="6" key='6'>{"@前后3天"}</Option>
        ];
        return <div style={{position: "relative"}}>
            <div style={{display: "inline-block"}}>
                <Table columns={columns} bordered={true} showHeader={false} dataSource={this.props.mi1401Info.stat}
                       pagination={false}
                       className="rowTest"/>
            </div>
            <div style={{height: 1, background: "rgba(0,0,0,0.09)", marginTop: 12}}/>
            {!this.state.ifShowDetail ? <div>
                <div className="range-title">{"@峰值负载率排行榜"}</div>
                <RadioGrp style={{marginBottom: 24}} defaultValue={this.state.order} onChange={this.handleChangeOrder}>
                    <Radio value="top">
                        {"@峰值负载率"}Top20
                    </Radio>
                    <Radio value="last">
                       {"@峰值负载率"}Last20
                    </Radio>
                </RadioGrp>
                <BossTable columns={rangeColumns} dataSource={this.props.mi1401Info.linkList} pagination={false}/>
            </div> : <div>
                <div className="range-title">{"@峰值负载率在"}{this.state.range}%{"@范围的链路"}</div>
                <BossTable columns={detailColumns} dataSource={this.props.mi1401Info.linkList}/>
            </div>}
            <Modal visible={this.state.companyBandLoadModalShow} onCancel={this.handleCheckCompanyBandLoadInfoClose} width={750}
                   title={"@本企业所有链路峰值负载率清单"}>
                <BossTable columns={detailColumnsCompany} dataSource={this.props.mi1401Info.linkListCompany}/>
            </Modal>
            <Modal visible={this.state.bandLoadChartShow} onCancel={this.handleCheckBandLoadChartClose} title={"@历史负载率"}
                   footer={null} width={750} destroyOnClose>
                <section style={{marginBottom: 16}}>
                    <div className="band-load-title">{this.state.name}</div>
                    <Row>
                        <Col span={8}><span className="band-load-sub">{"@企业名称"}:{this.state.company_name}</span></Col>
                        <Col span={8}><span className="band-load-sub">{"@峰值负载率"}:{this.state.percent} %</span></Col>
                        <Col span={8}><span className="band-load-sub">{"@发生时间"}:{this.state.time}</span></Col>
                    </Row>
                </section>
                <Select style={{width: 200}} defaultValue="1" onChange={this.handleChartModalTimeSelect}>
                    {loadOption}
                </Select>
                <BossLineChart {...chartOption}/>
            </Modal>


        </div>
    }
}


function mapDispatchToProps({mi1401Info}) {
    return {mi1401Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(Reports)))
