/*@客户-上网策略*/
import React from 'react';
import {Card,Icon,Popconfirm,Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import './index.scss';
import BossEditModal from "../../Common/BossEditModal";
import {injectIntl} from "react-intl";
const Option=Select.Option;
class CI3401 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            editRecord:{},
            editId: "",
            selectName:"",
            selectedIds: [],
            selectedRecords: [],
            selectCompanyId:parseInt(sessionStorage.getItem("companyId")),
            company_id:parseInt(sessionStorage.getItem("companyId"))
        };

    }

    componentDidMount() {
       this.get_lan_strategy();
       this.get_company_list()
    }
    get_company_list = () => {
        this.props.dispatch({
            type: "ci3401Info/get_company_list",
            payload: {}
        })
    };
    get_lan_strategy=()=>{
        this.props.dispatch({
            type: "ci3401Info/get_lan_strategy",
            payload: {
                name:this.state.selectName,
                company_id:this.state.selectCompanyId
            }
        });
    }
    
    handleOpenAdd=()=>{
        this.get_agency_list_no_lan()
        this.setState({
            visible:true,
        }) 
    }


    search = (value) => {
        this.setState({
            selectName:value||""
        },function(){
           this.get_lan_strategy()
        })
    };
    edit = (record)=>{
        console.log(record)
        this.get_agency_list()
        this.setState({
            visible:true,
            editRecord: record,
            editId: record.id,
        })
    }
    closeAddModal=()=>{
        this.setState({
            visible:false,
            editRecord:{},
            editId: "",
        },function(){
            this.get_lan_strategy()
        })
    }
    handleChangeStatus = (value) => {
        this.setState({
            selectCompanyId: value || "",
        }, function () {
            this.get_lan_strategy()
        })
    };
    delete = (record) => {
        this.props.dispatch({
            type: "ci3401Info/delete_lan_strategy",
            payload: {
                init:{ids: [record.id],record:[record],selectName:this.state.selectName,selectCompanyId:this.state.selectCompanyId},
            }
        })
    };
    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "ci3401Info/delete_lan_strategy",
            payload: {
                init:{ids: this.state.selectedIds,record:this.state.selectedRecords,selectName:this.state.selectName,selectCompanyId:this.state.selectCompanyId},
            }
        })
    };
    get_agency_list_no_lan = () => {
        this.props.dispatch({
            type: "ci3401Info/get_agency_list",
            payload: {
                company_id: this.state.company_id,
                no_lan_strategy:1
            }
        })
    };
    get_agency_list = () => {
        this.props.dispatch({
            type: "ci3401Info/get_agency_list",
            payload: {
                company_id: this.state.company_id,
            }
        })
    };
    render() {
        const option = this.props.ci3401Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const inEnglish = window.appLocale.locale === "en-US";
        const modalFormLayout = inEnglish?{
            labelCol: {
                xs: {span: 9},
            },
            wrapperCol: {
                xs: {span: 15},
            },
        }:{
            labelCol: {
                xs: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        const ModalOptions = {
            title:this.state.editId ? "@编辑" :"@新增",
            visible:this.state.visible,
            initialValues:this.state.editRecord,
            dispatch:this.props.dispatch,
            submitType:this.state.editId ?"ci3401Info/update_lan_strategy":"ci3401Info/create_lan_strategy",
            onCancel: this.closeAddModal,
            bodyHeight:200,
            extraUpdatePayload: parseInt(sessionStorage.getItem("companyId"))===1?{id:this.state.editRecord.id}:{company_id:this.state.company_id,id:this.state.editRecord.id},
            initPayload: {selectName:this.state.selectName,selectCompanyId:this.state.selectCompanyId},
            InputItems: [parseInt(sessionStorage.getItem("companyId"))===1?{
                type: "Select",
                labelName:"@公司名称",
                valName: "company_id",
                nativeProps: {
                    disabled:!!this.state.editId,
                    placeholder:"@请选择公司"
                },
                customerFormLayout:modalFormLayout,
                rules: [{required: true, message: "@请选择公司"}],
                children:this.props.ci3401Info.companyList.map((item)=>{
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }
                }),
                onChange: (value, vm) => {
                    this.setState({
                        company_id:value
                    },()=>{
                        this.get_agency_list_no_lan()
                    })
                    vm.props.form.setFieldsValue({"agency_id": undefined,"agency_ids": undefined});
                },
            }:"",{
                type: "Select",
                labelName: "@节点名称",
                valName: this.state.editId ?"agency_id":"agency_ids",
                nativeProps: {
                    disabled:!!this.state.editId,
                    placeholder:"@请选择节点名称",mode:"multiple"
                },
                customerFormLayout:modalFormLayout,
                rules: [{required: true, message: "@请选择节点名称"}],
                children:this.props.ci3401Info.agencyList.map((item)=>{
                    if (item) {
                        return {key: item.id, value: item.id, name: item.name}
                    }
                })
            },{
                type: "Select",
                labelName: "@LAN口互联网访问策略",
                valName: "strategy",
                nativeProps: {
                    placeholder:"@请选择LAN口互联网访问策略"
                },
                customerFormLayout:modalFormLayout,
                rules: [{required: true, message: "@请选择LAN口互联网访问策略"}],
                children:[{key: "1", value: "allowed", name: "@不限制"},
                {key: "2", value: "disallowed", name: "@禁止"},
                {key: "3", value: "whitelist", name: "@白名单"},
                {key: "4", value: "blacklist", name: "@黑名单"},],
            }
        ]
        }
        let columns = [{
            title: '@节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        },{
            title: '@LAN口互联网访问策略',
            dataIndex: 'strategy',
            key: 'strategy',
            render:(text)=>{
                switch (text){
                case "whitelist":
                    return "@白名单";
                case "blacklist":
                    return "@黑名单";
                case "allowed":
                    return "@不限制";
                case "disallowed":
                    return "@禁止";
                default:
                    return ""
                }
            }
        },{
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return (
                    <div style={{display:"inline-block"}}>
                        <Icon type="edit" onClick={() => this.edit(record)} className="operations-edit-btn"/>
                        <Popconfirm title={"@确定删除当前信息?"} onConfirm={() => this.delete(record)}><Icon type="delete" style={{}} className="operations-delete-btn"/></Popconfirm>
                    </div>
                )
            }
        },];
        let companyName = {
            title: '@企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',

        };
        if (sessionStorage.getItem("role") !== "company" && sessionStorage.getItem("role") !== "companystaff") {
            columns.splice(1, 0, companyName);
        }

        return (
            <Card className="card">
                            <HeaderBar hasSearch={true} 
                            selectPlaceHolder={'@请选择企业名称'}
                            selectOneWidth={220}
                           options={option}
                           hasSelect={sessionStorage.getItem("companyId")==="1"}
                           selectOneMethod={this.handleChangeStatus}
                            hasAdd={true}
                            hasDelete={true}
                            delete={this.handleDeleteBatch}
                            selectedKeys={this.state.selectedIds}
                            add={this.handleOpenAdd}
                            submit={this.search}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            selectOneShowSearch={true}/>
                <BossTable columns={columns} dataSource={this.props.ci3401Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(CI3401);