/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Select, Input, InputNumber} from 'antd';
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const Option = Select.Option;

class Access extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }



    render() {
        return <div>Wan</div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Access)));