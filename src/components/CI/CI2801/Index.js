/*@客户-配置管理*/
import React from 'react';
import {Card, Icon, Popconfirm, Select} from 'antd';
import {Link} from 'react-router-dom'
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../Common/BossEditModal";
import {injectIntl} from "react-intl";

const Option = Select.Option;

class BI1903 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            visible: false,
            editRecord: {},
            editId: "",
            company_id: parseInt(sessionStorage.getItem("companyId")),
            selectedIds: [],
            selectedRecords: [],
            searchName: "",
            searchModel: "",
            searchStatus: "",
            searchType: "",
            selectCompanyId: parseInt(sessionStorage.getItem("companyId")),
        };

    }

    componentDidMount() {
        this.get_cpe_template_agency();
        this.get_agency_list();
        this.get_device_model();
        this.getCompanyList();
    }

    handleOpenAdd = () => {
        this.setState({
            visible: true,
        });
        this.get_agency_list();
        this.get_device_model()
    };
    get_cpe_template_agency = () => {
        this.props.dispatch({
            type: "ci2801Info/get_cpe_template_agency",
            payload: {
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
                model: this.state.searchModel,
                device_status: this.state.searchStatus,
                agency_type: this.state.searchType,
            }
        });
    };

    get_agency_list = () => {
        this.props.dispatch({
            type: "ci2801Info/get_agency_list",
            payload: {
                company_id: this.state.company_id,
            }
        });
    };
    get_device_model = () => {
        this.props.dispatch({
            type: "ci2801Info/get_device_model",
            payload: {
                hardware_type: "CPE"
            }
        });
    };

    get_cpe_template = (model) => {
        this.props.dispatch({
            type: "ci2801Info/get_cpe_template",
            payload: {
                model: model
            }
        });
    };
    getCompanyList = () => {
        this.props.dispatch({
            type: "ci2801Info/get_company_list",
            payload: {

            }
        });
    };

    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
        }, () => {
            this.get_cpe_template_agency()
        })
    };

    delete = (record) => {
        this.props.dispatch({
            type: "ci2801Info/delete_cpe_template_agency",
            payload: {
                payload: {
                    ids: [record.id],
                    records: [record]
                },
                init:{
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName,
                    model: this.state.searchModel,
                    device_status: this.state.searchStatus,
                    agency_type: this.state.searchType,
                }
            }
        })
    };
    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "ci2801Info/delete_cpe_template_agency",
            payload: {
                payload: {
                    ids: this.state.selectedIds,
                    records: this.state.selectedRecords
                },
                init:{
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName,
                    model: this.state.searchModel,
                    device_status: this.state.searchStatus,
                    agency_type: this.state.searchType,
                }
            }
        })
    };
    handleSelectStatus = (value) => {
        this.setState({
            searchStatus: value || ""
        }, () => {
            this.get_cpe_template_agency()
        })
    };
    handleSelectModel = (value) => {
        this.setState({
            searchModel: value || ""
        }, () => {
            this.get_cpe_template_agency()
        })
    };
    handleSelectType = (value) => {
        this.setState({
            searchType: value || ""
        }, () => {
            this.get_cpe_template_agency()
        })
    };
    search = (value) => {
        this.setState({
            searchName: value || ""
        }, () => {
            this.get_cpe_template_agency()

        })
    };

    handleUpdate = () => {
        this.props.dispatch({
            type: "ci2801Info/update_ssid_template_agency",
            payload: {
                id: {ids: this.state.selectedIds, records: this.state.selectedRecords},
                company_id: this.state.company_id,
                name: this.state.searchName,
            }
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            selectCompanyId: value?value:1
        }, () => {
            this.get_cpe_template_agency()
        })
    };

    render() {
        let option=this.props.ci2801Info.deviceList.map((item) => {
            return <Option value={item.model} key={item.id}>{item.model}</Option>
        });
        let option2 = [<Option value="STEP" key="边缘节点">@边缘节点</Option>,
            <Option value="CSTEP" key="中心节点">@中心节点</Option>];
        let option3 = [<Option value="ONLINE,OFFLINE" key="激活">@激活</Option>,
            <Option value="INIT" key="未激活">@未激活</Option>];
        let optionFour=this.props.ci2801Info.companyList.map((item)=>{
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });

        const ModalOptions = {
            title: "@新增",
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: "ci2801Info/create_cpe_template_agency",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {company_id: this.state.company_id,},
            initPayload: {
                id: {ids: this.state.selectedIds, records: this.state.selectedRecords},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            },
            parentVm: this,
            InputItems: [sessionStorage.getItem('companyId') === "1" ? {
                type: "Select",
                labelName: "@企业名称",
                valName: "company_id",
                nativeProps: {
                    placeholder:'@请选择企业名称'
                },
                rules: [{required: true, message:'@请选择企业名称'}],
                children: this.props.ci2801Info.companyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }
                }),
                onChange:(value,vm)=>{
                    this.setState({
                        company_id:value
                    },()=>{
                        vm.props.form.setFieldsValue({agency_ids:undefined})
                        this.get_agency_list()
                    })
                }
            } : {},
                {
                    type: "Select",
                    labelName:'@节点名称',
                    valName: "agency_ids",
                    nativeProps: {
                        placeholder:'@请选择节点名称', mode: "multiple"
                    },
                    rules: [{required: true, message:'@请选择节点名称'}],
                    children: this.props.ci2801Info.agencyList.map((item) => {
                        if (item) {
                            return {key: item.id, value: item.id, name: item.name}
                        }
                    }),
                }, {
                    type: "Select",
                    labelName: '@设备型号',
                    valName: "model",
                    nativeProps: {
                        placeholder: '@请选择设备型号'
                    },
                    rules: [{required: true, message:'@请选择设备型号'}],
                    children: this.props.ci2801Info.deviceList.map((item) => {
                        if (item) {
                            return {key: item.id, value: item.model, name: item.model}
                        }
                    }),
                    onChange: (value, vm) => {
                        this.get_cpe_template(value)
                        vm.props.form.setFieldsValue({
                            ct_id: undefined,
                        });
                        // this.setState({
                        //     company_id: value
                        // })
                    }
                }, {
                    type: "Select",
                    labelName:"@CPE模板",
                    valName: "ct_id",
                    nativeProps: {
                        placeholder: '@请选择CPE模板'
                    },
                    rules: [{required: true, message: '@请选择CPE模板'}],
                    children: this.props.ci2801Info.cpeList.map((item) => {
                        if (item) {
                            return {key: item.id, value: item.id, name: item.name}
                        }
                    })
                }, {
                    type: "Input",
                    labelName: "@配置名称",
                    valName: "name",
                    nativeProps: {
                        placeholder: "@请输入配置名称",
                    },
                    rules: [{required: true, message:'@请输入配置名称'}],
                },]
        };
        const column =  [{
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
            fixed:"left",
            width:180,

        },  {
            title: '@节点类型',
            dataIndex: 'agency_type',
            key: 'agency_type',
            width:130,
            render: (text) => {
                return text === "CSTEP" ? "@中心节点" : "@边缘节点"
            }
        }, {
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',

        }, {
            title: '@配置名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@私网IP段',
            dataIndex: 'iptables',
            key: 'iptables',
            width:200,

        }, {
            title: '@状态',
            dataIndex: 'device_status',
            key: 'device_status',
            width:80,
            render: (text) => {
                //return text===""||"INIT"?"未激活":"已激活"
                switch (text) {
                    case "":
                        return "@未激活";
                    case "INIT":
                        return "@未激活";
                    case "ONLINE":
                        return "@激活";
                    case "OFFLINE":
                        return "@激活";
                    default:
                        return ""
                }
            }
        }, {
            title: '@硬件ID',
            dataIndex: 'sn',
            key: 'sn',
            width:280,
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:"right",
            width:100,

            render: (index, record) => {
                return (
                    <div style={{display: "inline-block"}}>
                        <Link style={{color: "rgb(109,109,109)", padding: 0}} className="operations-edit-btn" to={{
                            pathname: "/main/ci2801/ci2802",
                            search: "?id=" + record.id + "&agency_name=" + record.agency_name + "&agency_id=" + record.agency_id
                        }}><Icon type="edit" className="operations-edit-btn"/></Link>
                        <Popconfirm title="@确定删除当前信息?" onConfirm={() => this.delete(record)}><Icon
                            type="delete" style={{}} className="operations-delete-btn"/></Popconfirm>
                    </div>
                )
            }
        },];
        const columns = [{
            title: "@企业名称",
            dataIndex: "company_abbr",
            key: "company_abbr",
            fixed:"left",
            width:180,
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@节点类型',
            dataIndex: 'agency_type',
            key: 'agency_type',
            render: (text) => {
                return text === "CSTEP" ? "@中心节点" : "@边缘节点"
            }
        }, {
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',

        }, {
            title:'@配置名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '@私网IP段',
            dataIndex: 'iptables',
            key: 'iptables',

        }, {
            title: '@状态',
            dataIndex: 'device_status',
            key: 'device_status',
            render: (text) => {
                //return text===""||"INIT"?"未激活":"已激活"
                switch (text) {
                    case "":
                        return "@未激活";
                    case "INIT":
                        return "@未激活";
                    case "ONLINE":
                        return "@激活";
                    case "OFFLINE":
                        return "@激活";
                    default:
                        return ""
                }
            }
        }, {
            title: '@硬件ID',
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:"right",
            width:100,

            render: (index, record) => {
                return (
                    <div style={{display: "inline-block"}}>
                        <Link style={{color: "rgb(109,109,109)", padding: 0}} className="operations-edit-btn" to={{
                            pathname: "/main/ci2801/ci2802",
                            search: "?id=" + record.id + "&agency_name=" + record.agency_name + "&agency_id=" + record.agency_id
                        }}><Icon type="edit" className="operations-edit-btn"/></Link>
                        <Popconfirm title="@确定删除当前信息?" onConfirm={() => this.delete(record)}><Icon
                            type="delete" style={{}} className="operations-delete-btn"/></Popconfirm>
                    </div>
                )
            }
        }];
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           hasSelect={true}
                           selectPlaceHolder={'@请选择设备型号'}
                           selectOneWidth={140}
                           selectTwoWidth={140}
                           selectThreeWidth={140}
                           selectFourWidth={140}
                           searchInputWidth={140}
                           selectTwoPlaceHolder={'@请选择节点名称'}
                           selectThreePlaceHolder={'@请选择激活状态'}
                           selectOneMethod={this.handleSelectModel}
                           options={option}
                           selectTwoMethod={this.handleSelectType}
                           optionsTwo={option2}
                           selectThreeMethod={this.handleSelectStatus}
                           optionsThree={option3}
                           hasSelectTwo={true}
                           hasSelectThree={true}
                           hasAdd={true}
                           hasDelete={true}
                           delete={this.handleDeleteBatch}
                           add={this.handleOpenAdd}
                           selectedKeys={this.state.selectedIds}
                           submit={this.search}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true} hasSelectFour={sessionStorage.getItem('companyId') === "1"}
                           selectFourPlaceHolder={"@请选择公司"} optionsFour={optionFour}
                           selectFourMethod={this.handleSelectCompany}/>
                <BossTable columns={sessionStorage.getItem('companyId') === "1"?columns:column} dataSource={this.props.ci2801Info.dataSource} rowSelection={rowSelection} scroll={{x:'max-content'}}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(BI1903);