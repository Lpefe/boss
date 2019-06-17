/*@通用组件-头部导航栏*/
import React from 'react';
import {Input} from 'antd';
import PropTypes from "prop-types";


class BossHeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    render() {
        return (
            <header className="header" style={{height: 32}}>
                <div className="left-header">
                    {
                        this.props.leftSection.map((child) => {
                            switch(child.type){
                                case "Input":
                                    break;
                                case "Button":
                                    break;
                                default:
                                    break;
                            }
                        })
                    }
                </div>
                <div className="right-header">
                    {
                        this.props.rightSection.map((child) => {
                            switch(child.type){
                                case "Input":
                                    break;
                                case "Button":
                                    break;
                                default:
                                    break;
                            }
                        })
                    }
                </div>
            </header>
        )
    }
}

BossHeaderBar.propTypes = {
    rightSection: PropTypes.object,
    leftSection:PropTypes.object,
};

export default BossHeaderBar;