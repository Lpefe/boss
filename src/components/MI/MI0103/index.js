/**
 * 组件demo
 **/
import React from 'react';
import {parse} from '../../../utils/commonUtilFunc';


class MI0103 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        this.get_tunnel_port();
        localStorage.removeItem("go_default_prefs");
    }
    get_tunnel_port=()=>{
        this.props.dispatch({
            type:"mi0103Info/get_tunnel_port",
            payload:{
                sn:parse(this.props.location.search).sn
            }
        })
    };

    render() {
        return (
            <div style={{backGroundColor: "#000"}}>
                <div id="gateone_container" style={{
                    width: document.body.clientWidth,
                    height: document.body.clientHeight,
                    position: "relative"
                }}>
                    <div id="gateone" style={{
                        width: document.body.clientWidth,
                        height: document.body.clientHeight,
                    }}>
                    </div>
                </div>
            </div>
        )
    }
}

export default MI0103;