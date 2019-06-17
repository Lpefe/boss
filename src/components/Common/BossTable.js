/*@通用组件-表格*/

import React from 'react';
import {Table} from 'antd';
import PropTypes from 'prop-types';
import noWan from '../../assets/img/noWan.png'
import {AdaptiveCell} from "./adaptiveCell";
import './BossTable.scss';
class BossTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const components = {
            body: {
                cell: AdaptiveCell,
            },
        };
        const component=this.props.component;
        const pagination = {
            pageSize: 20,
            onChange:(page)=>{
                component.setState({
                    page_no:page
                },this.props.getData)
            },
            total:this.props.total,
            current:component?component.state.page_no:""
        };

        const paginationWithoutPaging={
            pageSize: 20,
        };

        return <Table components={components} scroll={{x:'max-content'}} bordered size="middle" rowKey={record => record.id} locale={{emptyText:<img src={noWan}/>}}
                      pagination={this.props.paging?pagination:paginationWithoutPaging} rowClassName="normal" {...this.props} />
    }
}


BossTable.propTypes = {
    total:PropTypes.number,
    getData:PropTypes.func,
    paging:PropTypes.bool,

};
BossTable.defaultProps = {};

export default BossTable;