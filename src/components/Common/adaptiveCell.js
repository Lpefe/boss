/**
 * 通用的表格操作项组件
 * */
import React from 'react'

class AdaptiveCell extends React.Component {
    state = {
        editing: false,
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>

            </td>
        );
    }
}

export { AdaptiveCell};