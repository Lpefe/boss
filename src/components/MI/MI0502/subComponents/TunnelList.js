/*@运维-链路信息*/
import React from 'react';
import Tunnel from "./Tunnel";


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

export default TunnelList;