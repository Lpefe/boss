/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import { Form, Button,Radio} from 'antd';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Firewall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount=()=>{
        this.get_physical_ports_info()
    }
    get_physical_ports_info=()=>{
        this.props.dispatch({
            type: "ci2802Info/get_physical_ports_info",
            payload: {
                cta_id:this.props.cta_id
            }
        });
    }
    Submit=()=>{
        this.props.dispatch({
            type:"ci2802Info/update_cpe_template_agency",
            payload:{
                firewall:this.props.form.getFieldValue("firewall"),
                id:this.props.cta_id,
            }
        }).then(
            this.props.vm.get_cpe_template_agency()
        )
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        return <div className="CheckWAN"> 
                <Button style={{float:"right"}} type="primary" onClick={()=>{this.Submit()}}>@保存配置</Button>
                <p className="p">@防火墙</p>
                <div className="ci28024G">
                    <Form layout='inline'>
                        <FormItem  key="firewall">
                            {getFieldDecorator("firewall", {
                                initialValue: this.props.ci2802Info.cpeTemplate[0].firewall,
                            })(
                                <RadioGroup 
                                    //onChange={}
                                    >
                                    <Radio value="OFF" key="OFF">@关闭</Radio>
                                    <Radio value="ON" key="ON">@开启</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Form>
                </div>
        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Firewall)));