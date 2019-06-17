import React from 'react';
import PropTypes from 'prop-types';
import {Menu,Dropdown} from 'antd';

class MultipleTableItemDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        const menu=<Menu>{this.props.data.map((item)=>{
            return <Menu.Item key={item}>{item}</Menu.Item>
        })}</Menu>;
        return <Dropdown overlay={menu} placement="topCenter"><div style={{color:"#1493ff"}}>any</div></Dropdown>
    }
}


MultipleTableItemDropdown.propTypes={
    data:PropTypes.array
};

export default MultipleTableItemDropdown;
