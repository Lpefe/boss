import {connect} from 'dva';
import BI1902C from '../../components/BI/BI1902/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1902Info }) {
    return {bi1902Info};
}

const BI1902R = Form.create()(BI1902C);

export default connect(mapDispatchToProps)(BI1902R);