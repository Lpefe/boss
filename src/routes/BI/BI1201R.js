
import {connect} from 'dva';
import BI1201C from '../../components/BI/BI1201/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi1201Info }) {
    return {bi1201Info};
}

const BI1201R = Form.create()(BI1201C);

export default connect(mapDispatchToProps)(BI1201R);