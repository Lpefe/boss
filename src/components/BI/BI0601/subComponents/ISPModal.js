/*@商务-中心ISP设置*/
import React from 'react';
import {connect} from 'dva';
import {Checkbox, Form, Modal} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import Operations from "../../../Common/Operations";
import CreateIspModal from "./CreateIspModal";
import BossTable from "../../../Common/BossTable";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";

class ISPModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAddIspModalShow: false,
            selectedId: "",
            selectedRecord: {},
            out_ip:this.props.out_ip
        }
    }

    handleChangeOutIpStatus=(e)=>{
        if(e.target.checked){
            Modal.confirm({
                content:"@启用自动获取外网IP功能将删除手动输入的运营商信息，确定吗？",
                onOk:()=>{
                    this.props.dispatch({
                        type:"ci1401Info/set_out_ip",
                        payload:{
                            id:this.props.id,
                            out_ip:e.target.checked
                        }
                    }).then(()=>{
                        this.props.getData();
                    })
                },
                onCancel:()=>{
                    this.props.dispatch({
                        type:"ci1401Info/set_out_ip",
                        payload:{
                            out_ip:!e.target.checked
                        }
                    })
                }
            })
        }else{
            this.props.dispatch({
                type:"ci1401Info/set_out_ip",
                payload:{
                    out_ip:e.target.checked,
                    id:this.props.id
                }
            })
        }

    };

    handleOpenCreateIspModal = (record) => {
        this.setState({
            ifAddIspModalShow: true,
            selectedId: record.id,
            selectedRecord: record,
        }, function () {
            this.props.dispatch({
                type: "ci1401Info/get_isp_dict",
                payload: {}
            })
        })
    };

    handleCloseCreateIspModal = () => {
        this.setState({
            ifAddIspModalShow: false,
            selectedId: "",
            selectedRecord: {},
        })
    };

    delete_isp_of_cstep = (record) => {
        this.props.dispatch({
            type: "ci1401Info/delete_isp_of_cstep",
            payload: {
                ids: [record.id],
                sn: this.props.sn
            }
        })
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [
            {
                title: '@运营商',
                dataIndex: 'isp',
                key: 'isp',
            }, {
                title: '@IP地址',
                dataIndex: 'ip',
                key: 'ip',
            }, {
                title: '@带宽(M)',
                dataIndex: 'bandwidth',
                key: 'bandwidth',
            }, {
                title: '@备注',
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: '@操作',
                dataIndex: 'operation',
                key: 'operation',
                align: "center",
                width:100,
                fixed:'right',
                render: (index, record) => {
                    return <Operations hasDelete={true} hasEdit={true}
                                       edit={() => this.handleOpenCreateIspModal(record)}
                                       delete={() => this.delete_isp_of_cstep(record)}/>
                }
            }
        ];
        return <Modal maskClosable={false} visible={this.props.visible} title={"@ISP配置"}
                      onCancel={this.props.cancel} width={700} size="small" footer={null}
                      bordered>
            <div style={{marginBottom:16}}>
                <Checkbox checked={this.props.ci1401Info.out_ip} onChange={this.handleChangeOutIpStatus}>{"@启动自动获取外网IP功能"}</Checkbox>
                <div style={{color:'red'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"@启用后将不使用固定的外网IP地址"}</div>
                <div style={{color:'red'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"@仅针对没有固定的外网IP情况下使用,如PPPOE拨号上网等"}</div>
            </div>
            <HeaderBar hasDelete={false} hasAdd={true} addBtnDisabled={this.props.ci1401Info.out_ip} add={this.handleOpenCreateIspModal}/>
            <BossTable columns={columns} dataSource={this.props.ci1401Info.modalDataSource}/>
            <CreateIspModal cancel={this.handleCloseCreateIspModal} sn={this.props.sn}
                            visible={this.state.ifAddIspModalShow} id={this.state.selectedId}
                            record={this.state.selectedRecord}/>
        </Modal>
    }

}

function mapDispatchToProps({ci1401Info}) {
    return {ci1401Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ISPModal)));