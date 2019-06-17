import {connect} from 'dva';
import BI0701C from '../../components/BI/BI0701/index';
import {Form} from 'antd';

function mapDispatchToProps({ bi0701Info }) {
    return {bi0701Info};
}

const BI0701R = Form.create()(BI0701C);

export default connect(mapDispatchToProps)(BI0701R);