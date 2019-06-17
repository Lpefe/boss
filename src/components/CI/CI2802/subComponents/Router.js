/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Form} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import BossTable from "../../../Common/BossTable";
import Operations from "../../../Common/Operations";
import BossEditModal from "../../../Common/BossEditModal";
import {commonTranslate,validateIp} from "../../../../utils/commonUtilFunc";
import {BossMessage} from "../../../Common/BossMessages";

import {injectIntl} from "react-intl";


class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRecord: {},
            editId: "",
            required:true,
            Lan:0
        }
    }
    componentDidMount() {
        this.get_cta_static_route()
    }
    get_cta_wan =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_wan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    get_cta_lan=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_lan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    get_wan_and_lan=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_wan_and_lan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    get_cta_static_route =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_static_route",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }


    handleOpenAdd=()=>{
        if(this.props.ci2802Info.routeList.length>2047){
            BossMessage(false, "@静态路由最多只能添加2048个，请删除后再添加");
        }else{
            this.get_cta_wan()
            this.get_cta_lan()
            this.setState({
                visible: true,
            })
        }
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            Lan:0
        },  ()=> {
            this.get_cta_static_route()
        })
    }
    edit = (record)=>{
        this.get_cta_wan()
        this.get_cta_lan()
        this.setState({
            visible: true,
            editRecord: record,
            editId: record.id,
        }, ()=> {
            //this.get_cta_wan()
        })
    }
   delete = (record) => {
        this.props.dispatch({
            type: "ci2802Info/delete_cta_static_route",
            payload: {
                records:[record],
                ids: [record.id],
                cta_id:this.props.cta_id
            }
        })
    };
    render() {
        const modalFormLayout = {
            labelCol: {
                xs: {span: 14},
            },
            wrapperCol: {
                xs: {span: 10},
            },
        };
        const ModalOptions = {
            title: this.state.editId ? "@编辑" :"@新增",
            visible: this.state.visible,
            customerFormLayout:modalFormLayout,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2802Info/update_cta_static_route" : "ci2802Info/create_cta_static_route",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {cta_id:this.props.cta_id,id:this.state.editId},
            initPayload: {},
            parentVm: this,
            InputItems: [
                // {
                //     type: "Radio",
                //     labelName: '接口',
                //     valName: this.state.wan,
                //     nativeProps: {
                //         placeholder: __(messages['请选择LAN'])
                //     },
                //     //rules: [{required: !this.state.required,}],
                //     children: this.props.ci2802Info.dataWanLan.map((item) => {
                //         if (item) {
                //             return {key: item.id, value: item.id, name: item.name}
                //         }
                //     }),
                //     onChange: (value, vm) => {
                //         this.setState({
                //             required:!this.state.required
                //         })
                //         vm.props.form.setFieldsValue({
                //             cta_wan_id: null,
                //         });
                //     }
                // },
                {
                    type: "Radio",
                    labelName:"@接口",
                    valName: "band",
                    nativeProps: {
                    },
                    rules: [{required: true, message:"@请选择接口"}],
                    children: [{value: 1, name: "LAN", key: "1"}, {
                        value: 2,name: "WAN",key: "0"
                    }],
                    onChange:(value,vm) => {
                        this.setState({
                            Lan:value.target.value
                        })
                    },
                },
            this.state.Lan===1?{
                type: "Select",
                labelName: 'LAN',
                valName: "cta_lan_id",
                nativeProps: {
                    placeholder: '@请选择LAN'
                },
                rules: [{required:true,message:"@请选择LAN"}],
                children: this.props.ci2802Info.dataLan.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.name}
                    }
                }),
                onChange: (value,vm) => {
                    console.log(value)
                }
            }:"",this.state.Lan===2?{
                type: "Select",
                labelName: 'WAN',
                valName: "cta_wan_id",
                nativeProps: {
                    placeholder: '@请选择WAN'
                },
                rules: [{required: true,message:"@请选择WAN"}],
                children: this.props.ci2802Info.dataWan.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.name}
                    }
                }),
                onChange: (value,vm) => {
                    console.log(value)
                }
            }:"",{
                type: "Input",
                labelName: "@IP段",
                valName: "ipset",
                nativeProps: {
                    placeholder: "@请输入IP段"
                },
                rules: [{required: true, message: "@请输入IP段"},{validator: validateIp},],
            },{
                type: "Input",
                labelName: "@下一跳",
                valName: "gateway",
                nativeProps: {
                    placeholder: "@请输入下一跳"
                },
                rules: [{required: true, message: "@请输入下一跳"},{
                    pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                    message: "@请输入正确IP格式"
                }],
            },{
                type: "Input",
                labelName:"@跃点数",
                valName: "metric",
                nativeProps: {
                    placeholder:"@请输入跃点数"
                },
                rules: [{required: true, message: "@请输入跃点数"},{
                    pattern: /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])$/,
                    message:"@跃点数范围为1-255"
                }],
            },
        ]
        };
        const columns = [{
            title: '@接口',
            dataIndex: 'net_name',
            key: 'net_name',
            
        }, {
            title: '@IP段',
            dataIndex: 'ipset',
            key: 'ipset',            
        }, {
            title:  '@下一跳',
            dataIndex: 'gateway',
            key: 'gateway',
        }, {
            title: '@跃点数',
            dataIndex: 'metric',
            key: 'metric',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return <div>
                <Operations 
                hasEdit={true} hasDelete={true} 
                delete={() => this.delete(record)}
                edit={() => this.edit(record)}
                />
            </div>
            }
        },];
        return <div className="CheckWAN"> 
            <p className="ci2802AgencyName p"  style={{marginBottom:"20px"}}>@静态路由</p>
                <HeaderBar  hasAdd={true} add={this.handleOpenAdd}/>
                <BossTable columns={columns} dataSource={this.props.ci2802Info.routeList}/>
                <BossEditModal {...ModalOptions} />
        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Router)));