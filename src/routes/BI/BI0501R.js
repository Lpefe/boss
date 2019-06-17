
import {connect} from 'dva';
import BI0501C from '../../components/BI/BI0501/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0101Info }) {
    return {bi0101Info};
}

const BI0501R = Form.create()(BI0501C);

export default connect(mapDispatchToProps)(BI0501R);