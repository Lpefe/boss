/*@客户-设备流量*/
import React from 'react';
import {Select} from 'antd';
import {commonTranslate, parse} from "../../../../../utils/commonUtilFunc";
import messages from "../../LocaleMsg/messages";
import {Input} from "antd";
import {Button} from "antd";
import BossTable from "../../../../Common/BossTable";
import {connect} from "dva";
import {withRouter} from "react-router-dom";
import {injectIntl} from "react-intl";

const Option=Select.Option;

class DesIpFlowChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            top: "5"
        };
        let search = parse(this.props.location.search);
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir=search.tunnel_dir_id;
        this.sn=search.sn;

    }

    componentDidMount() {
        this.get_dpi_dstrank();
    }

    get_dpi_dstrank = () => {
        this.props.dispatch({
            type: "ci0303Info/get_dpi_dstrank",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                ids: this.props.ids,
                top: this.state.top,
                dip:this.state.name,
                sn:this.sn,
                tunnel_dir:this.tunnel_dir
            }
        })
    };

    selectDataNum = (value) => {
        let vm=this;
        this.setState({
            top:value,
        },function(){
            vm.get_dpi_dstrank();
        })
    };

    handleSearchInputChange=(e)=>{
        this.setState({
            name:e.target.value
        })
    };

    render() {
        const __=commonTranslate(this);
        const columns = [
            {
                title: '@目标IP',
                dataIndex: 'dip',
                key: 'dip',
            }, {
                title: '@目标端口',
                dataIndex: 'dport',
                key: 'dport',
            }, {
                title: '@流量'+'MB',
                dataIndex: 'flow',
                key: 'flow',
                render:(text)=>{
                    return (text/1024/1024).toFixed(4)
                }
            }, {
                title: '@流量占比'+'(%)',
                dataIndex: 'percent',
                key: 'percent',
                render:(text,record)=>{
                    return (100*record.flow/1024/1024/this.props.flow).toFixed(2)
                }
            },];
        return (
            <div>
                <Select placeholder={"@请选择数据条数"} style={{width: 120, marginRight: 8, marginTop: 16}} className="input"
                        onChange={this.selectDataNum} defaultValue="5">
                    <Option value="5">@5条</Option>
                    <Option value="10">@10条</Option>
                    <Option value="15">@15条</Option>
                    <Option value="20">@20条</Option>
                </Select>
                <Input placeholder={"@请输入关键字"} style={{width: 240, marginRight: 8}} className="input" onChange={this.handleSearchInputChange}/>
                <Button onClick={this.get_dpi_dstrank}>{"@搜索"}</Button>
                <BossTable columns={columns} style={{marginTop: 16}} dataSource={this.props.ci0303Info.dpiDstRankTableDataSource}/>
            </div>
        )
    }
}

function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(DesIpFlowChart)));