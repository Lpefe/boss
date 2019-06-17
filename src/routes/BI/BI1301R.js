
import {connect} from 'dva';
import BI1301C from '../../components/BI/BI1301/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1301Info }) {
    return {bi1301Info};
}

const BI1301R = Form.create()(BI1301C);

export default connect(mapDispatchToProps)(BI1301R);