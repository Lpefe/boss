/**
 * 表格通用组件,封装了部分通用的样式,和默认分页数
 **/

import React from 'react';
import {Table} from 'antd';
import PropTypes from 'prop-types';
class BossTableNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
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

        return <Table  bordered size="middle" rowKey={record => record.id}
                      pagination={this.props.paging?pagination:paginationWithoutPaging} rowClassName="normal newTable " {...this.props} />
    }
}


BossTableNew.propTypes = {
    total:PropTypes.number,
    getData:PropTypes.func,
    paging:PropTypes.bool,

};
BossTableNew.defaultProps = {};

export default BossTableNew;