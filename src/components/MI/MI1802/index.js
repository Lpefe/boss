/*@运维-告警信息详情*/
import React from 'react';
import {Card} from 'antd';
import BossTable from "../../Common/BossTable";
import {parse} from '../../../utils/commonUtilFunc';
import {injectIntl} from "react-intl";
class MI1802C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        this.get_redis_alarm_log();
    }


    get_redis_alarm_log=()=>{
        this.props.dispatch({
            type:"mi1802Info/get_redis_alarm_log",
            payload:{
               alarm_id:parse(this.props.location.search).alarm_id
            }
        })
    };
    render() {
        const columns=[
            {
                title: "@处理时间",
                dataIndex: "deal_time",
                key: "deal_time",
            },{
                title: "@经办人",
                dataIndex: "username",
                key: "username",
            },{
                title: "@操作记录",
                dataIndex: "action",
                key: "action",
            },{
                title: "@结果反馈",
                dataIndex: "response",
                key: "response",
            },{
                title: "@日志下载地址",
                dataIndex: "log_address",
                key: "log_address",
                render:(text)=>{
                    return <a href={text}>{text}</a>
                }
            },{
                title: "@说明",
                dataIndex: "remark",
                key: "remark",
                render:(text,record)=>{
                    return `${record.remark},${record.reason}`
                }
            },];
        return (
            <Card className='card'>
               <BossTable columns={columns} dataSource={this.props.mi1802Info.alarmLogList}/>
            </Card>
        )
    }
}

export default injectIntl(MI1802C);