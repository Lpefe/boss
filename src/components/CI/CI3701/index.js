/*@客户-客户端IP段*/
import React from 'react';
import {Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../MI/MI1901/subComponents/Operations";
import BossEditModal from "../../MI/MI1902/subComponents/BossEditModal";
import {validateIp} from "../../../utils/commonUtilFunc";

import DNS from './subComponents/DNS'

class CI3701C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalShow:false,
            editRecord:{},
            editId:"",
        };

    }

    componentDidMount() {
        this.get_app_ipset();
        this.get_app_dns()
    }

    get_app_ipset=()=>{
        this.props.dispatch({
            type:"ci3701Info/get_app_ipset",
            payload:{
                company_id:sessionStorage.getItem("companyId")
            }
        })
    };
    get_app_dns=()=>{
        this.props.dispatch({
            type:"ci3701Info/get_app_dns",
            payload:{
                company_id:sessionStorage.getItem("companyId")
            }
        })
    };

    handleEditModalShow=(record)=>{
        this.setState({
            editModalShow:true,
            editRecord:record.id?record:{},
            editId:record.id,
        })
    };

    handleEditModalClose=()=>{
        this.setState({
            editModalShow:false,
            editRecord:{},
            editId:"",
        })
    };

    handleDelete = (record) => {
        this.props.dispatch({
            type: 'ci3701Info/delete_app_ipset',
            payload: {
                delete:{ids: [record.id],
                records: [record]},
                init:{
                    company_id:sessionStorage.getItem("companyId")
                }
            }
        })
    };

    render() {
        const ModalOptions = {
            title: this.state.editId?"@编辑IP段":"@新增IP段",
            visible: this.state.editModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId?"ci3701Info/update_app_ipset":"ci3701Info/create_app_ipset" ,
            extraUpdatePayload: {id:this.state.editRecord.id,company_id:sessionStorage.getItem('companyId')},
            onCancel: this.handleEditModalClose,
            initPayload:{
                company_id:sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "Input",
                labelName: "@IP段",
                valName: "ipset",
                nativeProps: {
                    placeholder: "@请输入IP段",
                    disabled:!!this.state.editId
                },
                rules:[{required:true,message:"@请输入IP段"},{validator: validateIp},]
            },{
                type: "TextArea",
                labelName: "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder: "@请输入备注",
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules:[{max:128,message:"@备注最大长度为128字符"}]
            }]
        };
        const columns = [{
            title: '@IP段',
            dataIndex: 'ipset',
            key: 'ipset',
        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            render:(text,record)=>{
                return <Operations hasDelete={true} hasEdit={true}
                                   delete={() => this.handleDelete(record)} edit={()=>this.handleEditModalShow(record)}/>
            }
        },];

        return (
            <div>
                <Card className="card">
                    <DNS/>
                </Card>
                <Card className="card">
                    <HeaderBar hasAdd={true}  add={this.handleEditModalShow} />
                    <BossTable columns={columns} dataSource={this.props.ci3701Info.ipsetList}/>
                    <BossEditModal {...ModalOptions}/>
                </Card>
            </div>
        )
    }
}

export default CI3701C;