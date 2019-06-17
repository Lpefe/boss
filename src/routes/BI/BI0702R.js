import {connect} from 'dva';
import BI0702C from '../../components/BI/BI0702/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0702Info }) {
    return {bi0702Info};
}

const BI0702R = Form.create()(BI0702C);

export default connect(mapDispatchToProps)(BI0702R);