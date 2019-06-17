/*@运维-设备信息*/
import React from 'react';
import Tunnel from "./Tunnel";
import PropTypes from 'prop-types';

class TunnelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <div>
            {this.props.tunnelData.map((item,index) => {
                return <Tunnel data={item} key={index}/>
            })
            }
        </div>
    }

}
TunnelList.propTypes = {
    tunnelData:PropTypes.array,

};
export default TunnelList;