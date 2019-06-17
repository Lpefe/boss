
import {connect} from 'dva';
import BI0101C from '../../components/BI/BI0101/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0101Info }) {
    return {bi0101Info};
}

const BI0101R = Form.create()(BI0101C);

export default connect(mapDispatchToProps)(BI0101R);