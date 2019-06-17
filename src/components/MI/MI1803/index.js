/*@运维-告警配置*/
import React from 'react';
import {Card,Select,Modal} from 'antd';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import {injectIntl} from "react-intl";
const Option = Select.Option;

class MI1803C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            editRecord:{},
            selectedIds:"",
            selectedRecords:{},
            companyId:""
        };

    }

    componentDidMount() {
        this.get_company_list();
    }


    get_company_list=()=>{
        this.props.dispatch({
            type:"mi1803Info/get_company_list",
            payload:{
               company_id:this.state.companyId||""
            }
        })
    };
    edit=(record)=>{
        this.setState({
            editRecord:record,
            ModalShow:true
        })
    }
    batchEdit = () => {
        if (this.state.selectedIds.length > 0) {
            this.setState({
                ModalShow: true
            })
        } else {
            Modal.warning({
                title: "@请选择至少一项"
            })
        }
    };
    closeModal=()=>{
        this.setState({
            editRecord:{},
            ModalShow:false
        })
    }
    handleSelect=(value)=>{
        this.setState({
            companyId:value
        },()=>{
            this.get_company_list()
        })
    }
    render() {
        const rowSelection = {
            fixed: true,
            selectedRowKeys:this.state.selectedIds,
            onChange: (selectedRowKeys,selectedRecords) => {
                console.log(selectedRowKeys)
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords:selectedRecords
                })
            }
        };
        const ifCompany = sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff";
        const optionsCompany=this.props.mi1803Info.companyList.map((item)=>{
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        const columns=[
            {
                title: "@企业名称",
                dataIndex: "company_abbr",
                key: "company_abbr",
            },{
                title: "@配置信息",
                dataIndex: "dingding_token",
                key: "dingding_token",
                render:(index,record)=>{
                    return <div>
                        <p style={{marginBottom:0}}>@钉钉机器人token：{record.dingding_token}</p>
                        <p style={{marginBottom:0}}>@企业微信信息：{record.wx_id+record.wx_agent_id+record.wx_secret}</p>
                    </div>
                }
            },{
                title: "@禁止的Level",
                dataIndex: "forbidden_levels",
                key: "forbidden_levels",
                render:(index,record)=>{
                    let levels = []
                    index.split(",").map((item)=>{
                        switch (item) {
                            case "1":
                                levels.push("@程序问题")
                                break
                            case "2":
                                levels.push("@网络质量")
                                break
                            case "3":
                                levels.push("@设备OFF" )
                                break                   
                            case "4":
                                levels.push("@基础设施")
                                break
                            default:
                                break
                        }
                    })
                    return levels.join(",")
                }
            },{
                title: "@操作",
                dataIndex: 'operation',
                key: 'operation',
                width: 100,
                align: "center",
                fixed:"right",
                render: (index, record) => {
                    return (
                        <Operations hasExtra={false} hasDelete={false} hasEdit={true}
                                    edit={() => this.edit(record)} />
                    )
                }
            }];
            const ModalOptions = {
                title: "@禁止的Level",
                visible: this.state.ModalShow,
                onCancel: this.closeModal,
                dispatch: this.props.dispatch,
                submitType: "mi1803Info/update_company",
                initPayload: {
                    companyId:this.state.editRecord.id?this.state.editRecord.id:this.state.selectedIds,selectCompanyId:this.state.companyId
                },
                hasSubmitCancel: true,
                submitCancel: () => {
                    this.setState({
                        selectedIds:[]
                    })
                    this.closeModal()
                },
                extraUpdatePayload: {},
                initialValues: {},
                bodyHeight: 200,
                InputItems: [
                {
                    type: "CheckboxGroup",
                    labelName: "@禁止推送",
                    valName: "forbidden_levels",
                    checkBoxName: "@已预订",
                    initialValue:this.state.editRecord.forbidden_levels?this.state.editRecord.forbidden_levels.split(","):"",
                    nativeProps: {
                        style:{width:400},
                        extra:"@勾选后，将不再向用户推送该等级对应的告警信息。"
                    },
                    rules: [],
                    children: [
                        {label: "@程序问题", value: "1", key: "1"}, 
                        {label: "@网络质量",value: "2", key: "2"}, 
                        {label: "@设备OFF", value: "3", key: "3"}, 
                        {label: "@基础设施",value: "4", key: '4'}
                    ],
                }]
            };
        return (
            <Card className='card'>
                <HeaderBar 
                hasSearch={true}
                submit={this.handelSearchSubmit}
                hasSelect={!ifCompany}
                hasNotSearchInput={true}
                options={optionsCompany} 
                selectOneMethod={this.handleSelect}
                selectPlaceHolder={"@请选择公司"}
                hasExtraBtnThree={!ifCompany}
                extraBtnNameThree={"@批量修改"}
                btnThreeFunc={this.batchEdit}
                selectedKeys={this.state.selectedIds}
                selectOneWidth={150} 
                />
                <BossEditModal {...ModalOptions} refs={this.onRef}/>
               <BossTable columns={columns} dataSource={this.props.mi1803Info.companyList} rowSelection={rowSelection}/>
            </Card>
        )
    }
}

export default injectIntl(MI1803C);