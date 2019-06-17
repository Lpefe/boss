/*@客户-企业信息*/
import React from 'react';
import {Form, Modal, Input} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const Search = Input.Search;

class SecretKeyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            record:{},
        }
    }

    handleOpenEditModal = () => {
        this.setState({
            editMode: true,
            record:{secret_key:this.props.ci1001Info.companyInfo.secret_key}
        })
    };
    handleCloseEditModal = () => {
        this.setState({
            editMode: false,
        })
    };
    handleSubmitEditSecretKey=()=>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                this.props.dispatch({
                    type:"ci1001Info/update_company",
                    payload:{
                        id:sessionStorage.getItem("companyId"),
                        secret_key:values.secret_key,
                        record:this.state.record
                    }
                });
                this.handleCloseEditModal();
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 4},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return (<div style={{textAlign: "center", paddingTop: 200,paddingBottom:200}}>
            <Search enterButton={'@修改秘钥'} style={{width: 400}} size="large" onSearch={this.handleOpenEditModal}
                    value={this.props.ci1001Info.companyInfo.secret_key}/>
            <Modal maskClosable={false} title={'@修改秘钥'} visible={this.state.editMode} onSearch={this.handleOpenEditModal}
                   onCancel={this.handleCloseEditModal} onOk={this.handleSubmitEditSecretKey} destroyOnClose>
                <Form>
                    <FormItem label={'@新秘钥'} {...modalFormLayout}>
                        {getFieldDecorator('secret_key', {
                            rules: [{required: true, message: '@请输入新秘钥'},{len:32,message:'@请输入32位秘钥'}],
                        })(
                            <Input placeholder={'@请输入新秘钥'}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        </div>)
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(SecretKeyInfo)));