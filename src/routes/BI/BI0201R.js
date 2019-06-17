
import {connect} from 'dva';
import BI0201C from '../../components/BI/BI0201/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0201Info }) {
    return {bi0201Info};
}

const BI0201R = Form.create()(BI0201C);

export default connect(mapDispatchToProps)(BI0201R);