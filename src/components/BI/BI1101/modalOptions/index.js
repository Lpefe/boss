/*@技术支持-链路管理*/
const linkTypeMap=function(type){
    const linkType={
        "国内组网":"@国内组网",
        "全球组网":"@全球组网",
        "国内SaaS加速":"@国内SaaS加速",
        "全球SaaS加速":"@全球SaaS加速"
    };
    return linkType[type]||type
};

const multipleEditModalOptionsGenerator=(component)=>{
    return {
        title:"@批量编辑链路",
        visible: component.state.ifMultipleEditModalShow,
        onCancel: component.handleCloseEditLinkBathModal,
        dispatch: component.props.dispatch,
        submitType: "bi1101Info/update_link_batch",
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id,
            page_no:component.state.page_no,
            page_size:component.state.page_size
        },
        initialValues: {

        },
        extraUpdatePayload:{
            ids:component.state.selectedIds
        },
        InputItems: [{
            type: "CheckBox",
            labelName:"",
            valName: "ifEditGrade",
            checkBoxName: "@修改服务等级",
            customerFormLayout: {
                wrapperCol: {
                    xs: {span: 16, offset: 5},
                }
            },
            onChange:(e,modalComponent)=>{
                component.setState({
                    ifEditGrade:e.target.checked
                },()=>{
                    modalComponent.props.form.validateFields(["grade","bandwidth"], { force: true });
                    if(component.state.ifEditGrade){
                        modalComponent.props.form.setFieldsValue({"grade":undefined});
                    }
                })
            }
        },{
            type: "Select",
            labelName: "@选择服务等级",
            valName: "grade",
            nativeProps: {
                placeholder:"@请选择服务等级",
                disabled:!component.state.ifEditGrade
            },
            rules: [{required: component.state.ifEditGrade, message: "@请选择服务等级"}],
            children:[{key: "CLOUD_VPN", value: "CLOUD_VPN", name:"@云VPN"}, {
                key: "CLOUD_SPLINE",
                value: "CLOUD_SPLINE",
                name: "@云专线"
            }, {key: "SUPER_CLOUD_SPLINE", value: "SUPER_CLOUD_SPLINE", name:"@超级云专线"}],
        }, {
            type: "CheckBox",
            labelName:"",
            valName: "ifEditBandwidth",
            checkBoxName: "@修改带宽",
            customerFormLayout: {
                wrapperCol: {
                    xs: {span: 16, offset: 5},
                }
            },
            onChange:(e,modalComponent)=>{
                component.setState({
                    ifEditBandwidth:e.target.checked
                },()=>{
                    modalComponent.props.form.validateFields(["bandwidth","grade"], { force: true });
                    if(component.state.ifEditGrade){
                        modalComponent.props.form.setFieldsValue({"bandwidth":undefined});
                    }
                })
            }
        },{
            type: "InputNumber",
            labelName:"@带宽",
            valName: "bandwidth",
            nativeProps: {
                placeholder: "@请输入带宽",
                disabled:!component.state.ifEditBandwidth,
                style: {
                    width: 150
                }
            },
            rules: [{required: component.state.ifEditBandwidth, message: "@请输入带宽"},{
                pattern: /^[1-9]\d*$/, message: "@只能输入正整数"
            }],
        },]
    };
};

const editModalOptionsGenerator = (component) => {
    return {
        title: component.state.editId ? "@编辑链路" : "@新增链路",
        visible: component.state.ifEditModalShow,
        onCancel: component.closeAddModal,
        dispatch: component.props.dispatch,
        submitType: component.state.editId ? "bi1101Info/update_link" : "bi1101Info/create_link",
        extraUpdatePayload: {id: component.state.editId, has_device_id: component.state.editRecord.device_id},
        initialValues: component.state.editRecord,
        hasSubmitCancel: component.state.editId === "",
        submitCancel: (vm) => {
            vm.props.form.setFieldsValue({
                edge_id: undefined,
                device_id: undefined,
                name: undefined,
                backup_name: undefined,
            });
        },
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        InputItems: [{
            type: "Select",
            labelName: "@企业名称",
            valName: "company_id",
            nativeProps: {
                placeholder: "@请选择企业",
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: "@请选择企业"}],
            children: component.props.bi1101Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }
            }),
            onChange: (value, vm) => {
                component.get_edge_agency_list(value);
                component.get_center_agency_list(value);
                component.get_speed_rule(value);
                vm.props.form.setFieldsValue({
                    edge_id: undefined,
                    agency_id: undefined,
                    backup_agency_id: undefined,
                    device_id: undefined
                });
                component.props.dispatch({
                    type: "bi1101Info/reset_device_list",
                    payload: {}
                })
            }
        }, {
            type: "Select",
            labelName: "@边缘",
            valName: "edge_id",
            nativeProps: {
                placeholder: "@请选择边缘节点",
                disabled: (component.state.editId !== ""),
            },
            rules: [{required: true, message: "@请选择边缘节点"}],
            children: component.props.bi1101Info.agencyListEdge.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                component.get_device_list(value);
                //根据edge和center节点名,生成默认链路名
                vm.props.form.resetFields(["device_id"]);
                let agency_id = vm.props.form.getFieldValue("agency_id");
                let backup_agency_id = vm.props.form.getFieldValue("backup_agency_id");
                let edge_name = "";
                let center_name = "";
                let edge_id = value;
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (agency_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"name": edge_name + "-" + center_name})
                }
                if (backup_agency_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === backup_agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"backup_name": edge_name + "-" + center_name})
                }
            }
        }, {
            type: "Select",
            labelName: "",
            customerFormLayout: {
                wrapperCol: {
                    xs: {span: 16, offset: 5},
                }
            },
            valName: "device_id",
            nativeProps: {
                placeholder: "@请选择边缘节点设备",
                disabled: component.state.editId !== "",
            },
            rules: [],
            children: component.props.bi1101Info.deviceList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
        }, {
            type: "Select",
            labelName: "@中心",
            valName: "agency_id",
            nativeProps: {
                placeholder: "@请选择中心节点",
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: "@请选择中心节点"}],
            children: component.props.bi1101Info.agencyListCenter.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                let agency_id = value;
                let edge_name = "";
                let center_name = "";
                let edge_id = vm.props.form.getFieldValue("edge_id");
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (edge_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"name": edge_name + "-" + center_name})
                }
            }
        }, component.state.ifBackUpLine ? {
            type: "Select",
            labelName: "@备中心",
            valName: "backup_agency_id",
            nativeProps: {
                placeholder: "@请选择备中心节点",
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: "@请选择备中心节点"}],
            children: component.props.bi1101Info.agencyListCenter.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                let agency_id = value;
                let edge_name = "";
                let center_name = "";
                let edge_id = vm.props.form.getFieldValue("edge_id");
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (edge_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"backup_name": edge_name + "-" + center_name})
                }

            }
        } : "", {
            type: "Input",
            labelName: "@链路名称",
            valName: "name",
            nativeProps: {
                placeholder: "@请输入链路名称"
            },
            rules: [{required: true, message: "@请输入链路名称"}],
        }, component.state.ifBackUpLine ? {
            type: "Input",
            labelName: "@备链路名称",
            valName: "backup_name",
            nativeProps: {
                placeholder: "@请输入备链路名称"
            },
            rules: [{required: true, message: "@请输入备链路名称"}],
        } : "", {
            type: "Select",
            labelName: "@服务等级",
            valName: "grade",
            nativeProps: {
                placeholder: "@请选择服务等级"
            },
            rules: [{required: true, message: "@请选择服务等级"}],
            children: [{key: "CLOUD_VPN", value: "CLOUD_VPN", name: "@云VPN"}, {
                key: "CLOUD_SPLINE",
                value: "CLOUD_SPLINE",
                name: "@云专线"
            }, {key: "SUPER_CLOUD_SPLINE", value: "SUPER_CLOUD_SPLINE", name: "@超级云专线"}]
        }, {
            type: "Select",
            labelName: "@链路类型",
            valName: "link_type",
            nativeProps: {
                placeholder: "@请选择链路类型"
            },
            rules: [{required: true, message: "@请选择链路类型"}],
            children: component.props.bi1101Info.typeList.map((item) => {
                if (item) {
                    return {key: item, value: item, name: linkTypeMap(item)}
                }
            }),
        }, {
            type: "Input",
            labelName: "@带宽(M)",
            valName: "bandwidth",
            nativeProps: {
                placeholder: "@请输入带宽"
            },
            rules: [{required: true, message: "@请输入带宽"}],
        }, {
            type: "Select",
            labelName: "@计费模式",
            valName: "charge_type",
            nativeProps: {
                placeholder: "@请选择计费模式"
            },
            rules: [{required: true, message: "@请选择计费模式"}],
            children: [{key: "固定计费", value: "固定计费", name: "@固定计费"}, {
                key: "流量计费",
                value: "流量计费",
                name: "@流量计费"
            }],
        }, {
            type: "InputNumber",
            labelName: "@RTT基准值" + "(ms)",
            valName: "rtt_limit",
            nativeProps: {
                placeholder: "@请输入RTT基准值",
                max:1000,
                style: {
                    width: 200
                }
            },
            rules: [{pattern: /^\d+$/, message: "只能输入正整数"},],
        },]
    }
};

const multipleAddModalOptionsGenerator = (component) => {
    return {
        title: "@批量新增链路",
        visible: component.state.ifMultipleAddModalShow,
        onCancel: component.closeMultipleAddModal,
        dispatch: component.props.dispatch,
        submitType: "bi1101Info/create_link_batch",
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        initialValues: {
            company_id: component.state.addModalInitialCompanyId
        },
        InputItems: [{
            type: "Select",
            labelName: "@企业名称",
            valName: "company_id",
            nativeProps: {
                placeholder: "@请选择企业",

            },
            rules: [{required: true, message: "@请选择企业"}],
            children: component.props.bi1101Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }
            }),
            onChange: (value) => {
                component.get_center_agency_list_batch(value);
                //component.get_edge_agency_list_batch(value);
                component.get_speed_rule(value);
            }
        },{
            type: "Select",
            labelName: "@中心",
            valName: "center_agency_id",
            nativeProps: {
                placeholder: "@请选择中心节点",
            },
            rules: [{required: true, message: "@请选择中心节点"}],
            children: component.props.bi1101Info.agencyListCenterBatch.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value,modalComponent) => {
                const val = modalComponent.props.form.getFieldsValue();
                component.get_edge_agency_list_batch(val.company_id,value);
            }
        }, {
            type: "Select",
            labelName: "@边缘",
            valName: "edge_agency_ids",
            nativeProps: {
                placeholder: "@请选择边缘节点",
                mode: "multiple"

            },
            rules: [{required: true, message: "@请选择边缘节点"}],
            children: component.props.bi1101Info.agencyListEdgeBatch.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
        },  {
            type: "Select",
            labelName: "@服务等级",
            valName: "grade",
            nativeProps: {
                placeholder: "@请选择服务等级"
            },
            rules: [{required: true, message: "@请选择服务等级"}],
            children: [{key: "CLOUD_VPN", value: "CLOUD_VPN", name: "@云VPN"}, {
                key: "CLOUD_SPLINE",
                value: "CLOUD_SPLINE",
                name: "@云专线"
            }, {key: "SUPER_CLOUD_SPLINE", value: "SUPER_CLOUD_SPLINE", name: "@超级云专线"}]
        }, {
            type: "Select",
            labelName: "@链路类型",
            valName: "link_type",
            nativeProps: {
                placeholder: "@请选择链路类型"
            },
            rules: [{required: true, message: "@请选择链路类型"}],
            children: component.props.bi1101Info.typeList.map((item) => {
                if (item) {
                    return {key: item, value: item, name: linkTypeMap(item)}
                }
            }),
        }, {
            type: "Input",
            labelName: "@带宽(M)",
            valName: "bandwidth",
            nativeProps: {
                placeholder: "@请输入带宽"
            },
            rules: [{required: true, message: "@请输入带宽"},],
        }, {
            type: "Select",
            labelName: "@计费模式",
            valName: "charge_type",
            nativeProps: {
                placeholder: "@请选择计费模式"
            },
            rules: [{required: true, message: "@请选择计费模式"}],
            children: [{key: "固定计费", value: "固定计费", name: "@固定计费"}, {
                key: "流量计费",
                value: "流量计费",
                name: "@流量计费"
            }],
        }, {
            type: "InputNumber",
            labelName: "@RTT基准值" + "(ms)",
            valName: "rtt_limit",
            nativeProps: {
                placeholder: "@请输入RTT基准值",
                max:1000,
                style: {
                    width: 200
                }
            },
            rules: [{pattern: /^\d+$/, message: "@只能输入正整数"}],
        },]
    };
};

const HAModalOptionsGenerator = (component) => {
    return {
        title: component.state.ifCenterHA ? "@中心HA设置" : "@边缘HA设置",
        visible: component.state.ifEditHAModalShow,
        onCancel: component.closeEditHAModal,
        dispatch: component.props.dispatch,
        submitType: "bi1101Info/set_backup_link",
        initialValues: Object.assign({}, component.state.editHARecord, {backup_link_id: component.state.ifCenterHA ? (component.state.editHARecord.backup_link_id || undefined) : (component.state.editHARecord.edge_backup_link_id || undefined)}),
        extraUpdatePayload: {
            link_id: component.state.editHAId,
            backup_type: component.state.ifCenterHA ? 'center' : 'edge'
        },
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        InputItems: [{
            type: "Plain",
            labelName: "@企业名称",
            content: component.state.editHARecord.company_abbr,
            height: 32
        }, {
            type: "Plain",
            labelName: "@中心节点",
            content: component.state.editHARecord.main,
            height: 32
        }, {
            type: "Plain",
            labelName: "@边缘节点",
            content: component.state.editHARecord.branch,
            height: 32
        }, {
            type: "Plain",
            labelName: "@主链路",
            content: component.state.editHARecord.name,
            height: 32
        }, {
            type: "Select",
            labelName: "@备链路",
            valName: "backup_link_id",
            nativeProps: {
                placeholder: "@请选择备链路"
            },
            rules: [{required: true, message: "@请选择备链路"}],
            children: component.props.bi1101Info.HALinkList.map((item) => {
                return {key: item.id, value: item.id, name: item.name}
            })
        }, {
            type: "Plain",
            labelName: "@说明",
            content: "",
            height: 32
        },]
    }
};

export {editModalOptionsGenerator, multipleAddModalOptionsGenerator, HAModalOptionsGenerator,multipleEditModalOptionsGenerator}