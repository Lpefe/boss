/*@技术支持-FullMesh链路*/
import React from 'react';
import './index.scss';
import {Card,  Select,} from 'antd';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import Operations from "../../Common/Operations";
import {withRouter} from "react-router-dom";
import BossEditModal from "../../Common/BossEditModal";
const Option = Select.Option;
class BI0801 extends React.Component {
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
        this.get_fullmesh_link()
    }
    //获取全部fullmesh
    get_fullmesh_link = () => {
        this.props.dispatch({
            type: "bi0801Info/get_fullmesh_link",
            payload: {}
        })
    };
    //获取中心节点
    get_center_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi0801Info/get_agency_list",
            payload: {
                one_device:1,
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };

    //删除fullmesh
    handleDelete = (record) => {
        this.props.dispatch({
            type: "bi0801Info/delete_fullmesh_link",
            payload: {
                ids: [record.id],
                records:[record]   
            }
        })
    };
    //获取列表名称
    get_company_list = () => {
        this.props.dispatch({
            type: "bi0801Info/get_company_list",
            payload: {}
        })
    };
    //点击添加
    addApp = () => {
        this.setState({
            editModalShow: true
        });
    };

    handleSelect = (value) => {
        this.setState({
            company_id: value===undefined?"":value,
        }, () => {
            this.props.dispatch({
                type: "bi0801Info/get_fullmesh_link",
                payload: {
                    company_id:this.state.company_id
                }
            })
        })
    };
    //点击搜索
    handleSubmitSearch = (value) => {
        this.setState({
            name:value||""
        }, () => {
            this.props.dispatch({
                type: "bi0801Info/get_fullmesh_link",
                payload: {
                    name:this.state.name
                }
            })
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
    //修改信息
    handleUpdate = (record) => {
        this.setState({
            editModalShow: true,
            company_id:record.company_id,
            editId: record.id,
            editRecord: record
        },()=>{
            this.props.dispatch({
                type: "bi0801Info/get_agency_list",
                payload: {
                    one_device:1,
                    company_id: this.state.company_id,
                    type: "CSTEP",
                }
            });
            this.props.dispatch({
                type: "bi0801Info/get_agency_list",
                payload: {
                    company_id: this.state.company_id,
                    type: "STEP",
                }
            })
        });
    };
    render() {
        const optionOne = this.props.bi0801Info.companyList.map((item) => {
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        const columns = [{
            title: '@创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@中心节点',
            dataIndex: 'center_name',
            key: 'center_name',

        }, {
            title: '@边缘节点',
            dataIndex: 'edge_names',
            key: 'edge_names',

        },{
            title: "@备注",
            dataIndex: 'remark',
            key: 'remark',

        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            width:100,
            fixed:'right',
            render: (text, record) => {
                return <Operations hasEdit={true} hasDelete={true} edit={() => this.handleUpdate(record)}
                                   delete={() => this.handleDelete(record)}/>
            }
        },];
        const ModalOptions = {
            title:this.state.editId ?"@修改FullMesh链路":"@添加FullMesh链路",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            //额外需要传的参数放在extraUpdatePayload里面
            extraUpdatePayload: {id: this.state.editId},
            submitType: this.state.editId ? "bi0801Info/update_fullmesh_link" :"bi0801Info/create_fullmesh_link",
            initialValues: Object.assign({}, this.state.editRecord),
            InputItems: [ {
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                nativeProps: {
                    placeholder: "@请选择企业",
                    disabled:this.state.editId!=="",
                },
                rules: [{required: true, message: "@请选择企业"}],
                children: this.props.bi0801Info.companyList.map((item) => {
                    return {value: item.id, key: item.id, name: item.company_abbr,company_id:item.company_id}
                }),
                onChange: (company_id,vm) => {
                        this.props.dispatch({
                            type: "bi0801Info/get_agency_list",
                            payload: {
                                one_device:1,
                                company_id: company_id,
                                type: "CSTEP",
                            }
                        });
                        this.props.dispatch({
                            type: "bi0801Info/get_agency_list",
                            payload: {
                                company_id: company_id,
                                type: "STEP",
                            }
                        });
                        vm.props.form.setFieldsValue({
                            edge_ids: undefined,
                            center_id:undefined,
                            remark:undefined,
                        });
                }
            } , {
                type: "Select",
                labelName: "@中心",
                valName: "center_id",
                nativeProps: {
                    placeholder: "@请选择中心",
                },
                rules: [{required: true, message: "@请选择中心"}],
                children: this.props.bi0801Info.agencyListCenter.map((item) => {
                    return {value: item.id, key: item.id, name: item.name}
                })
            }, {
                type: "Select",
                labelName: "@边缘",
                valName: "edge_ids",
                nativeProps: {
                    placeholder: "@请选择边缘",mode:"multiple"
                },
                rules: [{required: true, message: "@请选择边缘"}],
                children: this.props.bi0801Info.agencyListEdge.map((item) => {
                    return {value: item.id, key: item.id, name: item.name}
                }),
            }, {
                    type: "TextArea",
                    labelName: "@备注",
                    valName: "remark",
                    nativeProps: {
                        placeholder:"@请输入备注",
                        autosize: {minRows: 6, maxRows: 12},
                    },
                    rules: [{max: 128, message: "@备注最多输入128字符"}],
                },]
        };
        return (
        <div>
            <Card>
            <HeaderBar hasAdd={true} hasSelect={true} hasSearch={true} selectPlaceHolder={"@请选择企业"}
                       add={this.addApp} options={optionOne}
                       selectOneMethod={this.handleSelect} submit={this.handleSubmitSearch}
                    />
            <BossTable columns={columns} dataSource={this.props.bi0801Info.fullmesh}/>
            <BossEditModal {...ModalOptions}/>
            </Card>                    
        </div>
        )
    }
}

export default withRouter(injectIntl(BI0801));




