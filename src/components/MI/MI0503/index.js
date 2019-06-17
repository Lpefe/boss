/*
* 人工选路*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import {Checkbox, Form, Input, Button, Modal,Card} from 'antd';
import {parse} from '../../../utils/commonUtilFunc';

const FormItem = Form.Item;
const {TextArea} = Input;

class MI0503 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableText: false,
        }
    }

    componentDidMount() {
        this.get_manual_link_path_example();
        if(parse(this.props.location.search).assign_type==="manual"){
            this.get_manual_link_path_placeholder();
        }
        this.setState({
            disableText: parse(this.props.location.search).assign_type !== "manual"
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const search=parse(this.props.location.search);
        const {form} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                if (values.text === "") {
                    this.props.dispatch({
                        type: "mi0501Info/handleSubmit",
                        payload: {
                            assign_type: values.assign_type ? "manual" : "auto",
                            text:values.text,
                            id: search.id,
                            vm: this,
                            record:{
                                name:search.name,
                                company_id:search.company_id,
                                assign_type:search.assign_type,
                            }
                        }
                    })
                } else {
                    if (this.isJSON(values.text)) {
                        this.props.dispatch({
                            type: "mi0501Info/handleSubmit",
                            payload: {
                                assign_type: values.assign_type ? "manual" : "auto",
                                text: JSON.parse(values.text),
                                id: parse(this.props.location.search).id,
                                vm: this,
                                record:{
                                    name:search.name,
                                    company_id:search.company_id,
                                    assign_type:search.assign_type,
                                }
                            }
                        })
                    }
                }

            }
        });
    };

    isJSON = (str) => {
        if (typeof str === 'string') {
            try {
                let obj = JSON.parse(str);
                return (typeof obj === 'object') && obj
            } catch (e) {
                Modal.warning({
                    title: "人工选路配置格式错误!"
                });
                return false;
            }
        }
        console.log('It is not a string!')
    };

    get_manual_link_path_example = () => {
        this.props.dispatch({
            type: "mi0501Info/get_manual_link_path_example",
            payload: {
                link_id: parse(this.props.location.search).id
            }
        })
    };
    get_manual_link_path_placeholder=()=>{
        this.props.dispatch({
            type: "mi0501Info/get_manual_link_path_placeholder",
            payload: {
                link_id: parse(this.props.location.search).id
            }
        })
    };


    handleCheckboxChange = (e) => {
        this.setState({
            disableText: !(e.target.checked)
        },()=>{
            if(this.state.disableText){
                this.props.form.setFieldsValue({text:""})
            }
        })
    };
    handleCancel = () => {
        this.props.history.push("/main/mi0501")
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const search=parse(this.props.location.search);
        const {mi0501Info}=this.props;

        return (
            <Card className="card">
                <Form>
                    <FormItem>
                        {getFieldDecorator('assign_type', {
                            valuePropName: "checked",
                            initialValue:search.assign_type === "manual"
                        })(
                            <Checkbox onChange={this.handleCheckboxChange}>启用人工选路模式</Checkbox>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('text', {
                            initialValue:mi0501Info.manual_link_path_placeholder,
                        })(
                            <TextArea autosize={{minRows: 6, maxRows: 12}} disabled={this.state.disableText}/>
                        )}
                    </FormItem>
                </Form>
                <h3>示例</h3>
                <div style={{marginBottom: 24}}>{mi0501Info.manualLinkPathExample}</div>
                <Button onClick={this.handleSubmit} style={{marginRight: 8}}>确定</Button>
                <Button onClick={this.handleCancel}>取消</Button>
            </Card>
        )
    }
}

export default MI0503;