/*@运维-设备信息*/
import React from 'react';
import {Form} from 'antd';
import {connect} from 'dva';
import {withRouter} from 'react-router-dom'
import {parse} from "../../../../../utils/commonUtilFunc";
import CI2802 from "../../../../CI/CI2802/Index";


class NetworkInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    componentDidMount() {
        this.get_cpe_template_agency();
    }

    get_cpe_template_agency() {
        this.props.dispatch({
            type: "mi0102Info/get_cpe_template_agency",
            payload: {
                device_id: parse(this.props.location.search).id
            }
        })
    }


    render() {
        return (
            <div>
                {this.props.mi0102Info.ctaId === "" ? "" :
                    <CI2802 agency_id="1" id={this.props.mi0102Info.ctaId} Check={false} header={false}/>}
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(withRouter(NetworkInfo)));