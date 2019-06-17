/*客户-数据压缩分析*/
import React from 'react';
import './index.scss';
import {Select,DatePicker} from 'antd';
import AgencyFlowwStat from './subComponents/AgencyFlowStat';
import moment from 'moment';
const Option=Select.Option;
const RangePicker=DatePicker.RangePicker;


class CI1301 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return <div>
            <header>
                <Select placeholder="@请选择时间间隔" style={{width: 120, marginRight: 8}} className="input"
                        onChange={this.selectTimeInterval} defaultValue="0">
                    <Option value="0">@最近30分钟</Option>
                    <Option value="1">@最近六小时</Option>
                    <Option value="2">@最近24小时</Option>
                    <Option value="3">@最近一周</Option>
                </Select>
                <Select placeholder="@请选择数据条数" style={{width: 120, marginRight: 8}} className="input"
                        onChange={this.selectDataNum} defaultValue="5">
                    <Option value="5">@5条</Option>
                    <Option value="10">@10条</Option>
                    <Option value="15">@15条</Option>
                    <Option value="20">@20条</Option>
                </Select>
                <RangePicker style={{marginRight: 8}} onChange={this.selectTimeRange} showTime
                             format="YYYY-MM-DD HH:mm:ss"
                             value={[moment(this.state.start_tm), moment(this.state.end_tm)]}/>
            </header>
            <AgencyFlowwStat/>
        </div>
    }
}

export default CI1301;