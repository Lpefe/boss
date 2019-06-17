/*@运维-链路负载率*/
import React from 'react';
import {Tabs, DatePicker, Checkbox, Card,Select} from 'antd';
import Reports from "./subComponent/Reports";
import moment from 'moment';
import {injectIntl} from "react-intl";
import {parse} from "../../../utils/commonUtilFunc";
const TabPane = Tabs.TabPane;
const {MonthPicker, WeekPicker} = DatePicker;
const CheckboxGroup = Checkbox.Group;
const Option=Select.Option;


class MI1401 extends React.Component {
    constructor(props) {
        super(props);
        const search=parse(this.props.location.search);
        this.state = {
            tabKey: "1",
            company_stat: "正式,试用",
            start_tm: moment().subtract(1, 'days').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().subtract(1, 'days').endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            company_id:search.company_id,
        }
    }

    componentDidMount() {
        this.get_company_list();
    }
    get_company_list=()=>{
        this.props.dispatch({
            type:"mi1401Info/get_company_list",
            payload:{
                status:this.state.company_stat
            }
        })
    };

    handleSelectCompany=(value)=>{
        this.setState({
            company_id:value||undefined
        },()=>{
            switch(this.state.tabKey){
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleTabChange = (key) => {
        let vm = this;
        switch (key) {
            case "1":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("day").format("YYYY-MM-DD HH:mm:ss")
                }, function () {
                    vm.ref1.get_band_load_all();
                });
                break;
            case "2":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("week").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("week").format("YYYY-MM-DD HH:mm:ss")
                }, function () {
                    vm.ref2.get_band_load_all();
                });
                break;
            case "3":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("month").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("month").format("YYYY-MM-DD HH:mm:ss")

                }, function () {
                    vm.ref3.get_band_load_all();
                });
                break;
            default:
                break;
        }

    };


    handleDayChange = (value) => {
        let startTime = moment(value).startOf("day").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("day").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleWeekChange = (value) => {
        let startTime = moment(value).startOf("week").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("week").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleMonthChange = (value) => {
        let startTime = moment(value).startOf("month").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("month").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleChangeCompanyStat = (values) => {
        this.setState({
            company_stat: values.join(","),
        },  ()=> {
            this.get_company_list();
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };
    onRef1 = (vm) => {
        this.ref1 = vm;
    };
    onRef2 = (vm) => {
        this.ref2 = vm;
    };
    onRef3 = (vm) => {
        this.ref3 = vm;
    };

    render() {
        const plainOptions = [
            {label: '@仅统计正式用户', value: '正式'},
            {label: '@仅统计试用用户', value: '试用'},
        ];
        return <div>
            <Card className="card">
                <div>
                    {(() => {
                        switch (this.state.tabKey) {
                            case "1":
                                return <DatePicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleDayChange}/>;
                            case "2":
                                return <WeekPicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleWeekChange}/>;
                            case "3":
                                return <MonthPicker defaultValue={moment().subtract(1, "day")}
                                                    onChange={this.handleMonthChange}/>;
                            default:
                                return <DatePicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleDayChange}/>;
                        }
                    })()}
                    <CheckboxGroup options={plainOptions} style={{marginLeft: 48}}
                                   defaultValue={this.state.company_stat.split(",")}
                                   onChange={this.handleChangeCompanyStat}/>
                    <Select style={{width:150}} placeholder="@请选择企业" value={this.state.company_id} onChange={this.handleSelectCompany} allowClear>
                        {this.props.mi1401Info.companyList.map((company)=>{
                            return <Option key={company.id} value={company.id.toString()}>{company.company_abbr}</Option>
                        })}
                    </Select>
                </div>
            </Card>
            <Card className="card">
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab={"@日报表"} key="1" forceRender>
                        <Reports onRef1={this.onRef1} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="1" selectedTabKey={this.state.tabKey} company_id={this.state.company_id}/>
                    </TabPane>
                    <TabPane tab={"@周报表"} key="2" forceRender>
                        <Reports onRef2={this.onRef2} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="2" selectedTabKey={this.state.tabKey} company_id={this.state.company_id}/>
                    </TabPane>
                    <TabPane tab={"@月报表"} key="3" forceRender>
                        <Reports onRef3={this.onRef3} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="3" selectedTabKey={this.state.tabKey} company_id={this.state.company_id}/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    }
}

export default injectIntl(MI1401);