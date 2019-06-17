/*@客户-QoS配置*/
import React from 'react';
import {Form, Icon, Checkbox,Row,Col} from 'antd';
import {connect} from 'dva';
import './PriorityRatioSetup.scss';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../utils/commonUtilFunc";

const FormItem = Form.Item;


class LTEPrioritySetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
        }
    }


    changeMode = () => {
        this.setState({
            isEdit: true
        })
    };

    closeEditMode = () => {
        this.setState({
            isEdit: false,
        })
    };

    update_lte_allowed = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type:"ci0601Info/update_lte_allowed",
                    payload:{
                        company_id:sessionStorage.getItem("companyId"),
                        allowed:values.allowed.join(','),
                        record:{
                            company_id:sessionStorage.getItem("companyId"),
                            allowed:this.props.ci0601Info.lteAllowedData
                        }
                    }
                })
            }
        });
        this.setState({
            isEdit: false,
        })
    };


    render() {
        const __ = commonTranslate(this);
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 2},
            },
            wrapperCol: {
                xs: {span:22},
            },
        };
        return <div style={{marginBottom: 16,display:'inline-block',width:500}}>
            <div style={{marginBottom: 16}}>
                <span className="priority-title">{"@仅有LTE(4G)线路时,允许通过的应用级别"}</span><Icon onClick={this.changeMode} type="edit"/>
            </div>
            <Form layout="inline">
                 <FormItem label="" {...modalFormLayout}>
                     {getFieldDecorator("allowed", {
                        initialValue:this.props.ci0601Info.lteAllowedData.split(',')
                     })(
                         <Checkbox.Group style={{ width:300,marginTop:10 }}>
                             <Row>
                                 <Col span={6}><Checkbox disabled={!this.state.isEdit} value="1">{"@紧急"}</Checkbox></Col>
                                 <Col span={6}><Checkbox disabled={!this.state.isEdit} value="2">{"@高"}</Checkbox></Col>
                                 <Col span={6}><Checkbox disabled={!this.state.isEdit} value="3">{"@中"}</Checkbox></Col>
                                 <Col span={6}><Checkbox disabled={!this.state.isEdit} value="4">{"@低"}</Checkbox></Col>
                             </Row>
                         </Checkbox.Group>
                     )}
                </FormItem>
                {this.state.isEdit ? <div className="ratio-confirm" style={{display:"inline-block",verticalAlign:"top"}}>
                    <FormItem {...modalFormLayout}>
                        <Icon type="check" className="check" onClick={this.update_lte_allowed}/>
                    </FormItem>
                    <FormItem {...modalFormLayout}>
                        <Icon type="close" className="close" onClick={this.closeEditMode}/>
                    </FormItem>
                </div> : ""}
            </Form>
        </div>
    }
}

function mapDispatchToProps({ci0601Info}) {
    return {ci0601Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(LTEPrioritySetup)))
