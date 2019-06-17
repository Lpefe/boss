import {connect} from 'dva';
import BI1001C from '../../components/BI/BI1001/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1001Info }) {
    return {bi1001Info};
}

const BI1001R = Form.create()(BI1001C);

export default connect(mapDispatchToProps)(BI1001R);