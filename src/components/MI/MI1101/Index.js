/*@运维-运营商信息*/

import React from 'react';
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import EditModal from "./subComponents/EditModal";
import BossTable from "../../Common/BossTable";
import {Card} from 'antd';
import {injectIntl} from "react-intl";

class MI1101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditModal:false,
            record:{},
            recordId:""
        }
    }

    componentDidMount(){
        this.get_isp_dict();
    }

    get_isp_dict=()=>{
        this.props.dispatch({
            type:"mi1101Info/get_isp_dict",
            payload:{

            }
        })
    };
    handleOpenEditModal=(record)=>{
        this.setState({
            showEditModal:true,
            record:record,
            recordId:record.id
        })
    };
    handleCloseEditModal=()=>{
        this.setState({
            showEditModal:false,
            record:{},
            recordId:""
        })
    };

    deleteIspList=(record)=>{
        this.props.dispatch({
            type:"mi1101Info/delete_isp_dict",
            payload:{
                id:record.id,
                records:[record]
            }
        })
    };

    render(){
        const __=this.props.intl.formatMessage;
        const columns=[
            {
                title: '@名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '@代码',
                dataIndex: 'code',
                key: 'cpde',
            },{
                title: '@备注',
                dataIndex: 'remark',
                key: 'remark',
            },{
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                width:100,
                fixed:'right',
                render:(index,record)=>{
                    return <Operations hasDelete={true} hasEdit={true} edit={()=>this.handleOpenEditModal(record)} delete={()=>this.deleteIspList(record)}/>
                }
            },
        ];
        const pagination = {
            pageSize: 20
        };

        return (
            <Card className="card">
                <HeaderBar hasAdd={true} hasDelete={false} add={this.handleOpenEditModal}/>
                <BossTable pagination={pagination} columns={columns}  dataSource={this.props.mi1101Info.ispData}/>
                <EditModal cancel={this.handleCloseEditModal} record={this.state.record} visible={this.state.showEditModal} recordId={this.state.recordId}/>
            </Card>
        )
    }
}

export default injectIntl(MI1101);