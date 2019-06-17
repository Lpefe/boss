/*@客户-4G流量管理*/
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {Icon,Card} from 'antd';
import {Link} from 'react-router-dom';
import { injectIntl,} from 'react-intl';
class CI1801 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editRecords: {},
            editId: "",
        }
    }
 
    componentDidMount() {
        this.get_lte_4g();
        this.get_agency_list();
        this.get_isp_list();
    }

    get_lte_4g = () => {
        this.props.dispatch({
            type: "ci1801Info/get_lte_4g",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_agency_list = () => {
        this.props.dispatch({
            type: "ci1801Info/get_agency_list",
            payload: {
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_isp_list = () => {
        this.props.dispatch({
            type: "ci1801Info/get_isp_list",
            payload: {}
        })
    };

    handleEditModelShow = (record) => {
        this.setState({
            ifEditModalShow: true,
            editRecords: record,
            editId: record.id,
        })
    };

    handleAddModelShow=()=>{
        this.setState({
            ifEditModalShow: true,
        })
    };

    handleCloseEditModal = () => {
        this.setState({
            ifEditModalShow: false,
            editRecords: {},
            editId: "",
        })
    };

    handleDelete = (record) => {
        this.props.dispatch({
            type: "ci1801Info/delete_lte_4g",
            payload: {
                delete: {ids: [record.id],records:[record]},
                init: {
                    company_id: sessionStorage.getItem("companyId")
                },
            }
        })
    };

    render() {
        //Table配置对象
        const columns = [{
            title: '@设备名称',
            dataIndex: 'device_name',
            key: 'device_name',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@4G运营商',
            dataIndex: 'isp',
            key: 'isp',
            render: (index, record) => {
                return record.isp_name
            }
        }, {
            title: '@套餐类型',
            dataIndex: 'lte_type',
            key: 'lte_type',
        }, {
            title: '@流量大小'+'(MB)',
            dataIndex: 'flow',
            key: 'flow',
        }, {
            title: '@本月流量'+'(MB)',
            dataIndex: 'current_month_flow',
            key: 'current_month_flow',
            render:(text,record)=>{
                return (record.current_month_flow/1024/1024).toFixed(4)
            }
        }, {
            title: '@累计流量'+'(MB)',
            dataIndex: 'total_flow',
            key: 'total_flow',
            render:(text,record)=>{
                return (record.total_flow/1024/1024).toFixed(4)
            }
        }, {
            title: '@备注',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '@历史流量',
            dataIndex: 'day_flow',
            key: 'day_flow',
            width: 100,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/ci1801/ci1802",
                    search: "?id=" + record.id + "&device_name=" + record.device_name + "&current_month_flow=" + record.current_month_flow + "&company_id=" + record.company_id + "&sn=" + record.sn
                }}><Icon style={{color: "rgba(0,0,0,0.65)"}} type="line-chart"/></Link>
            }
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            fixed:'right',
            align: "center",
            render: (Index, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.handleEditModelShow(record)}
                                   delete={() => this.handleDelete(record)}/>
            }
        },];

        //弹出框表单配置对象
        const ModalOptions = {
            title: this.state.editId ? "@编辑4G使用机构" : "@添加4G使用机构",
            visible: this.state.ifEditModalShow,
            onCancel: this.handleCloseEditModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1801Info/update_lte_4g" : "ci1801Info/create_lte_4g",
            extraUpdatePayload: {company_id: sessionStorage.getItem("companyId"), id: this.state.editId},
            initialValues: this.state.editRecords,
            initPayload: {
                company_id: sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "Select",
                labelName: "@节点",
                valName: "agency_id",
                nativeProps: {
                    placeholder: "@请选择节点"
                },
                rules: [{required: true, message: "@请选择节点"}],
                children: this.props.ci1801Info.agencyList.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                }),
                onChange: (value, ref) => {
                    this.props.dispatch({
                        type: "ci1801Info/get_device_list",
                        payload: {
                            agency_id: value,
                            no_4g:1
                        }
                    });
                    ref.props.form.resetFields(["device_name"]);
                }
            }, {
                type: "Select",
                labelName: "@设备",
                valName: "sn",
                nativeProps: {
                    placeholder: "@请选择设备"
                },
                rules: [{required: true, message: "@请选择设备"}],
                children: this.props.ci1801Info.deviceList.map((item) => {
                    return {key: item.id.toString(), value: item.sn, name: item.name}
                })
            }, {
                type: "Select",
                labelName:  "@4G运营商",
                valName: "isp",
                nativeProps: {
                    placeholder:  "@请选择运营商"
                },
                rules: [{required: true, message:  "@请选择运营商"}],
                children: this.props.ci1801Info.ispList.map((item) => {
                    return {key: item.id.toString(), value: item.code, name: item.name}
                })
            }, {
                type: "Select",
                labelName:  "@套餐类型",
                valName: "lte_type",
                nativeProps: {
                    placeholder:  "@请选择套餐类型"
                },
                rules: [{required: true, message:  "@请选择套餐类型"}],
                children: [{key: "固定", value: "包月", name: "包月"}, {key: "固定", value: "固定", name: "固定"}, {
                    key: "其他",
                    value: "其他",
                    name: "其他"
                }]
            }, {
                type: "InputNumber",
                labelName:  "@流量"+"(MB)",
                valName: "flow",
                nativeProps: {
                    placeholder:  "@请输入流量",
                    min: 0,
                },
                rules: [{required: true, message:  "@请输入流量"}],
            }, {
                type: "Input",
                labelName:  "@备注",
                valName: "remark",
                nativeProps: {
                    placeholder:  "@请输入备注"
                },
                rules: [],
            },]
        };

        return <Card className="card">
            <HeaderBar hasAdd={true} addAlias= {"@添加4G使用机构"} add={this.handleAddModelShow}/>
            <BossTable columns={columns} dataSource={this.props.ci1801Info.lteData}/>
            <BossEditModal {...ModalOptions}/>
        </Card>
    }
}

export default injectIntl(CI1801);