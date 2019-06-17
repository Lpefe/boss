/*@运维-设备管理*/
import React from 'react';
import {Form, Button, Modal, Popconfirm,Icon} from 'antd';
import {injectIntl} from "react-intl";
import {connect} from 'dva';
import AddIspForm from './AddIspForm'
import EditIspForm from './EditIspForm'
import BossTable from "../../../Common/BossTable";


class CheckRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addIspShow: false,
            editIspShow: false,
            record: {}
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "mi0301Info/get_isp_list",
            payload: {
                room_id: this.props.checkRecord.id
            }
        })
    }

    editModalShow = (record) => {
        this.setState({
            editIspShow: true,
            record: record
        },function(){
            this.props.dispatch({
                type:"mi0301Info/get_isp_dict",
                payload:{

                }
            })
        })
    };
    addModalShow = () => {
        this.setState({
            addIspShow: true
        },function(){
            this.props.dispatch({
                type:"mi0301Info/get_isp_dict",
                payload:{

                }
            })
        })
    };

    hideAddIsp = () => {
        this.setState({
            addIspShow: false
        })
    };
    hideEditIsp = () => {
        this.setState({
            editIspShow: false
        })
    };

    delete_isp=(record)=>{
        this.props.dispatch({
            type:"mi0301Info/delete_isp",
            payload:{
                ids:[record.id],
                room_id: this.props.checkRecord.id,
                records:[record]
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const columns = [{
            title: '@运营商',
            dataIndex: 'isp',
            key: 'isp',
            width: 120,
        }, {
            title: '@带宽'+"(M)",
            dataIndex: 'bandwidth',
            key: 'bandwidth',
            width: 120,
        }, {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            align:"center",
            render: (Index, record) => {
                return (
                    <div>
                        <Icon onClick={() => this.editModalShow(record)} style={{marginRight: 8}} type="edit"/>
                        <Popconfirm onConfirm={()=>this.delete_isp(record)} title={"@确认删除该条信息"+"?"}>
                            <Icon  type="delete" size="small"/>
                        </Popconfirm>
                    </div>
                )
            }
        },];
        return (
            <div>
                <Button onClick={this.addModalShow} icon="plus">{"@添加"}</Button>
                <BossTable columns={columns} style={{marginTop: 24}} dataSource={this.props.mi0301Info.ispList}/>
                <Modal maskClosable={false} visible={this.state.addIspShow} onCancel={this.hideAddIsp} footer={null} title={"@添加ISP"}>
                    <AddIspForm room_id={this.props.checkRecord.id} cancel={this.hideAddIsp}/>
                </Modal>
                <Modal maskClosable={false} visible={this.state.editIspShow} onCancel={this.hideEditIsp} footer={null} title={"@编辑ISP"}
                       destroyOnClose>
                    <EditIspForm id={this.state.record} room_id={this.props.checkRecord.id} record={this.state.record}
                                 cancel={this.hideEditIsp}/>
                </Modal>
            </div>
        )
    }
}


function mapDispatchToProps({mi0301Info}) {
    return {mi0301Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(CheckRoomForm)));