/*@客户-首页*/
import React from 'react';
import './index.scss';
import MapView from './subComponents/MapView/index';
import TableView from './subComponents/TableView/index';

class CI0801 extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            viewType: "map"
        };
    }
    switchView = (value) => {
        this.setState({
            viewType: value
        })
    };
    render() {
        return (
            this.state.viewType === "map" ? <div style={{marginTop:16}}>
                    <MapView switch={this.switchView}/>
                </div> :
                <div style={{marginTop:8}}>
                    <TableView switch={this.switchView}/>
                </div>
        )
    }
}

export default CI0801;