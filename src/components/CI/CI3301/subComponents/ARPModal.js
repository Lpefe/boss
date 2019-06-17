/*@客户-LAN模板*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Input, Card,Table} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
// 改造版Operations
import Operations from "../../../Common/Operations";
import BossEditModal from "../../../Common/BossEditModal";

import {injectIntl} from "react-intl";


class ARPModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            selectedRowKeys:[],
            editRecord:{},
            editId:""
        }
    }

    componentDidMount =()=>{
        //this.props.onRef(this)
    }
    handelModalShow=()=>{
        this.setState({
            ModalShow:true,
        })
    }

    Submit=()=>{
        this.props.cancel()
    }
    edit = (record)=>{
        this.setState({
            ModalShow:true,
            editRecord: record,
            editId: record.id,
        })
    }
    get_static_ip=()=>{

        this.props.dispatch({
            type:"ci3301Info/get_static_ip",
            payload:{
                net_id:this.props.id
            }
        })
    }
    closeAddModal=()=>{
        this.setState({
            ModalShow:false,
            editRecord:{},
            editId: "",
        },()=>{
            this.get_static_ip()
        }
        )
    }
    delete=(record)=>{
        this.props.dispatch({
            type: "ci3301Info/delete_static_ip",
            payload: {
                data:{ids:[record.id],records:record},
                init:{net_id:this.props.id}
            }
        }) 
    }
    deleteAll=()=>{
        this.props.dispatch({
            type: "ci3301Info/delete_static_ip",
            payload: {
                data:{ids:this.state.selectedRowKeys},
                init:{net_id:this.props.id}
            }
        })}
    render() {

        const ModalOptions = {
            title:this.state.editId ? "@编辑" :"@新增",
            visible:this.state.ModalShow,
            initialValues:this.state.editRecord,
            dispatch:this.props.dispatch,
            bodyHeight:220,
            submitType:this.state.editId ?"ci3301Info/update_static_ip":"ci3301Info/create_static_ip",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {net_id:this.props.id,id:this.state.editId},
            initPayload: {},
            InputItems: [{
                type: "Input",
                labelName: "@静态IP",
                valName: "ip",
                nativeProps: {
                    placeholder: "@请输入静态IP",
                },
                rules: [{required:true, message:"@请输入静态IP"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确的IP地址"
                }],
            },{
                type: "Input",
                labelName: "Mac",
                valName: "mac_address",
                nativeProps: {
                    placeholder: "@请输入Mac地址",
                },
                rules: [{required:true, message:"@请输入Mac地址"},{
                    pattern: /^[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}\:[A-Fa-f0-9]{1,2}$/,
                    message: "@Mac输入格式：98:ee:cb:6a:08:a1"
                }],
                //rules: [{required:true}],
            },
        ]
        }
        const {getFieldDecorator} = this.props.form;
        const rowSelection = {
            fixed: true,
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: (selectedIds,selectedRecords) => {
                console.log(selectedIds)
                this.setState({
                    selectedRowKeys:selectedIds
                })
            }
        };
        const Columns = [
            {
                title: "@静态IP",
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: "Mac",
                dataIndex: 'mac_address',
                key: 'mac_address',

            },{
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                align: "center",
                fixed:'right',
                width:100,
                render: (index, record) => {
                    return (
                        <div style={{display:"inline-block"}}>
                            <Operations 
                            hasEdit={true} edit={() => this.edit(record)}
                            hasDelete={true} delete={() => this.delete(record)}
                            />
                        </div>
                    )
                }
            } ];
        return <Modal width="900px" maskClosable={false} visible={this.props.visible} title={"@ARP静态绑定"}
                      onCancel={this.props.cancel} onOk={this.Submit} destroyOnClose >
                    <div>
                        
                        <Card className="card">
                            <HeaderBar hasAdd={true} addAlias={"@添加"} add={this.handelModalShow} hasDelete={true} selectedKeys={this.state.selectedRowKeys} delete={this.deleteAll}/>
                            <Table bordered size="middle" rowKey={record => record.id} pagination={false}
                    rowClassName="normal" rowSelection={rowSelection} columns={Columns} dataSource={this.props.ci3301Info.dataSourceScan}/>
                        </Card>
                <BossEditModal {...ModalOptions} />

                    </div>
                    
        </Modal>
    }

}

function mapDispatchToProps({ci3301Info}) {
    return {ci3301Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ARPModal)));