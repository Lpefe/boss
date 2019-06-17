/*@技术支持-SSID分配*/
import React from 'react';
import {Card, Select,Popconfirm,Icon} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";
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
            company_id:sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin" ?"":sessionStorage.getItem("companyId"),
            selectedIds: [],
            selectedRecords: [],
            searchName: "",
            selectCompanyId: sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin" ?"":sessionStorage.getItem("companyId"),
        };

    }
    componentDidMount() {
        this.getSsidTemplateAgency();
        this.getCompanyList()
    }

    getSsidTemplateAgency = () => {
        this.props.dispatch({
            type: "bi1903Info/get_wifi_template_agency",
            payload: {
                company_id: this.state.selectCompanyId,
                name: this.state.searchName
            }
        });
    }
    get_device_model = () => {
        this.props.dispatch({
            type: "bi1903Info/get_device_model",
            payload: {
                hardware_type: "AP",
            }
        });
    }
    getAgencyList = (exc_stid) => {
        this.props.dispatch({
            type: "bi1903Info/get_agency_list",
            payload: {
                company_id: this.state.company_id,
                exc_stid: exc_stid
            }
        });
    }
    getSsidTemplate = (id) => {
        this.props.dispatch({
            type: "bi1903Info/get_wifi_template",
            payload: {
                company_id: id
            }
        });
    }
    getCompanyList = () => {
        this.props.dispatch({
            type: "bi1903Info/get_company_list",
            payload: {}
        });
    }
    handleOpenAdd = () => {
        const vm = this
        this.setState({
            visible: true,
        })
        this.getCompanyList()
        this.get_device_model()
        this.getSsidTemplate(vm.state.company_id);
    }

    handleSelectStatus = (value) => {
        this.setState({
            selectCompanyId: value || ""
        }, function () {
            this.props.dispatch({
                type: "bi1903Info/get_wifi_template_agency",
                payload: {
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName
                }
            })
        })
    };


    search = (value) => {
        this.setState({
            searchName: value || ""
        }, function () {
            this.props.dispatch({
                type: "bi1903Info/get_wifi_template_agency",
                payload: {
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName
                }
            })
        })
    };
    edit = (record) => {
        this.props.dispatch({
            type: "bi1903Info/update_wifi_template_agency",
            payload: {
                id: {ids: [record.id],record:record},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            company_id:sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin"? "":sessionStorage.getItem("companyId"),
        },  ()=> {
            this.getSsidTemplateAgency()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "bi1903Info/delete_wifi_template_agency",
            payload: {
                payload: {
                    ids: [record.id],
                    records: [record]
                },
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };
    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "bi1903Info/delete_wifi_template_agency",
            payload: {
                payload: {
                    ids: this.state.selectedIds,
                    records:this.state.selectedRecords
                },
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };
    handleUpdate = () => {
        this.props.dispatch({
            type: "bi1903Info/update_wifi_template_agency",
            payload: {
                id: {ids: this.state.selectedIds, records: this.state.selectedRecords},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };

    render() {
        const __ = commonTranslate(this);
        var option = []
        this.props.bi1903Info.companyList.map((item) => {
            return option.push(<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
        })
        const supercxptechsupport = [
            {
            type: "Select",
            labelName: '@企业名称',
            valName: "company_id",
            nativeProps: {
                placeholder: '@请选择企业'
            },
            rules: [{required: true,message: '@请选择企业'}],
            children: this.props.bi1903Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }
            }),
            onChange: (value, vm) => {
                this.getSsidTemplate(value);
                vm.props.form.setFieldsValue({
                    st_id: undefined,
                    agency_ids: undefined,

                });
                this.setState({
                    company_id: value
                })
            }
        }, {
            type: "Select",
            labelName: '@设备型号',
            valName: "model",
            nativeProps: {
                placeholder: '@请选择设备型号'
            },
            rules: [{required: true,message: '@请选择设备型号'}],
            children: this.props.bi1903Info.deviceList.map((item) => {
                if (item) {
                    return {key: item.model, value: item.model, name: item.model}
                }
            }),
        }, {
            type: "Select",
            labelName: '@SSID模板',
            valName: "st_id",
            nativeProps: {
                placeholder: '@请选择SSID模板'
            },
            rules: [{required: true,message: '@请选择SSID模板'}],
            children: this.props.bi1903Info.WIFITemplateList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.ssid}
                }
            }),
            onChange: (value, vm) => {
                this.getAgencyList(value)
                vm.props.form.setFieldsValue({
                    agency_ids: undefined,
                });
            }
        },{
            type: "Select",
            labelName: '@节点名称',
            valName: "agency_ids",
            nativeProps: {
                placeholder: '@请选择节点名称', mode: "multiple"
            },
            rules: [{required: true,message: '@请选择节点名称'}],
            children: this.props.bi1903Info.agencyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }

            })
        },]
        const company = [{
            type: "Select",
            labelName: '@设备型号',
            valName: "model",
            nativeProps: {
                placeholder: '@请选择设备型号'
            },
            rules: [{required: true,message: '@请选择设备型号'}],
            children: this.props.bi1903Info.deviceList.map((item) => {
                if (item) {
                    return {key: item.model, value: item.model, name: item.model}
                }
            }),
        }, {
            type: "Select",
            labelName: '@SSID模板',
            valName: "st_id",
            nativeProps: {
                placeholder: '@请选择SSID模板'
            },
            rules: [{required: true,message: '@请选择SSID模板'}],
            children: this.props.bi1903Info.WIFITemplateList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.ssid}
                }
            }),
            onChange: (value, vm) => {
                this.getAgencyList(value)
                vm.props.form.setFieldsValue({
                    agency_ids: undefined,
                });
            }
        },{
            type: "Select",
            labelName: '@节点名称',
            valName: "agency_ids",
            nativeProps: {
                placeholder: '@请选择节点名称', mode: "multiple"
            },
            rules: [{required: true,message: '@请选择节点名称'}],
            children: this.props.bi1903Info.agencyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }

            })
        },]
        const ModalOptions = {
            title: this.state.editId ? "@编辑" : "@新增",
            bodyHeight:300,
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "bi1903Info/update_wifi_template_agency" : "bi1903Info/create_wifi_template_agency",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {
                company_id: this.state.company_id,
            },
            initPayload: {
                id: {ids: this.state.selectedIds, records: this.state.selectedRecords},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            },
            parentVm: this,
            InputItems: sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin" ?supercxptechsupport:company
        
        };

        const columns = [{
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        },{
            title: '@SSID模板',
            dataIndex: 'ssid',
            key: 'ssid',
        }, {
            title: '@频段',
            dataIndex: 'band',
            key: 'band',
        }, {
            title: "VLAN",
            dataIndex: 'vlan',
            key: 'vlan',
        }, {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@模板更新',
            dataIndex: 'to_update',
            key: 'to_update',
            render:(text)=>{
                return text?"有":"无"
            }
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
                        <Popconfirm title="@确定更新当前信息?" onConfirm={() => this.edit(record)}>
                            <Icon type="reload" style={{}} className="operations-edit-btn"/>
                        </Popconfirm>
                        <Popconfirm title="@确定删除当前信息?" onConfirm={() => this.delete(record)}>
                            <Icon type="delete" style={{}} className="operations-delete-btn"/>
                        </Popconfirm>
                    </div>
                )
            }
        },];

        const columnsCompany = [{
            title: '@设备型号',
            dataIndex: 'model',
            key: 'model',
        },{
            title: '@SSID模板',
            dataIndex: 'ssid',
            key: 'ssid',
        }, {
            title: '@频段',
            dataIndex: 'band',
            key: 'band',
        }, {
            title: "VLAN",
            dataIndex: 'vlan',
            key: 'vlan',
        }, {
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: '@模板更新',
            dataIndex: 'to_update',
            key: 'to_update',
            render:(text)=>{
                return text?"有":"无"
            }
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
                        <Popconfirm title="@确定更新当前信息?" onConfirm={() => this.edit(record)}>
                            <Icon type="reload" style={{}} className="operations-edit-btn"/>
                        </Popconfirm>
                        <Popconfirm title="@确定删除当前信息?" onConfirm={() => this.delete(record)}>
                            <Icon type="delete" style={{}} className="operations-delete-btn"/>
                        </Popconfirm>
                    </div>
                )
            }
        },];
        
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                console.log(selectedRecords)
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           hasSelect={sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin" ?true:false}
                           selectPlaceHolder={'@请选择企业名称'}
                           selectOneWidth={220}
                           selectOneMethod={this.handleSelectStatus}
                           options={option}
                           hasAdd={true}
                           hasDelete={true}
                           delete={this.handleDeleteBatch}
                           add={this.handleOpenAdd}
                           selectedKeys={this.state.selectedIds}
                           submit={this.search}
                           hasExtraBtnThree={true}
                           extraBtnNameThree={"@批量更新"}
                           btnThreeFunc={this.handleUpdate}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true}/>

                <BossTable columns={sessionStorage.getItem("role") === "supercxptechsupport"||sessionStorage.getItem("role") === "supercxptechadmin" ?columns:columnsCompany} dataSource={this.props.bi1903Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(BI1903);