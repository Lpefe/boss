/*@客户-设备流量*/
import React from 'react';
import {Select, Input, Button} from "antd";
import BossTable from "../../../../Common/BossTable";
import {commonTranslate, parse} from "../../../../../utils/commonUtilFunc";
import {withRouter} from "react-router-dom";
import {connect} from "dva";
import messages from '../../LocaleMsg/messages';
import {injectIntl} from "react-intl";
const Option = Select.Option;


class UserFlowRankTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            top: "5"
        };
        let search = parse(this.props.location.search);
        this.sn = search.sn;
        this.start_tm = search.start_tm;
        this.end_tm = search.end_tm;
        this.tunnel_dir_id = search.tunnel_dir_id;
        this.id=search.id;
        this.ifCompany=(sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")
    }

    componentDidMount() {
        this.get_users_dpi();
    }

    get_users_dpi = () => {
        this.props.dispatch({
            type: "ci0303Info/get_users_dpi",
            payload: {
                start_tm: this.start_tm,
                end_tm: this.end_tm,
                tunnel_dir: this.tunnel_dir_id,
                sn: this.sn,
                ids: this.props.ids,
                top: this.state.top,
                sip:this.state.name,
                companyid:this.ifCompany?this.id:sessionStorage.getItem("companyId"),
            }
        })
    };

    selectDataNum = (value) => {
        let vm=this;
        this.setState({
            top:value,
        },function(){
            vm.get_users_dpi();
        })
    };

    handleSearchInputChange=(e)=>{
        this.setState({
            name:(e.target.value).replace(/(^\s*)|(\s*$)/g, "")
        })
    };

    render() {
        const columns = [
            {
                title: '@用户IP地址',
                dataIndex: 'sip',
                key: 'sip',
            }, {
                title: '@MAC地址',
                dataIndex: 'mac',
                key: 'mac',
            }, {
                title: '@流量MB',
                dataIndex: 'flow',
                key: 'flow',
                render:(text)=>{
                    return (text/1024/1024).toFixed(4)
                }
            }, {
                title: '@流量占比(%)',
                dataIndex: 'percent',
                key: 'percent',
                render:(text,record)=>{
                    return (((record.flow/1024/1024/this.props.flow)*100).toFixed(2))
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
                <Button onClick={this.get_users_dpi}>{"@搜索"}</Button>
                <BossTable columns={columns} style={{marginTop: 16}} dataSource={this.props.ci0303Info.userFlowRankTableDataSource}/>
            </div>
        )
    }
}


function mapDispatchToProps({ci0303Info}) {
    return {ci0303Info};
}

export default connect(mapDispatchToProps)(withRouter(injectIntl(UserFlowRankTab)));