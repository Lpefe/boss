/*@运维-库存信息*/
const outStockModalOptionsGenerator = (vm) => {
    return {
        title: "@出库",
        visible: vm.state.outStockModalShow,
        onCancel: vm.cancelOutStockModal,
        dispatch: vm.props.dispatch,
        submitType:
            "mi0201Info/out_stock",
        extraUpdatePayload:
            {
                id: vm.state.editId
            },
        initialValues: Object.assign({},{os:"Openwrt-Mips",device_type:"CSTEP",name:vm.state.editRecord.name}),
        initPayload: {
            status: vm.state.status,
            model: vm.state.model,
            name: vm.state.name,
            is_reserved: vm.state.is_reserved
        },
        InputItems: [{
            type: "Radio",
            labelName: "@设备类型",
            valName: "device_type",
            nativeProps: {
                placeholder: "@请选择设备类型"
            },
            rules: [{required: true, message: "@请选择设备类型"}],
            children: [{name: "HCPE", value: "CSTEP", key: "CSTEP"}, {
                name: "BCPE",
                value: "STEP",
                key: "STEP"
            }, {
                name: "AP",
                value: "AP",
                key: "AP"
            }],
        }, {
            type: "Radio",
            labelName: "@操作系统",
            valName: "os",
            nativeProps: {
                placeholder: "@请选择操作系统",
            },
            customerFormLayout: {
                labelCol: {
                    xs: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 18},
                },
            },
            rules: [{required: true, message: "@请选择操作系统"}],
            onChange:(value,modalComponent)=>{
                vm.setState({
                    selectedDeviceOS:value.target.value
                },function(){
                    if(vm.state.selectedDeviceModel&&vm.state.selectedDeviceOS){
                        vm.props.dispatch({
                            type:"mi0201Info/get_sn",
                            payload:{
                                os:vm.state.selectedDeviceOS,
                                model:vm.state.selectedDeviceModel,
                                modalComponent:modalComponent
                            }
                        });
                    }
                })
            },
            children: [{name: "Openwrt-Mips", value: "Openwrt-Mips", key: "Openwrt-Mips"}, {
                name: "Openwrt-X86",
                value: "Openwrt-x86",
                key: "Openwrt-x86"
            }, {name: "CentOS", value: "CentOS", key: "CentOS"}],
        }, {
            type: "Input",
            labelName: "@设备序列号",
            valName: "sn",
            nativeProps: {
                placeholder: "@自动生成序列号",
                disabled:true,
            },
        }, {
            type: "Input",
            labelName: "@设备名称",
            valName: "name",
            nativeProps: {
                placeholder: "@请输入设备名称"
            },
            rules: [{required: true, message: "@请输入设备名称"}, {max: 128, message: "@设备名称最多输入32字符"}],
        }, {
            type: "Select",
            labelName: "@企业",
            valName: "company_id",
            nativeProps: {
                placeholder: "@请选择企业",
            },
            onChange: (value,modalComponent) => {
                modalComponent.props.form.setFieldsValue({agency_id:undefined});
                vm.setState({
                    selectedCompany: value
                }, function () {
                    vm.props.dispatch({
                        type: "mi0201Info/get_agency_list",
                        payload: {
                            company_id: vm.state.selectedCompany
                        }
                    })
                })
            },
            rules: [{required: true, message: "@请选择企业"}],
            children: vm.props.mi0201Info.companyList.map((item) => {
                return {value: item.id, key: item.id, name: item.company_abbr}
            }),
        }, {
            type: "Select",
            labelName: "@节点",
            valName: "agency_id",
            nativeProps: {
                placeholder: "@请选择节点",
            },
            rules: [{required: true, message: "@请选择节点"}],
            children: vm.props.mi0201Info.agencyList.map((item) => {
                return {value: item.id, key: item.id, name: item.name}
            }),
        }, {
            type: "Input",
            labelName: "@快递单号",
            valName: "delivery_number",
            nativeProps: {
                placeholder: "@请输入快递单号"
            },
            rules: [{max: 32, message: "@快递单号最多输入64字符"}],
        }, {
            type: "Input",
            labelName: "@快递公司",
            valName: "delivery_company",
            nativeProps: {
                placeholder: "@请输入快递公司"
            },
            rules: [{max: 64, message: "@快递公司名称最多输入32字符"}],
        },]
    }
};

const ModalOptionsGenerator = (vm) => {
    return {
        title: vm.state.editId ? "@编辑库存" : "@新增库存",
        visible: vm.state.editModalShow,
        onCancel: vm.cancelEditModal,
        dispatch: vm.props.dispatch,
        submitType: vm.state.editId ? "mi0201Info/update_stock" : "mi0201Info/create_stock",
        extraUpdatePayload: {id: vm.state.editId},
        initialValues: vm.state.editRecord,
        initPayload: {
            status: vm.state.status,
            model: vm.state.model,
            name: vm.state.name,
            is_reserved: vm.state.is_reserved
        },
        InputItems: [{
            type: "Input",
            labelName: "@硬件编号",
            valName: "hard_sn",
            nativeProps: {
                placeholder: "@请输入硬件编号",
                disabled:vm.state.editId!==""
            },
            rules: [{required: vm.state.editId==="", message: "@请输入硬件编号"}, {max: 64, message: "@硬件编号最多输入64字符"}],
        }, {
            type: "Select",
            labelName: "@设备型号",
            valName: "model",
            nativeProps: {
                placeholder: "@请选择设备型号",
            },
            rules: [{required: true, message: "@请选择设备型号"}],
            children: vm.props.mi0201Info.deviceModelList.map((model)=>{
                return {value: model.model, key: model.id, name: model.model}
            })
        }, {
            type: "Input",
            labelName: "@设备名称",
            valName: "name",
            nativeProps: {
                placeholder: "@请输入设备名称",
            },
            rules: [{required: true, message: "@请输入设备名称"}, {max: 128, message: "@设备名称最多输入128字符"}],
        }, {
            type: "CheckBox",
            labelName: "@是否预定",
            valName: "is_reserved",
            checkBoxName: "@已预订",
            initialValue:false,
            nativeProps: {},
            rules: [],
            children: [{name: "@是", value: true, key: "true"}, {
                name: "@否",
                value: false,
                key: "false"
            }]
        }, {
            type: "TextArea",
            labelName: "@备注",
            valName: "remark",
            nativeProps: {
                placeholder: "@请输入备注",
                autosize: {minRows: 6, maxRows: 12},
            },
            rules: [],
        }]
    }
};

const reserveModalOptionsGenerator = (vm) => {
    return {
        title: "@预定说明",
        visible: vm.state.reserveModalShow,
        onCancel: vm.cancelReserveModal,
        dispatch: vm.props.dispatch,
        submitType: "mi0201Info/update_stock_batch",
        extraUpdatePayload: {ids: vm.state.id_list, is_reserved: true,records:vm.state.selectedRecords},
        initialValues: vm.state.editRecord,
        bodyHeight: 180,
        initPayload: {
            status: vm.state.status,
            model: vm.state.model,
            name: vm.state.name,
            is_reserved: vm.state.is_reserved
        },
        InputItems: [{
            type: "TextArea",
            labelName: "@预定说明",
            valName: "remark",
            nativeProps: {
                placeholder: "@请输入预定说明",
                autosize: {minRows: 6, maxRows: 12},
            },
            rules: [{required: true, message: "@请输入预定说明"}, {max: 128, message: "@预定说明最多输入128字符"}],
        }]
    }
};

const batchOutStockModalOptionGenerator = (vm) => {
    return {
        title: "批量出库",
        visible: vm.state.batchOutStockModalShow,
        onCancel: vm.handleCloseBatchOutStockModal,
        dispatch: vm.props.dispatch,
        submitType: "mi0201Info/out_stock_batch",
        extraUpdatePayload: {ids: vm.state.id_list},
        initialValues: {
            device_type: 'CSTEP',
            os: 'Openwrt-Mips',
        },
        bodyHeight: 380,
        initPayload: {
            model: vm.state.model,
            name: vm.state.name,
            is_reserved: vm.state.is_reserved,
            status: vm.state.status,
        },
        InputItems: [{
            type: "Radio",
            labelName: "@设备类型",
            valName: "device_type",
            nativeProps: {
                placeholder: "@请选择设备类型"
            },
            rules: [{required: true, message: "@请选择设备类型"}],
            children: [{name: "HCPE", value: "CSTEP", key: "CSTEP"}, {
                name: "BCPE",
                value: "STEP",
                key: "STEP"
            }, {
                name: "AP",
                value: "AP",
                key: "AP"
            }],
        }, {
            type: "Radio",
            labelName: "@操作系统",
            valName: "os",
            nativeProps: {
                placeholder: "@请选择操作系统",
            },
            customerFormLayout: {
                labelCol: {
                    xs: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 18},
                },
            },
            rules: [{required: true, message: "@请选择操作系统"}],
            onChange: (value, modalComponent) => {
                vm.setState({
                    selectedDeviceOS: value.target.value
                }, function () {
                    if (vm.state.selectedDeviceModel && vm.state.selectedDeviceOS) {
                        vm.props.dispatch({
                            type: "mi0201Info/get_sn",
                            payload: {
                                os: vm.state.selectedDeviceOS,
                                model: vm.state.selectedDeviceModel,
                                modalComponent: modalComponent
                            }
                        });
                    }
                })
            },
            children: [{name: "Openwrt-Mips", value: "Openwrt-Mips", key: "Openwrt-Mips"}, {
                name: "Openwrt-X86",
                value: "Openwrt-x86",
                key: "Openwrt-x86"
            }, {name: "CentOS", value: "CentOS", key: "CentOS"}],
        }, {
            type: "Select",
            labelName: "@企业",
            valName: "company_id",
            nativeProps: {
                placeholder: "@请选择企业",
            },
            onChange: (value, modalComponent) => {
                modalComponent.props.form.setFieldsValue({agency_id: undefined});
                vm.setState({
                    selectedCompany: value
                }, function () {
                    vm.props.dispatch({
                        type: "mi0201Info/get_agency_list",
                        payload: {
                            company_id: vm.state.selectedCompany
                        }
                    })
                })
            },
            rules: [{required: true, message: "@请选择企业"}],
            children: vm.props.mi0201Info.companyList.map((item) => {
                return {value: item.id, key: item.id, name: item.company_abbr}
            }),
        }, {
            type: "Select",
            labelName: "@节点",
            valName: "agency_id",
            nativeProps: {
                placeholder: "@请选择节点",
            },
            rules: [{required: true, message: "@请选择节点"}],
            children: vm.props.mi0201Info.agencyList.map((item) => {
                return {value: item.id, key: item.id, name: item.name}
            }),
        },]
    }
};

export {outStockModalOptionsGenerator, ModalOptionsGenerator, reserveModalOptionsGenerator,batchOutStockModalOptionGenerator}