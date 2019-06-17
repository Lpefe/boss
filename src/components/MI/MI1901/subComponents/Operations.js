/*@运维-Docker管理*/
import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm, Tooltip} from 'antd';
import "./Operations.scss";
import {injectIntl} from "react-intl";

class Operations extends React.Component {
    render() {
        return <div style={{display: "inline-block"}}>
            {this.props.hasEdit ? <Icon type="edit" style={{cursor: "pointer"}} onClick={this.props.edit}
                                        className="operations-edit-btn"/> : ""}
            {this.props.hasDelete ? <Popconfirm title={"@确定删除当前信息?"} onConfirm={this.props.delete}>
                <Icon type="delete" style={{cursor: "pointer"}} className="operations-delete-btn"/>
            </Popconfirm> : ""}
            {this.props.hasExtra ?
                <Tooltip title={this.props.extraToolTip}><span style={{cursor: "pointer", color: this.props.color}}
                                                               className="operations-ellipsis-btn"
                                                               onClick={this.props.extra}>{this.props.name}</span></Tooltip> : ""}
            {this.props.hasExtraPopConfirm ? <Popconfirm title={this.props.extraPopConfirmTitle}
                                                         onConfirm={this.props.extraPopConfirmMethod}><Tooltip
                title={this.props.extraPopConfirmToolTip}><span style={{cursor: "pointer", color: this.props.color}}
                                                                className="operations-ellipsis-btn">{this.props.extraPopConfirmName}</span></Tooltip></Popconfirm> : ""}
        </div>
    }
}

Operations.propTypes = {
    edit: PropTypes.func,
    delete: PropTypes.func,
    hasExtra: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    extra: PropTypes.func,
    extraToolTip: PropTypes.string,
    hasExtraPopConfirm: PropTypes.bool,
    extraPopConfirmTitle: PropTypes.string,
    extraPopConfirmMethod: PropTypes.func,
    extraPopConfirmName: PropTypes.string,
    extraPopConfirmToolTip: PropTypes.string
};


export default injectIntl(Operations);

