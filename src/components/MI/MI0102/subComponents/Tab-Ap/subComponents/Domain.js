import React from 'react';
import {connect} from 'dva';
import {Row, Form, Select, Input, Card,Col,Table,Upload,Button} from 'antd';
import messages from '../../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import BossTable from "../../../../Common/BossTable";

import {commonTranslate} from "../../../../../utils/commonUtilFunc";

class Domain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ModalShow:false,
            selectedRowKeys:[],
            editRecord:{},
            editId:""
        }
    }

    componentDidMount =()=>{
        //this.props.onRef(this)
        this.get_cta_static_parse()
    }  
    get_cta_static_parse =()=>{
        this.props.dispatch({
            type: "ci2802Info/get_cta_static_parse",
            payload: {
                cta_id:this.props.id
            }
        });
    }
    render() {
        const __=commonTranslate(this);
        const columns = [{
            title: '@域名',
            dataIndex: 'name',
            key: 'name',
            
        }, {
            title: '@IP地址',
            dataIndex: 'ip',
            key: 'ip',            
        }];

        return <div className="CheckWAN"> 
            <p>域名解析</p>
            <BossTable columns={columns} dataSource={this.props.ci2802Info.dnsList}/>

        </div>
                    

    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Domain)));