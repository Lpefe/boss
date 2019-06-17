/*@运维-操作日志*/
import React from 'react';
import {Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import moment from 'moment';
import {injectIntl} from "react-intl";
import {roleMap, viewChineseMap} from '../../../utils/commonUtilFunc'

class MI1701C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_time: moment().subtract(1, 'week').format("YYYY-MM-DD HH:mm:ss"),
            end_time: moment().format("YYYY-MM-DD HH:mm:ss"),
            name: "",
            page_no: 1,
            page_size: 20
        };


    }

    componentDidMount() {
        this.get_request_log();
    }

    get_request_log = () => {
        this.props.dispatch({
            type: "mi1701Info/get_request_log",
            payload: {
                start_time: this.state.start_time,
                end_time: this.state.end_time,
                name: this.state.name,
                page_no: this.state.page_no,
                page_size: this.state.page_size
            }
        })
    };

    handleSelectTimeRange = (dates) => {
        let vm = this;
        this.setState({
            start_time: dates[0].format("YYYY-MM-DD HH:mm:ss"),
            end_time: dates[1].format("YYYY-MM-DD HH:mm:ss"),
            page_no: 1
        }, function () {
            vm.get_request_log();
        })
    };

    handleSubmit = (value) => {
        let vm = this;
        this.setState({
            name: value,
            page_no: 1
        }, function () {
            vm.get_request_log();
        })
    };

    render() {
        const {mi1701Info}=this.props;
        const columns = [{
            title: "@时间",
            dataIndex: "create_time",
            key: "create_time",
        }, {
            title: "@账号",
            dataIndex: "username",
            key: "username",
        }, {
            title: "@用户角色",
            dataIndex: "role",
            key: "role",
            render:(text)=>{
                return roleMap(text)
            }
        }, {
            title: "@姓名",
            dataIndex: "person_name",
            key: "person_name",
        }, {
            title: "@动作",
            dataIndex: "view_chinese",
            key: "view_chinese",
            return:(text)=>{
                return viewChineseMap(text)
            }
        }, {
            title: "@备注",
            dataIndex: "remark",
            key: "remark",
        },];

        return (
            <Card className="card">
                <HeaderBar hasSearch={true} hasRangePicker={true} rangePickerMethod={this.handleSelectTimeRange}
                           dateRange={[moment().subtract(1, 'week'), moment()]} submit={this.handleSubmit}/>
                <BossTable columns={columns} dataSource={mi1701Info.logList} paging={true}
                           total={mi1701Info.total} component={this} getData={this.get_request_log}/>
            </Card>
        )
    }

}

export default injectIntl(MI1701C);