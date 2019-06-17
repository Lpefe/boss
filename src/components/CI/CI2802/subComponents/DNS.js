/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Select, Button,Radio,Input,} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import BossTable from "../../../Common/BossTable";
import Operations from "../../../Common/Operations";
import BossEditModal from "../../../Common/BossEditModal";
import {commonTranslate,validateIp} from "../../../../utils/commonUtilFunc";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {BossMessage} from "../../../Common/BossMessages";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class DNS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRecord: {},
            editId: "",
            required:true
        }
    }
    componentDidMount=()=>{
        this.get_cpe_template_agency();
        this.get_cta_static_parse()
    }
    get_cpe_template_agency =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cpe_template_agency",
            payload: {
                id:this.props.cta_id
            }
        });
    }
    get_cta_static_parse =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_static_parse",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
        },  ()=> {
            this.get_cta_static_parse()
        })
    }
    handleOpenAdd=()=>{
        if(this.props.ci2802Info.dnsList.length>2047){
            BossMessage(false, "DNS最多只能添加2048个，请删除后再添加");
        }else{
            this.setState({
                visible: true,
            })   
        }
    }
    edit = (record)=>{
        this.setState({
            visible: true,
            editRecord: record,
            editId: record.id,
        }, ()=> {
            //this.get_cta_wan()
        })
    }
   delete = (record) => {
        this.props.dispatch({
            type: "ci2802Info/delete_cta_static_parse",
            payload: {
                records:[record],
                ids: [record.id],
                cta_id:this.props.cta_id
            }
        })
    };
    Submit=()=>{
        this.props.dispatch({
            type:"ci2802Info/update_cpe_template_agency",
            payload:{
                global_dns:this.props.form.getFieldValue("global_dns"),
                global_dns_backup:this.props.form.getFieldValue("global_dns_backup"),
                id:this.props.cta_id,
            }
        }).then(
            this.props.vm.get_cpe_template_agency()
        )
    };
    render() {
        const modalFormLayout = {
            labelCol: {
                xs: {span: 14},
            },
            wrapperCol: {
                xs: {span: 10},
            },
        };
        const ModalOptions = {
            title: this.state.editId ? "@编辑" :"@新增",
            visible: this.state.visible,
            customerFormLayout:modalFormLayout,
            initialValues: this.state.editRecord,
            bodyHeight:250,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2802Info/update_cta_static_parse" : "ci2802Info/create_cta_static_parse",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {cta_id:this.props.cta_id,id:this.state.editId},
            initPayload: {},
            parentVm: this,
            InputItems: [
            {
                type: "Input",
                labelName: "@域名",
                valName: "name",
                nativeProps: {
                    placeholder: "@请输入域名"
                },
                rules: [{required: true, message:"@请输入域名"},{
                    pattern: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
                    message: "@请输入正确的域名格式"
                }],

            },{
                type: "Input",
                labelName: "@IP地址",
                valName: "ip",
                nativeProps: {
                    placeholder: "@请输入IP地址"
                },
                rules: [{validator: validateIp},{required: true, message: "@请输入IP地址"}],
            },
        ]
        };
        const columns = [{
            title: '@域名',
            dataIndex: 'name',
            key: 'name',
            
        }, {
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',            
        },{
            title: '@操作',
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed:'right',
            width:100,
            render: (index, record) => {
                return <div>
                <Operations 
                hasEdit={true} hasDelete={true} 
                delete={() => this.delete(record)}
                edit={() => this.edit(record)}
                />
            </div>
            }
        },];
        
        const {getFieldDecorator} = this.props.form;
        return <div className="CheckWAN"> 
                <Button style={{float:"right"}} type="primary" onClick={()=>{this.Submit()}}>@保存配置</Button>
                <p className="p">DNS</p>
                <div className="ci28024G">
                    <Form layout='inline'>
                    <FormItem label="@首选DNS服务器" key="global_dns">
                            {getFieldDecorator("global_dns", {
                                  rules: [{validator: validateIp},],
                                initialValue: this.props.ci2802Info.cpeTemplate[0].global_dns===""?"114.114.114.114":this.props.ci2802Info.cpeTemplate[0].global_dns,
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label="@备用DNS服务器" key="global_dns_backup">
                            {getFieldDecorator("global_dns_backup", {
                                  rules: [{validator: validateIp},],
                                initialValue: this.props.ci2802Info.cpeTemplate[0].global_dns_backup===""?"8.8.8.8":this.props.ci2802Info.cpeTemplate[0].global_dns_backup,
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Form>
                </div>
                <p style={{marginTop:20}}>@域名解析</p>

                <HeaderBar  hasAdd={true} add={this.handleOpenAdd}/>
                <BossTable columns={columns} dataSource={this.props.ci2802Info.dnsList}/>
                <BossEditModal {...ModalOptions} />

        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(DNS)));