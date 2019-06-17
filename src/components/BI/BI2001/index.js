/*@技术支持-上云申请*/
import React from 'react';
import './index.scss';
import {Card,Popconfirm,Icon} from 'antd';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import Operations from "../../Common/Operations";
import {withRouter} from "react-router-dom";
import BossEditModal from "../../Common/BossEditModal";
import {validateIp} from "../../../utils/commonUtilFunc";


class BI2001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_id: '',
            name:"",
            editRecord:{},
            editId: "",
        }
    }
    componentDidMount() {
        this.get_company_list();
        this.get_cloud_application()
    }
    get_cloud_application = () => {
        this.props.dispatch({
            type: "bi2001Info/get_cloud_application",
            payload: {}
        })
    };
    //获取中心节点
    get_center_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi2001Info/get_agency_list",
            payload: {
                one_device:1,
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };
    handleDelete = (record) => {
        this.props.dispatch({
            type: "bi2001Info/delete_cloud_application",
            payload: {
                ids: [record.id],
                records:[record]   
            }
        })
    };
    //获取列表名称
    get_company_list = () => {
        this.props.dispatch({
            type: "bi2001Info/get_company_list",
            payload: {}
        })
    };

    //点击关闭添加框，初始化
    cancelModal = () => {
        this.props.form.resetFields();
        this.setState({
            editModalShow: false,
            editId: "",
            editRecord: {},
        })
    };
    //点击添加
    addApp = () => {
        this.setState({
            editModalShow: true
        },()=>{
            this.get_company_list();
        });
    };
    //修改信息
    handleUpdate = (record) => {
        this.setState({
            editModalShow: true,
            company_id:record.company_id,
            editId: record.id,
            editRecord: record
        },()=>{
            this.props.dispatch({
                type: "bi2001Info/get_agency_list",
                payload: {
                    one_device:1,
                    company_id: this.state.company_id,
                    type: "CSTEP",
                }
            });
            this.props.dispatch({
                type: "bi2001Info/get_agency_list",
                payload: {
                    company_id: this.state.company_id,
                    type: "STEP",
                }
            })
        });
    };
    render() {
        const columns = [{
            title: '@申请时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: '@接入区域',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '@物理专线',
            dataIndex: 'line',
            key: 'line',

        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',

        },{
            title: "@中心节点",
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: "@阿里云UID",
            dataIndex: 'aliyun_uid',
            key: 'aliyun_uid',
        }, {
            title: "VLANID",
            dataIndex: 'vlan_id',
            key: 'vlan_id',
        }, {
            title: "@阿里云侧互联IP",
            dataIndex: 'aliyun_ip',
            key: 'aliyun_ip',
        }, {
            title: "@客户侧互联IP",
            dataIndex: 'client_ip',
            key: 'client_ip',
        }, {
            title: "@子网掩码",
            dataIndex: 'net_mask',
            key: 'net_mask',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed:'right',
            align: "center",
            width:75,
            render: (text, record) => {
                return <Popconfirm title="确定删除当前信息?" onConfirm={() => this.handleDelete(record)}><Icon type="delete" style={{}} className="operations-delete-btn-only"/></Popconfirm>
                //<Operations 
                //hasEdit={true} 
                //edit={() => this.handleUpdate(record)}
                //hasDelete={true} 
                //delete={() => this.handleDelete(record)}/>
            }
        },];
        const modalFormLayout = {
            labelCol: {
                xs: {span: 6},
            },
            wrapperCol: {
                xs: {span: 18},
            },
        };
        const ModalOptions = {
            title:this.state.editId ?"@修改VBR":"@添加VBR",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            //额外需要传的参数放在extraUpdatePayload里面
            extraUpdatePayload: {id: this.state.editId},
            submitType: this.state.editId ? "bi2001Info/update_cloud_application" :"bi2001Info/create_cloud_application",
            initialValues: Object.assign({},  this.state.editId?this.state.editRecord:{address:"杭州-余杭-A",line:"pc-bp1v1u0dr9ngwa5jos3co"}),
            InputItems: [ {
                type: "Select",
                labelName: "@接入区域",
                valName: "address",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请选择接入区域",
                    disabled:this.state.editId!=="",
                },
                rules: [{required: true, message: "@请选择接入区域"}],
                children:[{value: "杭州-余杭-A", key: "杭州-余杭-A", name: "@杭州-余杭-A"}]
            } , {
                type: "Select",
                labelName: "@物理专线",
                valName: "line",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请选择物理专线",
                },
                rules: [{required: true, message: "@请选择物理专线"}],
                children:[{value: "pc-bp1v1u0dr9ngwa5jos3co", key: "pc-bp1v1u0dr9ngwa5jos3co", name: "pc-bp1v1u0dr9ngwa5jos3co"}]
            }, {
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请选择企业名称",
                },
                rules: [{required: true, message: "@请选择企业名称"}],
                children: this.props.bi2001Info.companyList.map((item) => {
                    return {value: item.id, key: item.id, name: item.company_abbr,company_id:item.company_id}
                }),
                onChange: (company_id,vm) => {
                        this.props.dispatch({
                            type: "bi2001Info/get_agency_list",
                            payload: {
                                one_device:1,
                                company_id: company_id,
                                type: "CSTEP",
                            }
                        });
                        this.props.dispatch({
                            type: "bi2001Info/get_agency_list",
                            payload: {
                                company_id: company_id,
                                type: "STEP",
                            }
                        });
                        vm.props.form.setFieldsValue({
                            agency_id: undefined,
                        });
                }
            }, {
                type: "Select",
                labelName: "@中心节点",
                valName: "agency_id",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请选择中心节点",
                },
                rules: [{required: true, message: "@请选择中心节点"}],
                children: this.props.bi2001Info.agencyListCenter.map((item) => {
                    return {value: item.id, key: item.id, name: item.name}
                }),
            }, {
                type: "Input",
                labelName: "@阿里云UID",
                valName: "aliyun_uid",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入阿里云UID",mode:"multiple"
                },
                rules: [{required: true, message: "@请输入阿里云UID"}],
            }, {
                type: "Input",
                labelName: "VLANID",
                valName: "vlan_id",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入VLANID",mode:"multiple"
                },
                rules: [{required: true, message: "@请输入VLANID"},{
                    pattern: /^([2-9]|[1-9]\d{1,2}|[1-2]\d{3})$/,
                    message: "@输入范围在2-2999之间"
                }],
            }, {
                type: "Input",
                labelName: "@阿里云侧互联IP",
                valName: "aliyun_ip",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入阿里云侧互联IP",mode:"multiple"
                },
                rules: [{required: true, message: "@请输入阿里云侧互联IP"},{validator: validateIp}],
            }, {
                type: "Input",
                labelName: "@客户侧互联IP",
                valName: "client_ip",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入客户侧互联IP",mode:"multiple"
                },
                rules: [{required: true, message: "@请输入客户侧互联IP"},{validator: validateIp}],
            }, {
                type: "Input",
                labelName: "@子网掩码",
                valName: "net_mask",
                customerFormLayout:modalFormLayout,
                nativeProps: {
                    placeholder: "@请输入子网掩码",mode:"multiple"
                },
                rules: [{required: true, message: "@请输入子网掩码"},{validator: validateIp}],
            }, ]
        };
        return (
        <div>
            <Card>
            <HeaderBar hasAdd={true} 
                       add={this.addApp}/>
            <BossTable columns={columns} dataSource={this.props.bi2001Info.fullmesh}/>
            <BossEditModal {...ModalOptions}/>
            </Card>                    
        </div>
        )
    }
}

export default withRouter(injectIntl(BI2001));




