/*@客户-企业信息*/
import React from 'react';
import './index.scss';
import {Tabs,Card} from 'antd';
import BaseInfo from './subComponents/Baseinfo';
import ContactInfo from "./subComponents/ContactInfo";
import SecretKeyInfo from "./subComponents/SecretKeyInfo";
import {parse} from '../../../utils/commonUtilFunc';
import ContractInfo from "./subComponents/ContractInfo";
import {injectIntl} from "react-intl";
import FunctionInfo from "./subComponents/FunctionInfo";
const TabPane = Tabs.TabPane;

class CI1001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.id=parse(this.props.location.search).id;
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"
    }
    componentDidMount(){

    }

    render() {
        return (
            <Card className="card">
                <Tabs defaultActiveKey='1'>
                    <TabPane tab={'@基本信息'} key="1">
                        <BaseInfo id={this.id}/>
                    </TabPane>
                    <TabPane tab={'@联系人信息'} key="2">
                        <ContactInfo id={this.id}/>
                    </TabPane>
                    {this.isBusiness?"":<TabPane tab={'@秘钥信息'} key="5">
                        <SecretKeyInfo id={this.id}/>
                    </TabPane>}
                    {this.isBusiness?<TabPane tab={'@合同'} key="7">
                        <ContractInfo id={this.id}/>
                    </TabPane>:""}
                    {this.isBusiness?"":<TabPane tab={'@功能配置'} key="8">
                        <FunctionInfo/>
                    </TabPane>}
                </Tabs>
            </Card>
        )
    }
}

export default injectIntl(CI1001);