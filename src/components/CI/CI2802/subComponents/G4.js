/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Form,Button,Radio} from 'antd';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class G4 extends React.Component {
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
                lte:this.props.form.getFieldValue("lte"),
                id:this.props.cta_id,
            }
        }).then(
            this.props.vm.get_cpe_template_agency()
        )
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        return <div className="CheckWAN"> 
                {this.props.ci2802Info.cpeTemplate[0].lte?<Button style={{float:"right"}} type="primary" onClick={()=>{this.Submit()}}>@保存配置</Button>:""}
                <p className="ci2802AgencyName p"  style={{marginBottom:"20px"}}>4G</p>
                <div className="ci28024G">
                    {this.props.ci2802Info.cpeTemplate[0].lte?<Form layout='inline'>
                        <FormItem label="4G" key="lte">
                            {getFieldDecorator("lte", {
                                initialValue: this.props.ci2802Info.cpeTemplate[0].lte,
                            })(
                                <RadioGroup 
                                    //onChange={}
                                    >
                                    <Radio value="OFF" key="OFF">@关闭</Radio>
                                    <Radio value="ON" key="ON">@开启</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Form>:"@无4G模块"}
                </div>
        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(G4)));