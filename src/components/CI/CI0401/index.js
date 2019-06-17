/*@客户-日流量*/
import React from 'react';
import './index.scss';
import { Icon,Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import HistoryFlowModal from "./subComponents/HistoryFlowModal";
import {parse} from "../../../utils/commonUtilFunc";
import BossTable from "../../Common/BossTable";
import moment from "moment";
import { injectIntl,} from 'react-intl';


class CI0401 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifModalShow:false,
            startTime:undefined,
            endTime:undefined,
            topo_id:"",
            name:"",
            deduplication:"",
        };
        let companyid = "";
        if (parse(this.props.location.search).id) {
            companyid = parse(this.props.location.search).id
        } else {
            companyid = sessionStorage.getItem("companyId")
        }
        this.companyid = companyid;
    }

    componentDidMount(){
        this.props.dispatch({
            type:"ci0401Info/init",
            payload:{
                company_id:this.companyid,
            }
        })
    }

    checkRate=(record)=>{
        let vm=this;
        this.setState({
            ifModalShow:true,
            link_id:record.id,
            deduplication:record.deduplication
        },function(){
            vm.props.dispatch({
                type:"ci0401Info/getHistoryRate",
                payload:{
                    link_id:record.id,
                    start_time:moment().subtract(7,"days").format("YYYY-MM-DD"),
                    end_time:moment().format("YYYY-MM-DD")
                }
            })
        })
    };



    cancelCheckRate=()=>{
        this.setState({
            ifModalShow:false,
            link_id:"",
            deduplication:""
        })
    };

    searchTopo=(value)=>{
        this.setState({
            name:value,
        },function(){
            this.props.dispatch({
                type:"ci0401Info/init",
                payload:{
                    company_id:this.companyid,
                    name:this.state.name
                }
            })
        })
    };

    render() {
        const columns = [{
            title: '@链路名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '@原始数据流量(MB)',
            dataIndex: 'origin',
            key: 'origin',
            render:(index,record)=>{
                return <span>{(record.origin/1024/1024).toFixed(2)}</span>
            }
        },{
            title: '@去重率(%)',
            dataIndex: 'dedup_percent',
            key: 'dedup_percent',
            render:(index,record)=>{
                return record.dedup!==0?(<span>{(100*(record.dedup_raw-record.dedup)/record.dedup_raw).toFixed(2)}</span>):(<span>0</span>)
            }
        },{
            title: '@压缩率(%)',
            dataIndex: 'compress_percent',
            key: 'compress_percent',
            render:(index,record)=>{
                return record.rate!==0?(<span>{(100*(record.rate-record.drate)/record.rate).toFixed(2)}</span>):(<span>0</span>)
            }
        },{
            title: '@历史流量',
            dataIndex: 'company_name',
            key: 'company_name',
            width:100,
            align:"center",
            render:(index,record)=>{
                return (
                    <Icon onClick={()=>this.checkRate(record)} type="line-chart" style={{color:"#3b96ff"}}/>
                )
            }
        },];


        const pagination={
            pageSize:10
        };
        return (
            <Card className="card">
                <HeaderBar hasSearch={true} hasDelete={false} submit={this.searchTopo}/>
                <BossTable pagination={pagination} columns={columns} dataSource={this.props.ci0401Info.dataSource}/>
                <HistoryFlowModal link_id={this.state.link_id} ifModalShow={this.state.ifModalShow} cancel={this.cancelCheckRate} deduplication={this.state.deduplication} destroyOnClose/>
            </Card>
        )
    }
}

export default injectIntl(CI0401);