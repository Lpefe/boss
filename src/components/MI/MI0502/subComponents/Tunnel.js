/*@运维-链路信息*/
import React from 'react';
import {Steps, Icon} from 'antd';
import {injectIntl} from "react-intl";
const Step = Steps.Step;

class StepsUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <Steps style={{marginBottom: 16}}>
            {this.props.data.map((item,index)=>{
                return <Step key={index} status="finish" icon={<Icon type="sync"/>} title={item.isp} description={<div><div>IP:{item.ip}</div><div>{"@端口"}:{item.port}</div></div>}/>
            })}
        </Steps>
    }
}

export default injectIntl(StepsUnit);