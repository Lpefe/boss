import {connect} from 'dva';
import BI1101C from '../../components/BI/BI1101/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1101Info }) {
    return {bi1101Info};
}

const BI1101R = Form.create()(BI1101C);

export default connect(mapDispatchToProps)(BI1101R);