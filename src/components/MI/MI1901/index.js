/*@运维-Docker管理*/
import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Card, Modal} from 'antd';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
// 改造版Operations
import Operations from "./subComponents/Operations";
import BossEditModal from "../../Common/BossEditModal";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import CreateIspModal from "./subComponents/CreateIspModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";


class MI1901C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            name:"",

            //点击isp弹出框
            ispcompanyModalShow:false,
            //docker添加修改
            companyModalShow:false,
            editRecord: {},
            editId: "",
            //isp添加修改
            visible:false,
            selectedRecord:{},
            selectedId:"",
        }
    }

    componentDidMount() {
        this.getDockerGroup();
    }

    getDockerGroup = () => {
        this.props.dispatch({
            type: "mi1901Info/getDockerGroup",
            payload: {
                name:this.state.name
            }
        });
    };
    getIspOfDocker = () => {
        this.props.dispatch({
            type: "mi1901Info/getIspOfDocker",
            payload: {
                docker_group_id:this.state.editId
            }
        });
    };
    getOsList = ()=>{
        this.props.dispatch({
            type: "mi1901Info/getOsList",
            payload: {
            }
        });
    };
    getRoomList = ()=>{
        this.props.dispatch({
            type: "mi1901Info/getRoomList",
            payload: {
            }
        });
    };
    handleOpenAddCompanyModal = () => {
        this.setState({
            companyModalShow: true,
        });
        this.getOsList()
        this.getRoomList()
    };
    handleOpenAddIsp = (record) =>{
        this.setState({
            visible: true,
            selectedId: record.id,
            selectedRecord: record,
        },()=>{
            this.getIspOfDocker()
        })
    };
    delete = (record) => {
        this.props.dispatch({
            type: "mi1901Info/deleteDockerGroup",
            payload: {
                ids: [record.id],
                records:[record]
            }
        }).then(()=>{
            this.getDockerGroup()
        })
    };
    deleteIsp = (record) => {
        this.props.dispatch({
            type: "mi1901Info/deleteIspOfDocker",
            payload: {
                ids: [record.id],
                records:[record]
            }
        }).then(()=>{
            this.getIspOfDocker()
        })
    };
    edit = (record) => {
        this.setState({
            companyModalShow: true,
            editId: record.id,
            editRecord: record,
        },()=>{
            this.getOsList()
            this.getRoomList()
        })
    };
    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            ispcompanyModalShow: false,
            visible:false,
            editId: "",
            editRecord: {},
            selectedId:"",
            selectedRecord:{}
        },()=>{
            this.getDockerGroup()
        })
    };
    closeIspAddModal = () => {
        this.setState({
            visible:false,
        },()=>{
            this.getIspOfDocker()
        })
    };
    search = (value) => {
        this.setState({
            name: value || ""
        }, ()=>{
            this.getDockerGroup();
        })
    };


    showModal = (record) =>{
        this.setState({
            ispcompanyModalShow:true,
            editId: record.id,
        },()=>{
            this.getIspOfDocker();
            this.props.dispatch({
                type:"mi1901Info/get_isp_dict",
                payload:{

                }
            })
        })
    };

    render() {
        const __=commonTranslate(this);
        //docker添加修改
        const ModalOptions = {
            title: this.state.editId ? "@编辑" :"@新增",
            visible: this.state.companyModalShow,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "mi1901Info/updateDockerGroup" : "mi1901Info/creatDockerGroup",
            extraUpdatePayload: {id: this.state.editId,},
            onCancel: this.closeAddModal,
            InputItems: [{
                type: "Input",
                labelName: "@设备名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入设备名称"
                },
                rules: [{required: true, message:  "@请输入设备名称"}, {
                    pattern: /^[0-9a-zA_Z]+$/, message: "只能输入英文和数字"
                }],
            }, {
                type: "Select",
                labelName: "@版本",
                valName: "version",
                nativeProps: {
                    placeholder:"@请选择版本"
                },
                rules: [{required: true, message: "@请选择版本"}],
                children: this.props.mi1901Info.osList.map((item) => {
                    return {key: item, value: item, name: item}
                })
            },{
                type: "Select",
                labelName: "@所在机房",
                valName: "room_id",
                nativeProps: {
                    placeholder: "@请选择机房"
                },
                rules: [{required: true, message:"@请选择机房"}],
                children: this.props.mi1901Info.roomList.map((item) => {
                    return {key: item.id, value: item.id, name: item.name}
                })
            }, {
                type: "InputNumber",
                labelName: "@CPU核数",
                valName: "cpu_no",
                nativeProps: {
                    style: {width: "66.66666667%"},
                    placeholder: "@请输入CPU核数",
                },
                rules: [{required: true, message: "@请输入CPU核数"}, {
                    pattern: /^[1-9]\d*$/, message: "@只能输入正整数"
                }],
            }, {
                type: "InputNumber",
                labelName: "@内存大小(GB)",
                valName: "ram",
                nativeProps: {
                    placeholder: "@请输入内存大小",
                    style: {width: "66.66666667%"},
                },
                rules: [{required: true, message: "@请输入内存大小"}, {
                    pattern: /^[1-9]\d*$/  , message: "@只能输入正整数"
                }],
            }],
            
        };
        //docker
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },{
            title: '@物理机名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link to={{pathname: "/main/mi1901/mi1902", search: "?id=" + record.id + "&name=" + record.name}}>{record.name}</Link>

                // return <span onClick={() => this.gotoLinkInfo(record)}
                //              className="common-link-icon">{record.alarm_type === 'device' ? record.device_name : record.link_name}
                //     </span>
            }
        }, {
            title: '@版本',
            dataIndex: 'version',
            key: 'version',
        }, {
            title: "@区域",
            dataIndex: 'room_level2_name',
            key: 'room_level2_name',
        }, {
            title: '@机房',
            dataIndex: 'room_name',
            key: 'room_name',
        }, {
            title: '@CPU核数',
            dataIndex: 'cpu_no',
            key: 'cpu_no'
        }, {
            title: '@内存大小(GB)',
            dataIndex: 'ram',
            key: 'ram'
        }, {
            title: '@Docker数量',
            dataIndex: 'docker_no',
            key: 'docker_no',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:150,
            fixed:'right',
            render: (index, record) => {
                return (
                    <div>
                        <Operations 
                        hasExtra={true} extra={() => this.showModal(record)}
                        name="ISP"
                        extraIcon="profile"
                        color="rgb(82,120,255)"
                        hasDelete={true} hasEdit={true} edit={() => this.edit(record)}
                        delete={() => this.delete(record)}/>
                    </div>
                )
            }
        },];
        //isp
        const ispcolumns = [{
            title: '@运营商',
            dataIndex: 'isp_name',
            key: 'isp_name',
        },{
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '@带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: "@备注",
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
                return (
                    <div>
                        <Operations 
                        hasDelete={true} hasEdit={true} edit={() => this.handleOpenAddIsp(record)}
                        delete={() => this.deleteIsp(record)}/>
                    </div>
                )
            }
        },];


        return (
            <div>
                <Card className="card">
                    <HeaderBar hasSearch={true} 
                               hasAdd={true}
                               hasDelete={false}
                               add={this.handleOpenAddCompanyModal}
                               submit={this.search}/>
                    <BossTable columns={columns} dataSource={this.props.mi1901Info.dataSource}
                              />
                    <BossEditModal {...ModalOptions} />
                    {/* 点击isp弹出框 */}
                    <Modal
                    width="750px"
                    visible={this.state.ispcompanyModalShow}
                    title={"@ISP配置"}
                    footer={null}
                    onCancel={this.closeAddModal}
                    >
                        <HeaderBar hasSearch={false} 
                            hasAdd={true}
                            hasDelete={false}
                            add={this.handleOpenAddIsp}/>
                        <BossTable columns={ispcolumns} dataSource={this.props.mi1901Info.ispDataSource}/>
                        {/* isp弹出框里面的添加按钮 */}
                        <CreateIspModal cancel={this.closeIspAddModal} 
                            visible={this.state.visible} 
                            record={this.state.selectedRecord}
                            id={this.state.selectedId}
                            groupId={this.state.editId}/>
                    </Modal>
                </Card>
                
            </div>
        )
    }
}

export default withRouter(injectIntl(MI1901C));
