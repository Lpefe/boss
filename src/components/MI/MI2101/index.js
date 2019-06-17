/*@运维-Pop点峰值负载率*/
import React from 'react';
import {Button, Card, DatePicker, Input, Tabs} from 'antd';
import moment from "moment";
import Reports from "./subComponent/Reports";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';

const TabPane = Tabs.TabPane;
const {MonthPicker, WeekPicker} = DatePicker;

class MI2101C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            tabKey: "1",
            start_tm: moment().subtract(0, 'days').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().subtract(0, 'days').endOf("day").format("YYYY-MM-DD HH:mm:ss"),
            company_id: sessionStorage.getItem("companyId"),
        };

    }

    componentDidMount() {

    }

    handleInputChange = (e) => {
        this.setState({
            name: e.target.value
        }, () => {
            if (this.state.name === "") {
                this.handleSearch()
            }
        })
    };

    handleSearch = () => {
        switch (this.state.tabKey) {
            case "1":
                this.ref1.get_line_top();
                break;
            case "2":
                this.ref2.get_line_top();
                break;
            case "3":
                this.ref3.get_line_top();
                break;
            default:
                break;
        }
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
                    vm.ref1.get_line_top();
                });
                break;
            case "2":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("week").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("week").format("YYYY-MM-DD HH:mm:ss")
                }, function () {
                    vm.ref2.get_line_top();
                });
                break;
            case "3":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("month").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("month").format("YYYY-MM-DD HH:mm:ss")

                }, function () {
                    vm.ref3.get_line_top();
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
        }, () => {
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_line_top();
                    break;
                case "2":
                    this.ref2.get_line_top();
                    break;
                case "3":
                    this.ref3.get_line_top();
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
        }, () => {
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_line_top();
                    break;
                case "2":
                    this.ref2.get_line_top();
                    break;
                case "3":
                    this.ref3.get_line_top();
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
        }, () => {
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_line_top();
                    break;
                case "2":
                    this.ref2.get_line_top();
                    break;
                case "3":
                    this.ref3.get_line_top();
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
                    <Input style={{width: 150, marginLeft: 8, marginRight: 8}} placeholder="@请输入关键字"
                           onChange={this.handleInputChange} allowClear/>
                    <Button onClick={this.handleSearch}>@搜索</Button>
                </div>
            </Card>
            <Card className="card">
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab={"@日报表"} key="1" forceRender>
                        <Reports onRef1={this.onRef1} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="1" selectedTabKey={this.state.tabKey}
                                 company_id={this.state.company_id} name={this.state.name}/>
                    </TabPane>
                    <TabPane tab={"@周报表"} key="2" forceRender>
                        <Reports onRef2={this.onRef2} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="2" selectedTabKey={this.state.tabKey}
                                 company_id={this.state.company_id} name={this.state.name}/>
                    </TabPane>
                    <TabPane tab={"@月报表"} key="3" forceRender>
                        <Reports onRef3={this.onRef3} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="3" selectedTabKey={this.state.tabKey}
                                 company_id={this.state.company_id} name={this.state.name}/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    }
}

export default injectIntl(MI2101C);