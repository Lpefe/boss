/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Radio, Form, Select, Input, Button
    ,Icon} from 'antd';
import messages from '../LocaleMsg/messages';
import {validateIp, validatePort} from "../../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
let id = 0;
let item={
    type: "GroupInput",
    labelName: "@IP段",
    valName: "port",
    nativeProps: {
        placeholder: "@请输入端口"
    },
    rules: [{required: true, message: "@请输入端口"},],
    radioValue:""
}
class Access extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues:{port:this.props.ci2802Info.ipset}
        }

        this[`Id`] = 0;
    }
    componentDidMount=()=>{
        this.get_cta_lan()
    }
    get_cta_lan=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_lan",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    update_agency=(value)=>{
        this.props.dispatch({
            type: "ci2802Info/update_agency",
            payload: {
                id:this.props.agency_id,
                iptable:value
            }
        }).then(()=>{
            this.props.dispatch({
                type: "ci2802Info/get_cpe_template_agency",
                payload: {
                    id:this.props.cta_id,
                }
            })
        });
    }
    onChange = (e) => {
        this.setState({
            radioValue:e.target.value,
        })
        this.props.dispatch({
            type: "ci2802Info/get_ipset_by_cta_lan",
            payload: {
                cta_lan_id:e.target.value
            }
        }).then(()=>{
            this.setState({
                initialValues:{port:this.props.ci2802Info.ipset}
            },()=>{
                const {form} = this.props;
                let groupInputInitialValue = this.state.initialValues[item.valName];
                if (groupInputInitialValue) {
                    let initialKeys = [];
                    if (typeof groupInputInitialValue === 'string') {
                        groupInputInitialValue = groupInputInitialValue.split(',')
                    }
                    for (let i = 0; i < groupInputInitialValue.length; i++) {
                        initialKeys.push(i)
                    }
                    this[`Id`] = initialKeys.length;
                    let tempValObject = {};
                    tempValObject[`${item.valName}Keys`] = initialKeys;
                    form.setFieldsValue(tempValObject);
                }


            })
        });
    }
    handleSubmit = () => {
        let groupItems = [];
        groupItems.push(item.valName)

        this.props.form.validateFields((err, value) => {
            if (!err) {
                for (let index in groupItems) {
                    let temp = [];
                    for (let key in value) {
                        if (key.indexOf(groupItems[index]) === 0&&key!==groupItems[index]+'Keys') {
                            temp.push(value[key])
                            delete value[key]
                        }else if(key===groupItems[index]+'Keys'){
                            delete value[key]
                        }
                    }
                    value[groupItems[index]] = temp.join(",");
                }
                console.log(value)
                this.update_agency(value.port)
            }
        })
    };

      addInput = (item) => {
        const {form} = this.props;
        const keys = form.getFieldValue(`${item.valName}Keys`);
        //this[`Id`]=keys.length
        const nextKeys = keys.concat(this[`Id`]++);
        let tempValObject = {};
        tempValObject[`${item.valName}Keys`] = nextKeys;
        form.setFieldsValue(tempValObject)
    };

    deleteInput = (item, index) => {
        const {form} = this.props;
        const keys = form.getFieldValue(`${item.valName}Keys`);
        
        if (keys.length === 1) {
            return;
        }
        
        let tempValObject = {};
        tempValObject[`${item.valName}Keys`] = keys.filter(key => key !== index);
        form.setFieldsValue(tempValObject);
    };


      render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const modalFormLayoutWithoutLabel = {
            wrapperCol: {
                xs: {span: 19, offset: 1},
            }
        };
        let keys = {};
        let valueGroups = [];

        let initialKeys = [0];
        let groupInputInitialValue = this.state.initialValues[item.valName];
        if (groupInputInitialValue) {
            initialKeys = [];
            if (typeof groupInputInitialValue === 'string') {
                groupInputInitialValue = groupInputInitialValue.split(',')
            }
            for (let i = 0; i < groupInputInitialValue.length; i++) {
                initialKeys.push(i)
            }
        }
        getFieldDecorator(`${item.valName}Keys`, {initialValue: initialKeys});
        keys[`${item.valName}Keys`] = getFieldValue(`${item.valName}Keys`);
            
        

        if (typeof this.state.initialValues[item.valName] === "string" && this.state.initialValues[item.valName]) {
            valueGroups = this.state.initialValues[item.valName].split(',');
        }else if(Array.isArray(this.state.initialValues[item.valName])){
            valueGroups = this.state.initialValues[item.valName]
        }

        return <div className="CheckWAN"> 
        <Button style={{float:"right"}} type="primary"  onClick={() => this.handleSubmit()}>@保存配置</Button>
        <p className="p">@私网IP</p>
            <div style={{background:"rgba(249,249,249,1)",width:"100%",padding:"20px",marginBottom:"20px",}}>
            <span>@广播域</span>
            <FormItem {...(modalFormLayoutWithoutLabel)} key="广播域:" style={item.style}>
                <RadioGroup onChange={this.onChange} value={this.state.radioValue}>
                    {this.props.ci2802Info.dataLan.map((item)=>{
                        return <Radio value={item.id}>{item.name}</Radio>
                    })}
                </RadioGroup>
            </FormItem>
            <span>{item.labelName}:</span>
                {keys[`${item.valName}Keys`].map((key, index) => {
                    return<Form  onSubmit={this.handleSubmit}> 
                    <FormItem
                        // label={index === 0 ? item.labelName : ""} 
                        {...(modalFormLayoutWithoutLabel)}
                        key={index} style={item.style}>
                        <div>
                            {getFieldDecorator(item.valName + key, {
                                  rules: [{validator: validateIp},],
                                initialValue: valueGroups[key]
                            })(
                                <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}}
                                        disabled={item.disabled}/>
                            )}
                            {keys[`${item.valName}Keys`].length > 1 ?
                                <Button shape="circle" icon="minus"
                                        onClick={() => this.deleteInput(item, key)}
                                        disabled={item.disabled}/> : ""}
                        </div>
                    </FormItem></Form>
                })}
                <Form.Item label= " " {...modalFormLayoutWithoutLabel}>
                    <Button type="dashed" onClick={() => this.addInput(item)}>
                        <Icon type="plus"/> @添加输入项
                    </Button>
                </Form.Item>
            </div>
        </div>;
    }
}
function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Access)));