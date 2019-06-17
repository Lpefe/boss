import {connect} from 'dva';
import BI1904C from '../../components/BI/BI1904/Index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1904Info }) {
    return {bi1904Info};
}

const BI1904R = Form.create()(BI1904C);

export default connect(mapDispatchToProps)(BI1904R);