/*@运维-Docker管理*/
import React from 'react';
import {connect} from 'dva';

import BossEditModal from "./BossEditModal";

import {validateIp} from "../../../../utils/commonUtilFunc";
import {commonTranslate, parse} from '../../../../utils/commonUtilFunc';

import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';

import {Modal, Form, Select, Input, Divider,Button} from 'antd';



class BGPModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {

    }

    render() {
        const __=commonTranslate(this);
        const ModalOptions = {
            title: "@BGP配置",
            visible: this.props.visible,
            onCancel: this.props.cancel,
            dispatch: this.props.dispatch,
            submitType:  "mi1902Info/update_bgp",
            initPayload: {
                sn:this.props.record.sn,
                company_id:this.props.record.company_id,
                record:this.props.mi1902Info.bgp
            },
            initialValues: this.props.mi1902Info.bgp,
            InputItems: [
            {
                type:"Divider",
                labelName:"@基本参数",
            },    
            {
                type: "Input",
                labelName: "local_as",
                valName: "local_as",
                nativeProps: {
                    placeholder: "@请输入local_as"
                },
                rules: [{required: true, message:"@请输入local_as"}, {
                    pattern: /^[0-9]*[1-9][0-9]*$/,
                    message: "只能输入数字并且只能是整数",
                }],
            },{
                type: "Input",
                labelName:"local_ip",
                valName: "local_ip",
                nativeProps: {
                    placeholder: "@请输入local_ip"
                },
                rules: [{required: true, message:"@请输入local_ip",}, {validator: validateIp}],
            },{
                type: "Input",
                labelName: "remote_as",
                valName: "remote_as",
                nativeProps: {
                    placeholder: "@请输入remote_as"
                },
                rules: [{required: true, message:"@请输入remote_as",}, {pattern: /^[0-9]*[1-9][0-9]*$/,message: "@只能输入数字并且只能是整数",}],
            },{
                type: "Input",
                labelName: "remote_ip",
                valName: "remote_ip",
                nativeProps: {
                    placeholder: "@请输入remote_ip"
                },
                rules: [{required: true, message:"@请输入remote_ip",}, {validator: validateIp}],
            },{
                type: "Input",
                labelName:"holdtime",
                valName: "holdtime",
                nativeProps: {
                    placeholder: "@请输入holdtime"
                },
                rules: [{required: false, message:"@请输入holdtime",}, {pattern: /^[0-9]*[1-9][0-9]*$/,message: "@只能输入数字并且只能是整数",}],
            },{
                type: "Input",
                labelName: "password",
                valName: "password",
                nativeProps: {
                    placeholder: "@请输入password"
                },
                rules: [{required: false, message:"@请输入password",}, {max: 16, message: "@密码最多输入16字符",}],
            },{
                type:"Divider",
                labelName:"@收路由明细",
            }, {
                type:"Span",
            }, {
                type: "GroupInput",
                labelName:"@IP段",
                valName: "iptable",
                nativeProps: {
                    placeholder: "@IP段"
                },
                rules: [{validator: validateIp}],
            }]
        };

        return <BossEditModal {...ModalOptions}/>


    }

}
function mapDispatchToProps({mi1902Info}) {
    return {mi1902Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(BGPModal)));

























