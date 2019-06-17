/*@客户-设备绑定*/
import React from 'react';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {Card, Select,Popconfirm} from 'antd';
import BossEditModal from "../../Common/BossEditModal";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";

const Option = Select.Option;

class CI3001C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bindModalShow: false,
            device_id: "",
            editRecord: {},
            agency_id: "",
            is_bind: "",
            power_status: "",
            name: "",
            company_id:""
        };
        this.companyId=sessionStorage.getItem('companyId');

    }

    componentDidMount() {
        this.get_device_list();
        if(this.companyId==="1"){
            this.get_company_list();
        }

    }

    handleSelectCompany=(value)=>{
        this.setState({
            company_id:value||""
        },()=>{
            this.get_device_list()
        })
    };

    get_company_list=()=>{
        this.props.dispatch({
            type:"ci3001Info/get_company_list",
            payload:{

            }
        })
    };



    get_device_list = () => {
        this.props.dispatch({
            type: "ci3001Info/get_device_list",
            payload: {
                company_id: sessionStorage.getItem('companyId')==='1'?this.state.company_id:sessionStorage.getItem('companyId'),
                status: "INIT",
                name: this.state.name,
                is_bind: this.state.is_bind,
                power_status: this.state.power_status,
                by_ztp:1
            }
        })
    };

    handleOpenBindModel = (record) => {
        this.setState({
            bindModalShow: true,
            editRecord: record,
            device_id: record.id,
            agency_id: record.agency_id,
        }, () => {
            this.get_agency_list(record.type, record.type === 'AP');
            if (record.agency_id) {
                this.get_cpe_template_agency(record)
            }
        })
    };

    handleCloseBindModel = () => {
        this.setState({
            bindModalShow: false,
            editRecord: {},
            device_id: "",
            agency_id: ""
        })
    };

    get_agency_list = (type, is_ap) => {
        if (is_ap) {
            this.props.dispatch({
                type: "ci3001Info/get_agency_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                }
            })
        } else {
            this.props.dispatch({
                type: "ci3001Info/get_agency_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: type
                }
            })
        }

    };

    get_cpe_template_agency = (record) => {
        this.props.dispatch({
            type: "ci3001Info/get_cpe_template_agency",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                agency_id: this.state.agency_id,
                model: record.model,
                device_id: 0
            }
        })
    };


    unbind_device = (record) => {
        this.props.dispatch({
            type: "ci3001Info/unbind_device",
            payload: {
                device_id: record.id,
                cta_id: record.cta_id,
                type:record.type
            }
        }).then(()=>{
            this.get_device_list();
        })
    };

    handleSearchSubmit = (value) => {
        this.setState({
            name: value,
        }, () => {
            this.get_device_list();
        })
    };

    handleSelectBindStatus = (value) => {
        this.setState({
            is_bind:value
        },()=>{
            this.get_device_list()
        })
    };

    handleSelectPowerStatus = (value) => {
        this.setState({
            power_status:value
        },()=>{
            this.get_device_list()
        })
    };


    render() {
        const columns = [{
            title: "@序列号",
            dataIndex: 'hard_sn',
            key: 'hard_sn',
            width:200,
            fixed:'left'
        }, {
            title: "@设备名称",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: "@企业",
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: "@设备状态",
            dataIndex: 'power_status',
            key: 'power_status',
            render:(text)=>{
                return text==='ON'?"@开机":"@关机"
            }
        }, {
            title: "@绑定状态",
            dataIndex: 'is_bind',
            key: 'is_bind',
            render: (text, record) => {
                return record.is_bind ? "@已绑定" : "@未绑定"
            }
        }, {
            title: "@设备型号",
            dataIndex: 'model',
            key: 'model',
        }, {
            title: "@设备类型",
            dataIndex: 'type',
            key: 'type',
            render:(text)=>{
                return deviceTypeMap(text)
            }

        }, {
            title: "@节点名称",
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: "@配置名称",
            dataIndex: 'cta_name',
            key: 'cta_name',
        }, {
            title: "@硬件ID",
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: "@操作",
            dataIndex: 'operation',
            key: 'operation',
            fixed:'right',
            width: 50,
            fixed:'right',
            render: (text, record) => {
                return <div style={{textAlign: "center", color: "#1890FF", cursor: "pointer"}}>
                    {!record.is_bind ? <Popconfirm title="@确认要绑定设备吗?" onConfirm={() => this.handleOpenBindModel(record)}><span>@绑定</span></Popconfirm> :
                        <Popconfirm title="@确认要解绑设备吗?" onConfirm={() => this.unbind_device(record)}><span>@解绑</span></Popconfirm>}
                </div>
            }
        },];

        const ModalOptions = {
            title: "@设备绑定",
            visible: this.state.bindModalShow,
            onCancel: this.handleCloseBindModel,
            dispatch: this.props.dispatch,
            submitType: "ci3001Info/bind_device",
            extraUpdatePayload: {device_id: this.state.device_id,type:this.state.editRecord.type},
            initPayload: {
                company_id: sessionStorage.getItem('companyId')==='1'?this.state.company_id:sessionStorage.getItem('companyId'),
                status: "INIT",
                name: this.state.name,
                is_bind: this.state.is_bind,
                power_status: this.state.power_status,
                by_ztp:1
            },
            initialValues: this.state.editRecord,
            InputItems: [{
                type: "Input",
                labelName: "@设备名称",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入设备名称"
                },
                rules: [{required: true, message: "@请输入设备名称"}, {
                    max: 128,
                    message: "@设备名称最多输入64字符"
                }],
            }, {
                type: "Plain",
                labelName: "@型号",
                valName: "model",
                content: this.state.editRecord.model,
                height: 32
            }, {
                type: "Plain",
                labelName: "@设备类型",
                valName: "type",
                content: deviceTypeMap(this.state.editRecord.type),
                height: 32,
            }, {
                type: "Select",
                labelName: "@节点名称",
                valName: "agency_id",
                nativeProps: {
                    placeholder: "@请选择节点名称"
                },
                rules: [{required: true, message: "@请选择节点名称"}],
                children: this.props.ci3001Info.agencyList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                }),
                onChange: (value, modalComponent) => {
                    this.setState({
                        agency_id: value
                    }, () => {
                        modalComponent.props.form.setFieldsValue({cta_id: undefined});
                        this.get_cpe_template_agency(this.state.editRecord)
                    })
                }
            }, this.state.editRecord.type!=='AP'?{
                type: "Select",
                labelName: "@配置名称",
                valName: "cta_id",
                nativeProps: {
                    placeholder: "@请选择配置名称"
                },
                rules: [{required: true, message: "@请选择配置名称"}],
                children: this.props.ci3001Info.templateList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                })
            }:{}]
        };

        const options = [<Option key="1" value={1}>@绑定</Option>,
            <Option key="0" value={0}>@未绑定</Option>];
        const optionsTwo = [<Option key="1" value="OFF">@关机</Option>,
            <Option key="0" value="ON">@开机</Option>];
         const optionsThree=this.props.ci3001Info.companyList.map((item)=>{
             return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
         });
        return (
            <Card className="card">
                {/* <div style={{position: 'absolute', top: 30}}>
                    <span>未激活设备:</span>&nbsp;&nbsp;<span>{this.props.ci3001Info.total}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>开机:</span>&nbsp;&nbsp;<span>4</span>
                </div> */}
                <HeaderBar hasSearch={true} hasSelect={true} selectPlaceHolder="@请选择绑定状态" hasSelectTwo={true}
                           optionsTwo={optionsTwo} hasSelectThree={this.companyId==='1'} optionsThree={optionsThree}
                           selectTwoPlaceHolder="@请选择设备状态" selectThreePlaceHolder="@请选择企业" selectThreeMethod={this.handleSelectCompany} submit={this.handleSearchSubmit}
                           selectOneMethod={this.handleSelectBindStatus} selectTwoMethod={this.handleSelectPowerStatus}
                           options={options}/>
                <BossTable columns={columns} dataSource={this.props.ci3001Info.deviceList}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default CI3001C;