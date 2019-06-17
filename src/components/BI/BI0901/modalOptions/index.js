/*@技术支持-中心节点*/
import {commonTranslate, validateIp} from "../../../../utils/commonUtilFunc";
import mapMessages from "../../../../locales/mapMessages";

const centerNodeModalOptionsGenerator = (component) => {
    const __ = commonTranslate(component);
    return {
        title: component.state.editId ? '@编辑中心节点' : '@新增中心节点',
        visible: component.state.ifEditModalShow,
        onCancel: component.closeAddModal,
        dispatch: component.props.dispatch,
        submitType: component.state.editId ? "bi0901Info/update_agency" : "bi0901Info/create_agency",
        hasSubmitCancel: component.state.editId === undefined,
        submitCancel: (vm) => {
            vm.props.form.setFieldsValue({
                name: undefined,
                address: undefined,
                receive_name: undefined,
                receive_tel: undefined
            });
        },
        parentVm: component,
        extraUpdatePayload: (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") ? {
            company_id: sessionStorage.getItem("companyId"),
            type: "CSTEP",
            id: component.state.editId
        } : {type: "CSTEP", id: component.state.editId},
        initialValues: component.state.editId ? component.state.editRecord : {
            has_public_ip: 1,
            converged: false,
        },
        initPayload: (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") ? {
            type: "CSTEP",
            company_id: sessionStorage.getItem("companyId"),
            name: component.state.name,
            page_no: component.state.page_no,
            page_size: component.state.page_size
        } : {
            type: "CSTEP",
            company_id: component.state.company_id,
            name: component.state.name,
            page_no: component.state.page_no,
            page_size: component.state.page_size
        },
        InputItems: [(sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") ? {} : {
            type: "Select",
            labelName: '@企业名称',
            valName: "company_id",
            nativeProps: {
                placeholder: '@请选择企业',
                disabled:component.state.editId!==undefined

            },
            rules: [{required: true, message: '@请选择企业'}],
            children: component.props.bi0901Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }

            })
        }, {
            type: "Input",
            labelName: '@名称',
            valName: "name",
            nativeProps: {
                placeholder: '@请输入中心节点名称'
            },
            rules: [{required: true, message: '@请输入中心节点名称'}, {
                max: 128,
                message: '@请输入中心节点名称最多输入128字符'
            }],
        }, {
            type: "Select",
            labelName: '@所在国家',
            valName: "level1_id",
            nativeProps: {
                placeholder: '@请选择所在国家',
                showSearch: true,
                filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            children: component.props.bi0901Info.countryList.map((item) => {
                return {name: __(mapMessages[item.name],item.name), value: item.id, key: item.id}
            }),
            rules: [{required: true, message: "@请选择所在国家"}],
            onChange: (value, vm) => {
                component.get_province(value);
                vm.props.form.setFieldsValue({"level3_id": undefined, "level2_id": undefined})
            }
        }, {
            type: "Select",
            labelName: '@所在省份',
            valName: "level2_id",
            nativeProps: {
                placeholder: '@请选择所在省份',
                showSearch: true,
                filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            children: component.props.bi0901Info.provinceList.map((item) => {
                return {name: __(mapMessages[item.name],item.name), value: item.id, key: item.id}
            }),
            onChange: (value, vm) => {
                component.get_city(value);
                vm.props.form.setFieldsValue({"level3_id": undefined})
            },
            rules: [{required: true, message: '@请选择所在省份'}],
        }, {
            type: "Select",
            labelName: '@所在城市',
            valName: "level3_id",
            nativeProps: {
                placeholder: '@请选择所在城市',
                showSearch: true,
                filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            children: component.props.bi0901Info.cityList.map((item) => {
                return {name: item.name, value: item.id, key: item.id}
            }),
            rules: [{required: true, message: '@请选择所在城市'}],
        }, {
            type: "Input",
            labelName: '@收货地址',
            valName: "address",
            nativeProps: {
                placeholder: '@请输入收货地址'
            },
            rules: [{max: 128, message: '@收货地址最多输入128字符'}],
        }, {
            type: "Input",
            labelName: '@收货联系人',
            valName: "receive_name",
            nativeProps: {
                placeholder: '@请输入收货联系人'
            },
            rules: [{max: 128, message: '@收货联系人最多输入128字符'}],
        }, {
            type: "Input",
            labelName: '@联系电话',
            valName: "receive_tel",
            nativeProps: {
                placeholder: '@请输入联系电话'
            },
            rules: [{max: 50, message: '@联系电话最多输入128字符'}],
        }, {
            type: "Radio",
            labelName: "@汇聚点",
            valName: "converged",
            nativeProps: {
                placeholder: "@请选择是否是汇聚点"
            },
            rules: [{required: true, message: "@请选择是否是汇聚点"}],
            children: [{value: true, name: "@是", key: "1"}, {
                value: false,
                name: "@否",
                key: "0"
            }],
        }, {
            type: "Radio",
            labelName: "@公网IP",
            valName: "has_public_ip",
            nativeProps: {
                placeholder: "@请选择是否有公网IP"
            },
            rules: [{required: true, message: "@请选择是否有公网IP"}],
            children: [{value: 1, name: "@有", key: "1"}, {
                value: -1,
                name: "@无",
                key: "0"
            }]
        }, {
            type: "GroupInput",
            labelName:"@IP段",
            valName: "iptables",
            nativeProps: {
                placeholder: "@IP段"
            },
            rules: [{validator: validateIp}],
        },{
            type: "Input",
            labelName: "@备注",
            valName: "remark",
            nativeProps: {
                placeholder: "@请输入备注"
            },
            rules: [],
        },]
    }

};

export {centerNodeModalOptionsGenerator}