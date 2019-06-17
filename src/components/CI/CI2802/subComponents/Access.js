/*@客户-配置管理*/
import React from 'react';
import {connect} from 'dva';
import {Form} from 'antd';
import {injectIntl} from "react-intl";
import Bypass from "../../../../assets/img/Rectangle 2 Copy.png";
import Router from "../../../../assets/img/Rectangle 2.png";
import Icon from "../../../../assets/img/Group 6 Copy.png";



class Access extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId:0,
            click:false
        }
    }
    componentDidMount=()=>{
        this.get_physical_ports_info()
        this.props.onRef(this)
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
        var in_type=""
        if(this.state.activeId===1){
            in_type="router"
            this.props.dispatch({
                type: "ci2802Info/update_cpe_template_agency",
                payload: {
                    id:this.props.cta_id,
                    in_type:in_type
                }
            }).then(
                this.props.vm.get_cpe_template_agency()
            ).then(
                this.props.vm.handelUploadModalClose()
            );
        }else if(this.state.activeId===2){
            in_type="bypass"
            this.props.dispatch({
                type: "ci2802Info/update_cpe_template_agency",
                payload: {
                    id:this.props.cta_id,
                    in_type:in_type
                }
            }).then(
                this.props.vm.get_cpe_template_agency(),
            ).then(
                this.props.vm.handelUploadModalClose()
            );
        }
    };
    Click = (e) => {
                this.setState({click: true,activeId:e},function(){})
            }
    render() {
        return <div style={{height:"240px"}}>
            {/* <div className="ci2802Name"  style={{marginBottom:"20px"}}>接入模式</div> */}
            <div 
                onClick={()=>{this.Click(1)}}
                className={this.state.click?(parseInt(this.state.activeId)===1?"ci2802Active":"ci2802NoActive"):(this.props.ci2802Info.cpeTemplate[0]?(this.props.ci2802Info.cpeTemplate[0].in_type==="router"?"ci2802Active":"ci2802NoActive"):"")} 
                style={{width:"314px",height:"235px", float:"left",position:"relative",}}>
                <img src={Router} alt=""></img>
                <img className={this.state.click?(parseInt(this.state.activeId)===1?"iconActive":"iconNoActive"):(this.props.ci2802Info.cpeTemplate[0]?(this.props.ci2802Info.cpeTemplate[0].in_type==="router"?"iconActive":"iconNoActive"):"")}  src={Icon} alt=""></img>
            </div>
            <div 
                onClick={()=>{this.Click(2)}}
                className={this.state.click?(parseInt(this.state.activeId)===2?"ci2802Active":"ci2802NoActive"):(this.props.ci2802Info.cpeTemplate[0]?(this.props.ci2802Info.cpeTemplate[0].in_type==="bypass"?"ci2802Active":"ci2802NoActive"):"")} 
                style={{width:"314px",height:"235px", float:"left",position:"relative", marginLeft:"30px"}}>
                <img src={Bypass} alt=""></img>
                <img className={this.state.click?(parseInt(this.state.activeId)===2?"iconActive":"iconNoActive"):(this.props.ci2802Info.cpeTemplate[0]?(this.props.ci2802Info.cpeTemplate[0].in_type==="bypass"?"iconActive":"iconNoActive"):"")}  src={Icon} alt=""></img>
            </div>
            {/* <Button style={{float:"right"}} type="primary" onClick={()=>{this.Submit()}}>保存</Button> */}

        </div>
    }

}

function mapDispatchToProps({ci2802Info}) {
    return {ci2802Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Access)));